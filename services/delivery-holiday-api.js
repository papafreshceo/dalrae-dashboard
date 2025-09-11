// services/delivery-holiday-api.js
export class DeliveryHolidayAPI {
    constructor() {
        this.cache = new Map();
        this.cacheExpiry = 24 * 60 * 60 * 1000; // 24시간
    }

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

    async fetchMultiYearHolidays(startYear, endYear) {
        const allHolidays = {};
        
        for (let year = startYear; year <= endYear; year++) {
            const yearHolidays = await this.fetchHolidays(year);
            Object.assign(allHolidays, yearHolidays);
        }
        
        return allHolidays;
    }

    formatDate(date) {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    }

    clearCache() {
        this.cache.clear();
    }
}

export const holidayAPI = new DeliveryHolidayAPI();
