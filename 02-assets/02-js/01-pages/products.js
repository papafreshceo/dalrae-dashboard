/**
 * products.js
 * 상품 리스트 페이지 메인 모듈
 */

import { ProductsAPI } from '../02-modules/products/products-api.js';
import { ProductsGrid } from '../02-modules/products/products-grid.js';
import { ProductsFilter } from '../02-modules/products/products-filter.js';
import { ProductsSearch } from '../02-modules/products/products-search.js';
import { ProductsPagination } from '../02-modules/products/products-pagination.js';
import { QuickOrderModal } from '../02-modules/products/quick-order-modal.js';

class ProductsManager {
    constructor() {
        // 모듈 초기화
        this.api = new ProductsAPI();
        this.grid = new ProductsGrid();
        this.filter = new ProductsFilter();
        this.search = new ProductsSearch();
        this.pagination = new ProductsPagination();
        this.quickOrder = new QuickOrderModal();
        
        // 상태 관리
        this.state = {
            allProducts: [],
            filteredProducts: [],
            displayedProducts: [],
            currentPage: 1,
            itemsPerPage: 20,
            activeFilter: 'all',
            searchTerm: '',
            sortBy: 'name',
            sortOrder: 'asc'
        };
    }
    
    /**
     * 초기화
     */
    async init() {
        try {
            // 로딩 표시
            this.grid.showLoading();
            
            // 공통 컴포넌트 초기화
            this.initializeCommonComponents();
            
            // 데이터 로드
            await this.loadProducts();
            
            // 이벤트 리스너 설정
            this.setupEventListeners();
            
            // 초기 표시
            this.updateDisplay();
            
        } catch (error) {
            console.error('상품 리스트 초기화 실패:', error);
            this.grid.showError('상품 데이터를 불러올 수 없습니다.');
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
                activePage: 'products'
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
     * 상품 데이터 로드
     */
    async loadProducts() {
        const data = await this.api.fetchProducts();
        this.state.allProducts = data;
        this.state.filteredProducts = data;
        
        // 필터 옵션 생성
        this.filter.generateFilterTags(data);
    }
    
    /**
     * 이벤트 리스너 설정
     */
    setupEventListeners() {
        // 검색
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.querySelector('.search-btn');
        
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleSearch();
                }
            });
        }
        
        if (searchBtn) {
            searchBtn.addEventListener('click', () => this.handleSearch());
        }
        
        // 필터 태그
        document.querySelectorAll('.filter-tag').forEach(tag => {
            tag.addEventListener('click', (e) => this.handleFilterClick(e));
        });
        
        // 정렬
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => this.handleSort(e));
        }
        
        // 페이지당 아이템 수
        const itemsPerPageSelect = document.getElementById('itemsPerPage');
        if (itemsPerPageSelect) {
            itemsPerPageSelect.addEventListener('change', (e) => {
                this.state.itemsPerPage = parseInt(e.target.value);
                this.state.currentPage = 1;
                this.updateDisplay();
            });
        }
        
        // 모달 이벤트
        this.setupModalEvents();
    }
    
    /**
     * 모달 이벤트 설정
     */
    setupModalEvents() {
        // 빠른 주문 버튼
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('quick-order-btn')) {
                const productId = e.target.dataset.productId;
                const product = this.state.allProducts.find(p => p.상품코드 === productId);
                if (product) {
                    this.quickOrder.show(product);
                }
            }
            
            // 차트 버튼
            if (e.target.classList.contains('chart-btn')) {
                const optionCode = e.target.dataset.code;
                const optionName = e.target.dataset.name;
                this.showPriceChart(optionCode, optionName);
            }
        });
    }
    
    /**
     * 검색 처리
     */
    handleSearch() {
        const searchInput = document.getElementById('searchInput');
        const searchTerm = searchInput ? searchInput.value.trim() : '';
        
        this.state.searchTerm = searchTerm;
        this.state.currentPage = 1;
        
        if (searchTerm) {
            this.state.filteredProducts = this.search.searchProducts(
                this.state.allProducts,
                searchTerm
            );
        } else {
            this.state.filteredProducts = this.state.allProducts;
        }
        
        this.updateDisplay();
    }
    
    /**
     * 필터 클릭 처리
     */
    handleFilterClick(event) {
        const tag = event.currentTarget;
        const filterValue = tag.dataset.filter;
        
        // 활성화 상태 변경
        document.querySelectorAll('.filter-tag').forEach(t => {
            t.classList.remove('active');
        });
        tag.classList.add('active');
        
        // 필터 적용
        this.state.activeFilter = filterValue;
        this.state.currentPage = 1;
        
        if (filterValue === 'all') {
            this.state.filteredProducts = this.state.allProducts;
        } else {
            this.state.filteredProducts = this.filter.applyFilter(
                this.state.allProducts,
                filterValue
            );
        }
        
        // 검색어가 있으면 검색도 적용
        if (this.state.searchTerm) {
            this.state.filteredProducts = this.search.searchProducts(
                this.state.filteredProducts,
                this.state.searchTerm
            );
        }
        
        this.updateDisplay();
    }
    
    /**
     * 정렬 처리
     */
    handleSort(event) {
        const sortValue = event.target.value;
        const [sortBy, sortOrder] = sortValue.split('-');
        
        this.state.sortBy = sortBy;
        this.state.sortOrder = sortOrder;
        
        this.state.filteredProducts = this.sortProducts(
            this.state.filteredProducts,
            sortBy,
            sortOrder
        );
        
        this.updateDisplay();
    }
    
    /**
     * 상품 정렬
     */
    sortProducts(products, sortBy, sortOrder) {
        const sorted = [...products].sort((a, b) => {
            let aValue, bValue;
            
            switch (sortBy) {
                case 'name':
                    aValue = a.상품명 || '';
                    bValue = b.상품명 || '';
                    break;
                case 'price':
                    aValue = parseInt(String(a.공급가 || 0).replace(/,/g, ''));
                    bValue = parseInt(String(b.공급가 || 0).replace(/,/g, ''));
                    break;
                case 'date':
                    aValue = new Date(a.다음출하일 || '2099-12-31');
                    bValue = new Date(b.다음출하일 || '2099-12-31');
                    break;
                default:
                    return 0;
            }
            
            if (sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });
        
        return sorted;
    }
    
    /**
     * 화면 업데이트
     */
    updateDisplay() {
        // 페이지네이션 계산
        const totalItems = this.state.filteredProducts.length;
        const totalPages = Math.ceil(totalItems / this.state.itemsPerPage);
        const startIndex = (this.state.currentPage - 1) * this.state.itemsPerPage;
        const endIndex = startIndex + this.state.itemsPerPage;
        
        // 현재 페이지 상품
        this.state.displayedProducts = this.state.filteredProducts.slice(startIndex, endIndex);
        
        // 통계 업데이트
        this.updateStats(totalItems);
        
        // 그리드 렌더링
        this.grid.renderProducts(this.state.displayedProducts);
        
        // 페이지네이션 렌더링
        this.pagination.render({
            currentPage: this.state.currentPage,
            totalPages: totalPages,
            totalItems: totalItems,
            onPageChange: (page) => this.goToPage(page)
        });
    }
    
    /**
     * 통계 업데이트
     */
    updateStats(totalItems) {
        const statsEl = document.getElementById('productStats');
        if (statsEl) {
            const startItem = (this.state.currentPage - 1) * this.state.itemsPerPage + 1;
            const endItem = Math.min(
                this.state.currentPage * this.state.itemsPerPage,
                totalItems
            );
            
            statsEl.innerHTML = `
                <span class="stat-text">
                    총 <strong>${totalItems}</strong>개 상품 중 
                    <strong>${startItem}-${endItem}</strong>번째 표시
                </span>
            `;
        }
    }
    
    /**
     * 페이지 이동
     */
    goToPage(page) {
        this.state.currentPage = page;
        this.updateDisplay();
        window.scrollTo(0, 0);
    }
    
    /**
     * 가격 차트 표시
     */
    async showPriceChart(optionCode, optionName) {
        try {
            const data = await this.api.fetchPriceHistory(optionCode);
            
            // 차트 모달 표시 (별도 구현 필요)
            if (window.ChartModal) {
                window.ChartModal.show(data, optionName);
            }
        } catch (error) {
            console.error('가격 차트 로드 실패:', error);
        }
    }
}

// 전역 인스턴스
let productsManager = null;

// 페이지 로드 시 초기화
window.addEventListener('DOMContentLoaded', () => {
    productsManager = new ProductsManager();
    productsManager.init();
});

// 전역 함수 내보내기
window.products = {
    refresh: () => productsManager?.loadProducts(),
    search: (term) => {
        if (productsManager) {
            document.getElementById('searchInput').value = term;
            productsManager.handleSearch();
        }
    },
    showQuickOrder: (productId) => {
        const product = productsManager?.state.allProducts.find(p => p.상품코드 === productId);
        if (product) {
            productsManager.quickOrder.show(product);
        }
    }
};