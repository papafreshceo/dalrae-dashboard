// ========== ORDERS PAGE MAIN ==========
import { OrdersAPI } from '../02-modules/orders/orders-api.js';
import { OrderForm } from '../02-modules/orders/order-form.js';
import { ProductSearch } from '../02-modules/orders/product-search.js';
import { OrderValidation } from '../02-modules/orders/order-validation.js';
import { OrderModal } from '../02-modules/orders/order-modal.js';
import { OrderUpload } from '../02-modules/orders/order-upload.js';

// 전역 변수
let currentSection = 'quickOrder';
let selectedProduct = null;
let orderData = {};

// 초기화
window.addEventListener('DOMContentLoaded', function() {
    console.log('주문관리 페이지 초기화');
    
    // 헤더 초기화
    if (window.DalraeHeader) {
        DalraeHeader.init({
            containerId: 'header-container',
            activePage: 'orders'
        });
    }
    
    // 푸터 초기화  
    if (window.DalraeFooter) {
        DalraeFooter.init({
            containerId: 'footer-container'
        });
    }
    
    // 폼 초기화
window.resetForm = function() {
    document.getElementById('quickOrderForm').reset();
    selectedProduct = null;
    document.getElementById('totalAmount').textContent = '0원';
    ProductSearch.hideResults();
};

// 주문 제출
window.submitOrder = async function() {
    try {
        const response = await OrdersAPI.submitOrder(orderData);
        if (response.success) {
            alert('주문이 성공적으로 접수되었습니다.');
            OrderModal.close();
            resetForm();
        } else {
            alert('주문 처리 중 오류가 발생했습니다.');
        }
    } catch (error) {
        console.error('주문 제출 오류:', error);
        alert('주문 처리 중 오류가 발생했습니다.');
    }
};초기화
    OrderForm.init();
    
    // 이벤트 리스너 설정
    setupEventListeners();
    
    // 초기 섹션 표시
    showSection('quickOrder');
});

// 이벤트 리스너 설정
function setupEventListeners() {
    // 액션 버튼들
    const actionButtons = document.querySelectorAll('.action-btn');
    actionButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.textContent;
            if (action.includes('간편')) {
                showQuickOrder();
            } else if (action.includes('업로드')) {
                showOrderUpload();
            } else if (action.includes('멀티')) {
                showMultiUpload();
            }
        });
    });
    
    // 상품 검색
    const searchInput = document.getElementById('productSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            if (this.value.length >= 2) {
                ProductSearch.search(this.value);
            } else {
                ProductSearch.hideResults();
            }
        });
        
        searchInput.addEventListener('focus', function() {
            if (this.value.length >= 2) {
                ProductSearch.search(this.value);
            }
        });
    }
    
    // 수량 변경
    const quantityInput = document.getElementById('quantity');
    if (quantityInput) {
        quantityInput.addEventListener('change', calculateTotal);
    }
    
    // 폼 제출
    const orderForm = document.getElementById('quickOrderForm');
    if (orderForm) {
        orderForm.addEventListener('submit', handleFormSubmit);
    }
    
    // 초기화 버튼
    const resetBtn = document.querySelector('.btn-reset');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetForm);
    }
    
    // 모달 닫기
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            OrderModal.close();
        }
    });
}

// 섹션 표시
function showSection(section) {
    currentSection = section;
    
    // 모든 섹션 숨기기
    document.querySelectorAll('.order-form-section').forEach(sec => {
        sec.style.display = 'none';
    });
    
    // 선택된 섹션 표시
    const targetSection = document.getElementById(`${section}Section`);
    if (targetSection) {
        targetSection.style.display = 'block';
    }
    
    // 버튼 활성화 상태 변경
    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.classList.remove('active');
    });
}

// 간편 주문 표시
window.showQuickOrder = function() {
    showSection('quickOrder');
    document.querySelector('.action-btn:nth-child(1)').classList.add('active');
};

// 주문서 업로드 표시
window.showOrderUpload = function() {
    showSection('orderUpload');
    document.querySelector('.action-btn:nth-child(2)').classList.add('active');
    OrderUpload.init();
};

// 멀티 업로드 표시
window.showMultiUpload = function() {
    showSection('multiUpload');
    document.querySelector('.action-btn:nth-child(3)').classList.add('active');
    OrderUpload.initMulti();
};

// 상품 검색
window.searchProducts = function(query) {
    if (query.length >= 2) {
        ProductSearch.search(query);
    }
};

// 상품 선택
window.selectProduct = function(product) {
    selectedProduct = product;
    
    // 상품 정보 입력
    document.getElementById('optionName').value = product.optionName || '';
    document.getElementById('productSpec').value = product.spec || '';
    document.getElementById('unitPrice').value = product.price ? `${product.price.toLocaleString()}원` : '';
    
    // 검색창 업데이트
    document.getElementById('productSearch').value = product.name;
    
    // 검색 결과 숨기기
    ProductSearch.hideResults();
    
    // 총액 계산
    calculateTotal();
};

// 총액 계산
window.calculateTotal = function() {
    if (!selectedProduct) return;
    
    const quantity = parseInt(document.getElementById('quantity').value) || 1;
    const price = selectedProduct.price || 0;
    const total = price * quantity;
    
    document.getElementById('totalAmount').textContent = `${total.toLocaleString()}원`;
};

// 폼 제출 처리
async function handleFormSubmit(e) {
    e.preventDefault();
    
    // 유효성 검사
    const validation = OrderValidation.validateForm();
    if (!validation.isValid) {
        alert(validation.message);
        return;
    }
    
    // 주문 데이터 수집
    orderData = OrderForm.collectFormData();
    orderData.product = selectedProduct;
    
    // 주문 확인 모달 표시
    OrderModal.show(orderData);
}

// 폼 