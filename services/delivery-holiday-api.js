// delivery-holiday-api.js
export class DeliveryHolidayAPI {
    constructor() {
        this.cache = new Map();
        this.cacheExpiry = 24 * 60 * 60 * 1000; // 24시간
    }

    /**
     * 공휴일 데이터 가져오기
     */
    async fetchHolidays(year) {
        const cacheKey = `holidays-${year}`;
        const cached = this.cache.get(cacheKey);
        
        if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
            return cached.data;
        }

        try {
            const response = await fetch(`https://date.nager.at/api/v3/publicholidays/${year}/KR`);
            const data = await response.json();
            
            const holidays = {};
            data.forEach(holiday => {
                holidays[holiday.date] = {
                    name: holiday.localName || holiday.name,
                    type: holiday.types?.includes('Authorities') ? '임시공휴일' : '공휴일'
                };
            });

            this.cache.set(cacheKey, {
                data: holidays,
                timestamp: Date.now()
            });

            return holidays;
        } catch (error) {
            console.error(`${year}년 공휴일 로드 실패:`, error);
            return {};
        }
    }

    /**
     * 여러 년도의 공휴일 데이터 가져오기
     */
    async fetchMultiYearHolidays(startYear, endYear) {
        const allHolidays = {};
        
        for (let year = startYear; year <= endYear; year++) {
            const yearHolidays = await this.fetchHolidays(year);
            Object.assign(allHolidays, yearHolidays);
        }
        
        return allHolidays;
    }

    /**
     * 특정 날짜가 공휴일인지 확인
     */
    async isHoliday(dateStr) {
        const year = new Date(dateStr).getFullYear();
        const holidays = await this.fetchHolidays(year);
        return holidays.hasOwnProperty(dateStr);
    }

    /**
     * 연휴 기간 확인 (연속된 휴일)
     */
    async getHolidayPeriod(dateStr) {
        const date = new Date(dateStr);
        const year = date.getFullYear();
        const holidays = await this.fetchHolidays(year);
        
        const period = {
            start: dateStr,
            end: dateStr,
            days: 1
        };

        // 이전 날짜 확인
        let checkDate = new Date(date);
        while (true) {
            checkDate.setDate(checkDate.getDate() - 1);
            const checkStr = this.formatDate(checkDate);
            
            if (holidays[checkStr] || checkDate.getDay() === 0 || checkDate.getDay() === 6) {
                period.start = checkStr;
                period.days++;
            } else {
                break;
            }
        }

        // 다음 날짜 확인
        checkDate = new Date(date);
        while (true) {
            checkDate.setDate(checkDate.getDate() + 1);
            const checkStr = this.formatDate(checkDate);
            
            if (holidays[checkStr] || checkDate.getDay() === 0 || checkDate.getDay() === 6) {
                period.end = checkStr;
                period.days++;
            } else {
                break;
            }
        }

        return period;
    }

    /**
     * 날짜 포맷팅
     */
    formatDate(date) {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    }

    /**
     * 캐시 초기화
     */
    clearCache() {
        this.cache.clear();
    }
}

// 싱글톤 인스턴스
export const holidayAPI = new DeliveryHolidayAPI();
