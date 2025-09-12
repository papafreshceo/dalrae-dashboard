// ========== orders-api.js ==========
export const OrdersAPI = {
    // 주문 제출
    async submitOrder(orderData) {
        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            });
            
            if (!response.ok) throw new Error('주문 제출 실패');
            return await response.json();
        } catch (error) {
            console.error('주문 API 오류:', error);
            return { success: false, error: error.message };
        }
    },
    
    // 상품 검색
    async searchProducts(query) {
        try {
            const response = await fetch(`/api/products/search?q=${encodeURIComponent(query)}`);
            if (!response.ok) throw new Error('상품 검색 실패');
            return await response.json();
        } catch (error) {
            console.error('상품 검색 API 오류:', error);
            return this.getMockProducts(query);
        }
    },
    
    // Mock 상품 데이터
    getMockProducts(query) {
        const products = [
            { id: 1, name: '친환경 쌀 10kg', optionName: '백미', spec: '10kg', price: 45000 },
            { id: 2, name: '유기농 감자', optionName: '대', spec: '5kg', price: 15000 },
            { id: 3, name: '무농약 토마토', optionName: '완숙', spec: '2kg', price: 12000 },
            { id: 4, name: '친환경 양파', optionName: '중', spec: '3kg', price: 9000 }
        ];
        
        return products.filter(p => 
            p.name.toLowerCase().includes(query.toLowerCase())
        );
    }
};
