// delivery-data-service.js
import { holidayAPI } from './delivery-holiday-api.js';

export class DeliveryDataService {
    constructor() {
        this.cache = null;
        this.cacheTimestamp = null;
        this.cacheExpiry = 10 * 60 * 1000; // 10분
    }

    /**
     * 구글 시트 데이터 가져오기
     */
    async fetchSheetData() {
        try {
            const response = await fetch('/api/delivery');
            const data = await response.json();
            
            // 데이터 확장 (9개 컬럼 보장)
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
            throw error;
        }
    }

    /**
     * 배송 데이터 처리 및 병합
     */
    async processDeliveryData() {
        // 캐시 확인
        if (this.cache && this.cacheTimestamp && 
            Date.now() - this.cacheTimestamp < this.cacheExpiry) {
            return this.cache;
        }

        const sheetData = await this.fetchSheetData();
        const currentYear = new Date().getFullYear();
        const holidays = await holidayAPI.fetchMultiYearHolidays(currentYear, currentYear + 1);
        
        const deliveryMap = {};
        
        // 첫 번째 패스: 기본 데이터 생성
        sheetData.forEach((row, index) => {
            if (index === 0) return; // 헤더 스킵
            
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
        
        // 두 번째 패스: 배송 가능 여부 결정
        Object.keys(deliveryMap).forEach(dateStr => {
            const info = deliveryMap[dateStr];
            const dayOfWeek = info.dayOfWeek;
            const sheetValue = info.sheetDeliveryYN?.toString().toUpperCase();
            
            let canDeliver = false;
            let deliveryType = 'none';
            
            if (dayOfWeek === 6) {
                // 토요일: 발송 없음
                canDeliver = false;
                deliveryType = 'none';
            } else if (this.isBeforeHoliday(dateStr, deliveryMap)) {
                // 공휴일 전날: 발송 휴무
                canDeliver = false;
                deliveryType = 'none';
            } else if (dayOfWeek === 0) {
                // 일요일: 조건부 발송
                canDeliver = true;
                deliveryType = 'special';
            } else if (this.isLastDayOfHolidayPeriod(dateStr, deliveryMap)) {
                // 연휴 마지막날: 조건부 발송
                canDeliver = true;
                deliveryType = 'special';
            } else if (sheetValue === 'N') {
                // 시트에서 명시적으로 발송 불가
                canDeliver = false;
                deliveryType = 'none';
            } else if (info.holiday || info.tempHoliday) {
                // 공휴일: 발송 없음
                canDeliver = false;
                deliveryType = 'none';
            } else if (dayOfWeek >= 1 && dayOfWeek <= 5) {
                // 평일: 발송
                canDeliver = true;
                deliveryType = 'normal';
            }
            
            deliveryMap[dateStr].canDeliver = canDeliver;
            deliveryMap[dateStr].deliveryType = deliveryType;
        });
        
        // 캐시 저장
        this.cache = deliveryMap;
        this.cacheTimestamp = Date.now();
        
        return deliveryMap;
    }

    /**
     * 연휴 마지막날 체크
     */
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

    /**
     * 다음날이 공휴일인지 체크
     */
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

    /**
     * 날짜 포맷팅
     */
    formatDate(date) {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    }

    /**
     * 날짜에서 요일 구하기
     */
    getDayNameFromDate(dateStr) {
        const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
        const date = new Date(dateStr);
        return days[date.getDay()];
    }

    /**
     * 공지사항 데이터 가져오기
     */
    async getNotices() {
        const sheetData = await this.fetchSheetData();
        const notices = [];
        
        sheetData.forEach((row, index) => {
            if (index === 0) return; // 헤더 스킵
            
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

    /**
     * 특정 월의 배송 데이터 가져오기
     */
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

    /**
     * 캐시 초기화
     */
    clearCache() {
        this.cache = null;
        this.cacheTimestamp = null;
    }
}

// 싱글톤 인스턴스
export const deliveryDataService = new DeliveryDataService();
