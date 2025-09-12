// ========== order-form.js ==========
export const OrderForm = {
    init() {
        this.setupFormDefaults();
    },
    
    setupFormDefaults() {
        // 오늘 날짜 설정
        const today = new Date().toISOString().split('T')[0];
        const deliveryDate = document.getElementById('deliveryDate');
        if (deliveryDate) {
            deliveryDate.value = today;
            deliveryDate.min = today;
        }
    },
    
    collectFormData() {
        return {
            // 상품 정보
            productSearch: document.getElementById('productSearch').value,
            optionName: document.getElementById('optionName').value,
            productSpec: document.getElementById('productSpec').value,
            unitPrice: document.getElementById('unitPrice').value,
            quantity: document.getElementById('quantity').value,
            
            // 판매자 정보
            sellerName: document.getElementById('sellerName').value,
            sellerPhone: document.getElementById('sellerPhone').value,
            
            // 주문자 정보
            orderName: document.getElementById('orderName').value,
            orderPhone: document.getElementById('orderPhone').value,
            
            // 수령인 정보
            receiverName: document.getElementById('receiverName').value,
            receiverPhone: document.getElementById('receiverPhone').value,
            address: document.getElementById('address').value,
            
            // 배송 정보
            deliveryRequest: document.getElementById('deliveryRequest').value,
            orderMemo: document.getElementById('orderMemo').value,
            
            // 총액
            totalAmount: document.getElementById('totalAmount').textContent
        };
    }
};