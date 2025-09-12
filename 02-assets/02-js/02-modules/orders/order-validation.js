// ========== order-validation.js ==========
export const OrderValidation = {
    validateForm() {
        const requiredFields = [
            { id: 'productSearch', name: '상품' },
            { id: 'quantity', name: '수량' },
            { id: 'sellerName', name: '판매자' },
            { id: 'sellerPhone', name: '판매자 연락처' },
            { id: 'orderName', name: '주문자' },
            { id: 'orderPhone', name: '주문자 연락처' },
            { id: 'receiverName', name: '수령인' },
            { id: 'receiverPhone', name: '수령인 연락처' },
            { id: 'address', name: '주소' }
        ];
        
        for (const field of requiredFields) {
            const element = document.getElementById(field.id);
            if (!element || !element.value.trim()) {
                element?.classList.add('error');
                return {
                    isValid: false,
                    message: `${field.name}을(를) 입력해주세요.`
                };
            }
            element?.classList.remove('error');
        }
        
        // 전화번호 형식 검증
        const phoneRegex = /^\d{3}-\d{3,4}-\d{4}$/;
        const phoneFields = ['sellerPhone', 'orderPhone', 'receiverPhone'];
        
        for (const fieldId of phoneFields) {
            const element = document.getElementById(fieldId);
            if (element && !phoneRegex.test(element.value)) {
                element.classList.add('error');
                return {
                    isValid: false,
                    message: '전화번호 형식을 확인해주세요. (예: 010-1234-5678)'
                };
            }
        }
        
        return { isValid: true };
    }
};