/**
 * dashboard.js
 * 대시보드 페이지 메인 JavaScript 모듈
 */

import { DashboardAPI } from './modules/dashboard-api.js';
import { DashboardUI } from './modules/dashboard-ui.js';
import { DashboardFilter } from './modules/dashboard-filter.js';
import { DashboardChart } from './modules/dashboard-chart.js';
import { DashboardModal } from './modules/dashboard-modal.js';

class DashboardManager {
    constructor() {
        // 모듈 초기화
        this.api = new DashboardAPI();
        this.ui = new DashboardUI();
        this.filter = new DashboardFilter();
        this.chart = new DashboardChart();
        this.modal = new DashboardModal();
        
        // 상태 관리
        this.state = {
            allProducts: [],
            filteredProducts: [],
            activeTypeFilter: 'all',
            activeStatusFilter: 'all',
            activeProductFilter: 'all',
            priceDataCache: {}
        };
    }
    
    /**
     * 대시보드 초기화
     */
    async init() {
        try {
            // UI 초기 설정
            this.ui.showLoading();
            
            // 헤더/푸터 초기화
            this.initializeCommonComponents();
            
            // 데이터 로드
            await this.loadData();
            
            // 이벤트 리스너 설정
            this.setupEventListeners();
            
            // UI 업데이트
            this.updateDisplay();
            
        } catch (error) {
            console.error('대시보드 초기화 실패:', error);
            this.ui.showError('데이터를 불러올 수 없습니다.');
        }
    }
    
    /**
     * 공통 컴포넌트 초기화
     */
    initializeCommonComponents() {
        // 헤더 초기화
        if (window.DalraeHeader) {
            window.DalraeHeader.init({
                containerId: 'header-container',
                activePage: 'dashboard'
            });
        }
        
        // 푸터 초기화
        if (window.DalraeFooter) {
            window.DalraeFooter.init({
                containerId: 'footer-container'
            });
        }
    }
    
    /**
     * 데이터 로드
     */
    async loadData() {
        const data = await this.api.fetchProducts();
        this.state.allProducts = data;
        this.state.filteredProducts = data;
        
        // 통계 업데이트
        this.updateStats();
    }
    
    /**
     * 이벤트 리스너 설정
     */
    setupEventListeners() {
        // 필터 토글
        const filterToggle = document.getElementById('filterToggle');
        if (filterToggle) {
            filterToggle.addEventListener('click', () => this.filter.toggleFilter());
        }
        
        // 상태 필터
        document.querySelectorAll('.stat-card').forEach((card, index) => {
            card.addEventListener('click', () => this.handleStatCardClick(index));
        });
        
        // 태그 필터
        document.querySelectorAll('.tag-filter').forEach(tag => {
            tag.addEventListener('click', (e) => this.handleTagFilterClick(e));
        });
        
        // 모달 닫기
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.modal.closeAll();
            }
        });
    }
    
    /**
     * 통계 카드 클릭 처리
     */
    handleStatCardClick(index) {
        const statuses = ['all', 'active', 'preparing', 'warning', 'paused', 'stopped'];
        const status = statuses[index];
        
        // UI 업데이트
        this.ui.setActiveStatCard(index);
        
        // 필터 적용
        this.state.activeStatusFilter = status;
        this.applyFilters();
    }
    
    /**
     * 태그 필터 클릭 처리
     */
    handleTagFilterClick(event) {
        const tag = event.currentTarget;
        const filterType = tag.dataset.filterType;
        const filterValue = tag.dataset.filterValue;
        
        // 활성화 상태 토글
        tag.classList.toggle('active');
        
        // 필터 상태 업데이트
        if (filterType === 'type') {
            this.state.activeTypeFilter = filterValue;
        } else if (filterType === 'product') {
            this.state.activeProductFilter = filterValue;
        }
        
        this.applyFilters();
    }
    
    /**
     * 필터 적용
     */
    applyFilters() {
        this.state.filteredProducts = this.filter.applyFilters(
            this.state.allProducts,
            {
                type: this.state.activeTypeFilter,
                status: this.state.activeStatusFilter,
                product: this.state.activeProductFilter
            }
        );
        
        this.updateDisplay();
    }
    
    /**
     * 화면 업데이트
     */
    updateDisplay() {
        // 통계 업데이트
        this.updateStats();
        
        // 상품 그리드 업데이트
        this.ui.renderProductGrid(this.state.filteredProducts);
        
        // 스코어보드 업데이트
        this.updateScoreboard();
    }
    
    /**
     * 통계 업데이트
     */
    updateStats() {
        const stats = this.calculateStats();
        this.ui.updateStatCards(stats);
    }
    
    /**
     * 통계 계산
     */
    calculateStats() {
        const products = this.state.allProducts;
        
        return {
            total: products.length,
            active: products.filter(p => this.getSupplyStatus(p) === '공급중').length,
            preparing: products.filter(p => this.getSupplyStatus(p) === '출하준비중').length,
            warning: products.filter(p => this.getSupplyStatus(p) === '잠시만요').length,
            paused: products.filter(p => this.getSupplyStatus(p) === '시즌종료').length,
            stopped: products.filter(p => this.getSupplyStatus(p) === '공급중지').length
        };
    }
    
    /**
     * 스코어보드 업데이트
     */
    updateScoreboard() {
        const totalProducts = this.state.filteredProducts.length;
        const totalOptions = this.state.filteredProducts.reduce((sum, p) => {
            return sum + (p.옵션명 ? 1 : 0);
        }, 0);
        
        this.ui.updateScoreboard(totalProducts, totalOptions);
    }
    
    /**
     * 공급상태 가져오기
     */
    getSupplyStatus(product) {
        return product.원물공급상태 || product.공급상태 || '';
    }
    
    /**
     * 옵션 모달 표시
     */
    async showOptionsModal(product) {
        const options = await this.api.fetchProductOptions(product.상품명);
        this.modal.showOptions(product.상품명, options);
    }
    
    /**
     * 가격 차트 모달 표시
     */
    async showPriceChart(optionCode, optionName) {
        // 캐시 확인
        if (this.state.priceDataCache[optionCode]) {
            this.chart.displayChart(this.state.priceDataCache[optionCode], optionName);
            return;
        }
        
        // 데이터 로드
        const data = await this.api.fetchPriceHistory(optionCode);
        this.state.priceDataCache[optionCode] = data;
        this.chart.displayChart(data, optionName);
    }
}

// 전역 인스턴스
let dashboardManager = null;

// 페이지 로드 시 초기화
window.addEventListener('DOMContentLoaded', () => {
    dashboardManager = new DashboardManager();
    dashboardManager.init();
});

// 전역 함수 내보내기 (기존 코드 호환성)
window.dashboard = {
    showOptionsModal: (product) => dashboardManager?.showOptionsModal(product),
    showPriceChart: (code, name) => dashboardManager?.showPriceChart(code, name),
    applyFilter: (type) => {
        if (dashboardManager) {
            dashboardManager.state.activeStatusFilter = type;
            dashboardManager.applyFilters();
        }
    }
};