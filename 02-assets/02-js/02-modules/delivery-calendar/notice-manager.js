// ========== notice-manager.js ==========
export const NoticeManager = {
    notices: [
        { type: 'info', message: '설 연휴 배송 일정이 변경되었습니다.' },
        { type: 'warning', message: '1월 27일 ~ 30일은 배송이 없습니다.' }
    ],
    
    loadNotices() {
        const container = document.getElementById('noticesList');
        if (!container) return;
        
        let html = '';
        this.notices.forEach(notice => {
            html += `
                <div class="notice-item ${notice.type}">
                    ${notice.message}
                </div>
            `;
        });
        
        container.innerHTML = html;
    }
};
