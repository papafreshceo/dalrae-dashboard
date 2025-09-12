// ========== location-manager.js ==========
export const LocationManager = {
    setupLocationListeners() {
        ['indoor', 'outdoor', 'cooking', 'drone'].forEach(type => {
            const card = document.getElementById(`${type}-card`);
            const header = card?.querySelector('.location-header');
            
            if (header) {
                header.addEventListener('click', (e) => {
                    if (!e.target.classList.contains('location-checkbox')) {
                        this.toggleLocation(type);
                    }
                });
            }
        });
    },
    
    toggleLocation(type, isChecked) {
        const card = document.getElementById(`${type}-card`);
        const checkbox = document.getElementById(`${type}-check`);
        
        if (isChecked === undefined) {
            isChecked = !checkbox.checked;
            checkbox.checked = isChecked;
        }
        
        if (isChecked) {
            card.classList.add('active');
        } else {
            card.classList.remove('active');
            this.resetLocationOptions(type);
        }
    },
    
    resetLocationOptions(type) {
        // 수량 초기화
        const photoInput = document.getElementById(`${type}-photo`);
        const videoInput = document.getElementById(`${type}-video`);
        
        if (photoInput) photoInput.value = 0;
        if (videoInput) videoInput.value = 0;
        
        // 요리 메뉴 초기화
        if (type === 'cooking') {
            const menuInput = document.getElementById('cooking-menu');
            if (menuInput) menuInput.value = 0;
        }
        
        // 체크박스 초기화
        const handCheckbox = document.getElementById(`${type}-hand`);
        const modelCheckbox = document.getElementById(`${type}-model`);
        
        if (handCheckbox) handCheckbox.checked = false;
        if (modelCheckbox) modelCheckbox.checked = false;
    },
    
    adjustQuantity(inputId, delta) {
        const input = document.getElementById(inputId);
        if (!input) return;
        
        const currentValue = parseInt(input.value) || 0;
        const newValue = Math.max(0, currentValue + delta);
        input.value = newValue;
        
        // 변경 이벤트 발생
        input.dispatchEvent(new Event('change'));
    },
    
    handleDirectInput(inputId) {
        const input = document.getElementById(inputId);
        if (!input) return;
        
        let value = parseInt(input.value) || 0;
        if (value < 0) value = 0;
        
        // 10 단위로 반올림 (사진의 경우)
        if (inputId.includes('photo')) {
            value = Math.round(value / 10) * 10;
        }
        
        input.value = value;
    }
};