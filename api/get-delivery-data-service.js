// services/delivery-data-service.js
import { holidayAPI } from './get-delivery-holiday-api.js';

export class DeliveryDataService {
    constructor() {
        this.cache = null;
        this.cacheTimestamp = null;
        this.cacheExpiry = 10 * 60 * 1000; // 10분
    }

    async fetchSheetData() {
        try {
            const response = await fetch('/api/delivery');
            const data = await response.json();
            
            const expandedData = data.map(row => {
                if (!row) return Array(9).fill('');
                const newRow = [...row];
                while (newRow.length < 9) {
                    newRow.push('');
                }
                return newRow;
            });
            
            return expandedData;
        } catch (error) {
            console.error('시트 데이터 로드 실패:', error);
            return this.getDummyData();
        }
    }

    getDummyData() {
        const today = new Date();
        const dummyData = [
            ['날짜', '요일', '공휴일', '임시공휴일', '기타', '배송YN', '이슈', '공지제목', '공지내용']
        ];
        
        for (let i = 0; i < 30; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() + i);
            const dateStr = `${date.getFullYear()}. ${String(date.getMonth() + 1).padStart(2, '0')}. ${String(date.getDate()).padStart(2, '0')}`;
            const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
            const dayName = days[date.getDay()];
            
            dummyData.push([
                dateStr,
                dayName,
                '', 
                '', 
                '', 
                date.getDay() === 0 || date.getDay() === 6 ? 'N' : 'Y',
                '', 
                i === 1 ? '배송 안내' : '',
                i === 1 ? '평일 오전 10시 이전 주문 시 당일 발송됩니다.' : ''
            ]);
        }
        
        return dummyData;
    }

    async processDeliveryData() {
        if (this.cache && this.cacheTimestamp && 
            Date.now() - this.cacheTimestamp < this.cacheExpiry) {
            return this.cache;
        }

        const sheetData = await this.fetchSheetData();
        const currentYear = new Date().getFullYear();
        const holidays = await holidayAPI.fetchMultiYearHolidays(currentYear, currentYear + 1);
        
        const deliveryMap = {};
        
        sheetData.forEach((row, index) => {
            if (index === 0) return;
            
            const [date, dayName, sheetHoliday, sheetTempHoliday, other, deliveryYN, issue, noticeHeader, noticeContent] = row;
            
            if (!date) return;
            
            const dateObj = new Date(date.replace(/\. /g, '-'));
            const formattedDate = this.formatDate(dateObj);
            
            const apiHoliday = holidays[formattedDate];
            
            deliveryMap[formattedDate] = {
                date: formattedDate,
                dayName: dayName || this.getDayNameFromDate(formattedDate),
                holiday: sheetHoliday || (apiHoliday?.type === '공휴일' ? apiHoliday.name : ''),
                tempHoliday: sheetTempHoliday || (apiHoliday?.type === '임시공휴일' ? apiHoliday.name : ''),
                other: other || '',
                issue: issue || '',
                sheetDeliveryYN: deliveryYN,
                dayOfWeek: dateObj.getDay(),
                noticeHeader: noticeHeader || '',
                noticeContent: noticeContent || ''
            };
        });
        
        Object.keys(deliveryMap).forEach(dateStr => {
            const info = deliveryMap[dateStr];
            const dayOfWeek = info.dayOfWeek;
            const sheetValue = info.sheetDeliveryYN?.toString().toUpperCase();
            
            let canDeliver = false;
            let deliveryType = 'none';
            
            if (dayOfWeek === 6) {
                canDeliver = false;
                deliveryType = 'none';
            } else if (this.isBeforeHoliday(dateStr, deliveryMap)) {
                canDeliver = false;
                deliveryType = 'none';
            } else if (dayOfWeek === 0) {
                canDeliver = true;
                deliveryType = 'special';
            } else if (this.isLastDayOfHolidayPeriod(dateStr, deliveryMap)) {
                canDeliver = true;
                deliveryType = 'special';
            } else if (sheetValue === 'N') {
                canDeliver = false;
                deliveryType = 'none';
            } else if (info.holiday || info.tempHoliday) {
                canDeliver = false;
                deliveryType = 'none';
            } else if (dayOfWeek >= 1 && dayOfWeek <= 5) {
                canDeliver = true;
                deliveryType = 'normal';
            }
            
            deliveryMap[dateStr].canDeliver = canDeliver;
            deliveryMap[dateStr].deliveryType = deliveryType;
        });
        
        this.cache = deliveryMap;
        this.cacheTimestamp = Date.now();
        
        return deliveryMap;
    }

    isLastDayOfHolidayPeriod(dateStr, deliveryMap) {
        const date = new Date(dateStr);
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);
        const nextDateStr = this.formatDate(nextDay);
        
        const currentInfo = deliveryMap[dateStr];
        const nextInfo = deliveryMap[nextDateStr];
        
        if (currentInfo && (currentInfo.holiday || currentInfo.tempHoliday || currentInfo.dayOfWeek === 0)) {
            if (nextInfo && nextInfo.dayOfWeek >= 1 && nextInfo.dayOfWeek <= 5 && 
                !nextInfo.holiday && !nextInfo.tempHoliday) {
                return true;
            }
        }
        
        return false;
    }

    isBeforeHoliday(dateStr, deliveryMap) {
        const date = new Date(dateStr);
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);
        const nextDateStr = this.formatDate(nextDay);
        
        const nextInfo = deliveryMap[nextDateStr];
        
        if (nextInfo && (nextInfo.holiday || nextInfo.tempHoliday || nextInfo.dayOfWeek === 0)) {
            return true;
        }
        
        return false;
    }

    formatDate(date) {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    }

    getDayNameFromDate(dateStr) {
        const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
        const date = new Date(dateStr);
        return days[date.getDay()];
    }

    async getNotices() {
        const sheetData = await this.fetchSheetData();
        const notices = [];
        
        sheetData.forEach((row, index) => {
            if (index === 0) return;
            
            const noticeHeader = row[7];
            const noticeContent = row[8];
            
            if (noticeHeader && noticeContent && 
                noticeHeader.trim() !== '' && noticeContent.trim() !== '') {
                notices.push({
                    header: noticeHeader,
                    content: noticeContent
                });
            }
        });
        
        return notices;
    }

    async getMonthData(year, month) {
        const allData = await this.processDeliveryData();
        const monthData = {};
        
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        
        for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
            const dateStr = this.formatDate(d);
            if (allData[dateStr]) {
                monthData[dateStr] = allData[dateStr];
            }
        }
        
        return monthData;
    }

    clearCache() {
        this.cache = null;
        this.cacheTimestamp = null;
    }
}

export const deliveryDataService = new DeliveryDataService();
