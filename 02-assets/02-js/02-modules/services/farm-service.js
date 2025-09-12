// ========== farm-service.js ==========
export const FarmService = {
    priceConfig: null,
    
    init(config) {
        this.priceConfig = config;
    },
    
    updateDisplay(config) {
        if (!config || !config.farmService) return;
        
        // 아코디언 생성
        this.createAccordion(config.farmService.accordion);
        
        // 가격 플랜 업데이트
        this.updatePricePlans(config.farmService);
    },
    
    createAccordion(accordionData) {
        const container = document.getElementById('serviceAccordion');
        if (!container || !accordionData || accordionData.length === 0) return;
        
        container.innerHTML = accordionData.map((item, index) => `
            <div class="accordion-card">
                <div class="accordion-header" onclick="toggleAccordion(${index})">
                    <span>${item.title || '제목 없음'}</span>
                    <span class="accordion-icon">▼</span>
                </div>
                <div class="accordion-body">${item.content || '내용 없음'}</div>
            </div>
        `).join('');
    },
    
    updatePricePlans(farmService) {
        // 방문견학동행
        if (farmService.visit.price) {
            const visitPrice = document.getElementById('visit-price');
            if (visitPrice) visitPrice.textContent = this.formatPrice(farmService.visit.price);
        }
        
        // 농가매칭
        if (farmService.matching.price) {
            const matchingPrice = document.getElementById('matching-price');
            if (matchingPrice) matchingPrice.textContent = this.formatPrice(farmService.matching.price);
        }
        
        // 풀서비스
        if (farmService.full.price) {
            const fullPrice = document.getElementById('full-price');
            if (fullPrice) fullPrice.textContent = this.formatPrice(farmService.full.price);
        }
        
        // Features 업데이트
        ['visit', 'matching', 'full'].forEach(plan => {
            const featuresEl = document.getElementById(`${plan}-features`);
            if (featuresEl && farmService[plan].features && farmService[plan].features.length > 0) {
                featuresEl.innerHTML = farmService[plan].features
                    .filter(f => f)
                    .map(feature => `<li>${feature}</li>`)
                    .join('');
            }
        });
    },
    
    toggleAccordion(index) {
        const cards = document.querySelectorAll('.accordion-card');
        if (cards[index]) {
            cards[index].classList.toggle('active');
        }
    },
    
    formatPrice(price) {
        return price.toLocaleString() + '원';
    }
};