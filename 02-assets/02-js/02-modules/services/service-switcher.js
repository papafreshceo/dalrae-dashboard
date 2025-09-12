// ========== service-switcher.js ==========
export const ServiceSwitcher = {
    switch(service) {
        // 섹션 전환
        document.querySelectorAll('.service-section').forEach(section => {
            section.classList.remove('active');
        });
        
        const targetSection = document.getElementById(`${service}-service`);
        if (targetSection) {
            targetSection.classList.add('active');
        }
        
        // 버튼 활성화
        document.querySelectorAll('.service-tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const targetBtn = document.getElementById(`${service}-service-btn`);
        if (targetBtn) {
            targetBtn.classList.add('active');
        }
    }
};
