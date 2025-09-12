// ========== product-search.js ==========
export const ProductSearch = {
    searchTimeout: null,
    
    async search(query) {
        // 디바운싱
        clearTimeout(this.searchTimeout);
        
        this.searchTimeout = setTimeout(async () => {
            const products = await OrdersAPI.searchProducts(query);
            this.displayResults(products);
        }, 300);
    },
    
    displayResults(products) {
        const container = document.getElementById('searchResults');
        if (!container) return;
        
        if (products.length === 0) {
            container.innerHTML = '<div class="search-result-item">검색 결과가 없습니다.</div>';
            container.classList.add('active');
            return;
        }
        
        let html = '';
        products.forEach(product => {
            html += `
                <div class="search-result-item" onclick="selectProduct(${JSON.stringify(product).replace(/"/g, '&quot;')})">
                    <strong>${product.name}</strong>
                    <span style="color: #6c757d; font-size: 12px; margin-left: 8px;">
                        ${product.optionName} | ${product.spec} | ${product.price.toLocaleString()}원
                    </span>
                </div>
            `;
        });
        
        container.innerHTML = html;
        container.classList.add('active');
    },
    
    hideResults() {
        const container = document.getElementById('searchResults');
        if (container) {
            container.classList.remove('active');
        }
    }
};
