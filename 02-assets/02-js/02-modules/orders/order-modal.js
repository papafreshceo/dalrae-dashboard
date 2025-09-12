// ========== order-modal.js ==========
export const OrderModal = {
    show(orderData) {
        const modal = document.getElementById('orderConfirmModal');
        if (!modal) return;
        
        // 주문 내역 표시
        const summary = document.getElementById('orderSummary');
        if (summary) {
            summary.innerHTML = `
                <div style="padding: 20px; background: #f8f9fa; border-radius: 8px;">
                    <h3 style="margin-bottom: 16px; color: #212529;">주문 상품</h3>
                    <p><strong>상품명:</strong> ${orderData.productSearch}</p>
                    <p><strong>옵션:</strong> ${orderData.optionName}</p>
                    <p><strong>규격:</strong> ${orderData.productSpec}</p>
                    <p><strong>수량:</strong> ${orderData.quantity}개</p>
                    <p style="margin-top: 12px; font-size: 18px; color: #2563eb;">
                        <strong>총 금액:</strong> ${orderData.totalAmount}
                    </p>
                </div>
                <div style="margin-top: 20px;">
                    <h3 style="margin-bottom: 12px; color: #212529;">배송 정보</h3>
                    <p><strong>수령인:</strong> ${orderData.receiverName} (${orderData.receiverPhone})</p>
                    <p><strong>주소:</strong> ${orderData.address}</p>
                    ${orderData.deliveryRequest ? `<p><strong>배송 요청사항:</strong> ${orderData.deliveryRequest}</p>` : ''}
                </div>
            `;
        }
        
        modal.classList.add('active');
    },
    
    close() {
        const modal = document.getElementById('orderConfirmModal');
        if (modal) {
            modal.classList.remove('active');
        }
    }
};