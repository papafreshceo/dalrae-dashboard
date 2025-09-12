// ========== quote-calculator.js ==========
export const QuoteCalculator = {
    calculate(priceConfig) {
        if (!priceConfig || !priceConfig.locations) return;
        
        let totalCost = 0;
        let locationCost = 0;
        let transitionCost = 0;
        let menuCost = 0;
        let photoCost = 0;
        let videoCost = 0;
        let handCost = 0;
        let modelCost = 0;
        let editCost = 0;
        
        let totalPhotos = 0;
        let totalVideos = 0;
        let totalEditVideos = 0;
        
        // 각 로케이션별 계산
        ['indoor', 'outdoor', 'cooking', 'drone'].forEach((type, index) => {
            const checkbox = document.getElementById(`${type}-check`);
            if (!checkbox || !checkbox.checked) return;
            
            const config = priceConfig.locations[type];
            
            // 기본 비용
            if (index === 0) {
                locationCost += config.basePrice;
            } else {
                transitionCost += config.sceneAddCost;
            }
            
            // 추가 사진
            const photoInput = document.getElementById(`${type}-photo`);
            if (photoInput) {
                const photos = parseInt(photoInput.value) || 0;
                photoCost += photos * config.photoAddCost;
                totalPhotos += config.basePhoto + photos;
            }
            
            // 추가 영상
            const videoInput = document.getElementById(`${type}-video`);
            if (videoInput) {
                const videos = parseInt(videoInput.value) || 0;
                videoCost += videos * config.videoAddCost;
                totalVideos += config.baseVideo + videos;
            }
            
            // 요리 메뉴
            if (type === 'cooking') {
                const menuInput = document.getElementById('cooking-menu');
                if (menuInput) {
                    const menus = parseInt(menuInput.value) || 0;
                    menuCost += menus * config.menuCost;
                }
            }
            
            // 손 모델
            const handCheckbox = document.getElementById(`${type}-hand`);
            if (handCheckbox && handCheckbox.checked) {
                handCost += config.handCost;
            }
            
            // 전신 모델
            const modelCheckbox = document.getElementById(`${type}-model`);
            if (modelCheckbox && modelCheckbox.checked) {
                modelCost += config.modelCost;
            }
        });
        
        // 편집 비용 계산
        editCost = this.calculateEditCost(priceConfig.editing);
        
        // 통계 업데이트
        this.updateStats(totalPhotos, totalVideos, totalEditVideos);
        
        // 견적 항목 업데이트
        this.updateQuoteItems({
            locationCost,
            transitionCost,
            menuCost,
            photoCost,
            videoCost,
            handCost,
            modelCost,
            editCost
        });
        
        // 총 비용
        totalCost = locationCost + transitionCost + menuCost + photoCost + videoCost + handCost + modelCost + editCost;
        document.getElementById('totalAmount').textContent = this.formatPrice(totalCost);
    },
    
    calculateEditCost(editConfig) {
        let cost = 0;
        let totalEditVideos = 0;
        
        ['basic', 'full'].forEach(editType => {
            for (let i = 1; i <= 3; i++) {
                const checkbox = document.getElementById(`edit-${editType}-${i}`);
                if (checkbox && checkbox.checked) {
                    const minutesInput = document.getElementById(`${editType}-${i}-minutes`);
                    const countInput = document.getElementById(`${editType}-${i}-count`);
                    
                    const minutes = parseInt(minutesInput?.value) || 0;
                    const count = parseInt(countInput?.value) || 0;
                    
                    totalEditVideos += count;
                    
                    if (minutes === 1) {
                        cost += count * editConfig[editType].basePrice;
                    } else {
                        cost += count * (editConfig[editType].basePrice + (minutes - 1) * editConfig[editType].perMinute);
                    }
                }
            }
        });
        
        return cost;
    },
    
    updateStats(photos, videos, editVideos) {
        document.getElementById('totalPhotos').textContent = photos + '매';
        document.getElementById('totalVideos').textContent = videos + '분';
        document.getElementById('totalEditVideos').textContent = editVideos + '개';
    },
    
    updateQuoteItems(costs) {
        Object.keys(costs).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                element.textContent = this.formatPrice(costs[key]);
            }
        });
    },
    
    formatPrice(price) {
        return price.toLocaleString() + '원';
    }
};