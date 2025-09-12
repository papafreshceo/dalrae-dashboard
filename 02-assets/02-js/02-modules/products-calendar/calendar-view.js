/**
 * calendar-view.js
 * 캘린더 뷰 관리 모듈
 */

export class CalendarView {
    constructor() {
        this.currentView = 'month';
        this.viewContainers = {
            month: null,
            year: null
        };
    }
    
    /**
     * 뷰 초기화
     */
    init() {
        this.viewContainers.month = document.getElementById('monthView');
        this.viewContainers.year = document.getElementById('yearView');
        
        // 초기 뷰 설정
        this.setView(this.currentView);
    }
    
    /**
     * 뷰 설정
     */
    setView(view) {
        this.currentView = view;
        
        // 모든 뷰 숨기기
        Object.values(this.viewContainers).forEach(container => {
            if (container) {
                container.classList.remove('active');
            }
        });
        
        // 선택된 뷰 표시
        if (this.viewContainers[view]) {
            this.viewContainers[view].classList.add('active');
        }
        
        // 버튼 상태 업데이트
        this.updateViewButtons(view);
    }
    
    /**
     * 뷰 버튼 업데이트
     */
    updateViewButtons(activeView) {
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === activeView);
        });
    }
    
    /**
     * 현재 뷰 가져오기
     */
    getCurrentView() {
        return this.currentView;
    }
    
    /**
     * 뷰 전환 애니메이션
     */
    transitionToView(view, callback) {
        const currentContainer = this.viewContainers[this.currentView];
        const nextContainer = this.viewContainers[view];
        
        if (!currentContainer || !nextContainer) {
            this.setView(view);
            if (callback) callback();
            return;
        }
        
        // 페이드 아웃
        currentContainer.style.opacity = '0';
        
        setTimeout(() => {
            // 뷰 전환
            this.setView(view);
            
            // 페이드 인
            nextContainer.style.opacity = '0';
            setTimeout(() => {
                nextContainer.style.opacity = '1';
                if (callback) callback();
            }, 10);
        }, 300);
    }
}