// ========== SERVICES PAGE MAIN ==========
import { ServicesAPI } from '../02-modules/services/services-api.js';
import { PhotoService } from '../02-modules/services/photo-service.js';
import { FarmService } from '../02-modules/services/farm-service.js';
import { QuoteCalculator } from '../02-modules/services/quote-calculator.js';
import { ServiceSwitcher } from '../02-modules/services/service-switcher.js';
import { LocationManager } from '../02-modules/services/location-manager.js';

// 전역 변수
let priceConfig = null;
let currentService = 'photo';

// 초기화
window.addEventListener('DOMContentLoaded', async function() {
    console.log('서비스 페이지 초기화');
    
    // 헤더 초기화
    if (window.DalraeHeader) {
        DalraeHeader.init({
            containerId: 'header-container',
            activePage: 'services'
        });
    }
    
    // 푸터 초기화
    if (window.DalraeFooter) {
        DalraeFooter.init({
            containerId: 'footer-container'
        });
    }
    
    // 가격 데이터 로드
    await loadPriceData();
    
    // 서비스 초기화
    PhotoService.init(priceConfig);
    FarmService.init(priceConfig);
    
    // 이벤트 리스너 설정
    setupEventListeners();
    
    // 초기 견적 계산
    QuoteCalculator.calculate(priceConfig);
});

// 가격 데이터 로드
async function loadPriceData() {
    try {
        const response = await ServicesAPI.fetchPrices();
        if (response && response.priceConfig) {
            priceConfig = response.priceConfig;
            console.log('가격 데이터 로드 성공');
        }
    } catch (error) {
        console.error('가격 데이터 로드 실패:', error);
        priceConfig = ServicesAPI.getDefaultPriceConfig();
    }
}

// 이벤트 리스너 설정
function setupEventListeners() {
    // 서비스 전환 버튼
    const photoBtn = document.getElementById('photo-service-btn');
    const farmBtn = document.getElementById('farm-service-btn');
    
    if (photoBtn) {
        photoBtn.addEventListener('click', () => switchService('photo'));
    }
    
    if (farmBtn) {
        farmBtn.addEventListener('click', () => switchService('farm'));
    }
    
    // 로케이션 체크박스
    LocationManager.setupLocationListeners();
    
    // 수량 조절 버튼
    setupQuantityControls();
}

// 서비스 전환
function switchService(service) {
    currentService = service;
    ServiceSwitcher.switch(service);
    
    if (service === 'photo') {
        QuoteCalculator.calculate(priceConfig);
    } else if (service === 'farm') {
        FarmService.updateDisplay(priceConfig);
    }
}

// 수량 조절 설정
function setupQuantityControls() {
    // 각 로케이션별 수량 조절
    ['indoor', 'outdoor', 'cooking', 'drone'].forEach(type => {
        const checkbox = document.getElementById(`${type}-check`);
        if (checkbox) {
            checkbox.addEventListener('change', function() {
                LocationManager.toggleLocation(type, this.checked);
                QuoteCalculator.calculate(priceConfig);
            });
        }
    });
    
    // 추가 옵션 이벤트
    document.querySelectorAll('input[type="number"], input[type="checkbox"]').forEach(input => {
        input.addEventListener('change', () => {
            QuoteCalculator.calculate(priceConfig);
        });
    });
}

// 전역 함수 등록
window.switchService = switchService;
window.toggleLocation = LocationManager.toggleLocation;
window.adjustQuantity = LocationManager.adjustQuantity;
window.handleDirectInput = LocationManager.handleDirectInput;
window.toggleAccordion = FarmService.toggleAccordion;
window.calculateQuote = () => QuoteCalculator.calculate(priceConfig);