// ========== calendar-view.js ==========
export const CalendarView = {
    currentView: 'month',
    
    init(view) {
        this.currentView = view;
        this.updateViewButtons(view);
    },
    
    switchView(view) {
        this.currentView = view;
        this.updateViewButtons(view);
        
        const container = document.getElementById('deliveryCalendarContent');
        if (container) {
            container.innerHTML = '<div style="text-align: center; padding: 40px;">로딩 중...</div>';
        }
    },
    
    updateViewButtons(view) {
        document.querySelectorAll('.toggle-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.view === view) {
                btn.classList.add('active');
            }
        });
    }
};