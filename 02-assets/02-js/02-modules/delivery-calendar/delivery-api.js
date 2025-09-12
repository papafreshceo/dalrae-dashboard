// ========== delivery-api.js ==========
export const DeliveryAPI = {
    // 배송 데이터 가져오기
    async fetchDeliveryData() {
        try {
            const response = await fetch('/api/delivery-data');
            if (!response.ok) throw new Error('배송 데이터 로드 실패');
            return await response.json();
        } catch (error) {
            console.error('배송 데이터 API 오류:', error);
            return this.getMockDeliveryData();
        }
    },
    
    // 공휴일 데이터 가져오기
    async fetchHolidayData() {
        try {
            const response = await fetch('/api/holidays');
            if (!response.ok) throw new Error('공휴일 데이터 로드 실패');
            return await response.json();
        } catch (error) {
            console.error('공휴일 API 오류:', error);
            return this.getMockHolidayData();
        }
    },
    
    // Mock 데이터
    getMockDeliveryData() {
        return {
            '2025-01-01': { canDeliver: false, type: 'holiday', reason: '신정' },
            '2025-01-28': { canDeliver: false, type: 'holiday', reason: '설날' },
            '2025-01-29': { canDeliver: false, type: 'holiday', reason: '설날' },
            '2025-01-30': { canDeliver: false, type: 'holiday', reason: '설날' }
        };
    },
    
    getMockHolidayData() {
        return {
            '2025-01-01': '신정',
            '2025-01-28': '설날',
            '2025-01-29': '설날',
            '2025-01-30': '설날',
            '2025-03-01': '삼일절',
            '2025-05-05': '어린이날'
        };
    }
};