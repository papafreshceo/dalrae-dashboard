// notice.js - 공지사항 페이지 JavaScript

let noticesData = [];
let currentFilter = 'all';

// 공지사항 데이터 로드
async function loadNotices() {
    try {
        const response = await fetch('../api/notice');
        const data = await response.json();
        
        // 데이터 파싱 (헤더 행 제외)
        noticesData = data.slice(1).map((row, index) => ({
            id: row[0] || index + 1,
            date: row[1] || '',
            isPinned: row[2] === 'Y',
            title: row[3] || '제목 없음',
            titleThumbnail: row[4] || '',
            contentThumbnail: row[5] || '',
            header1: row[6] || '',
            content1: row[7] || '',
            header2: row[8] || '',
            content2: row[9] || '',
            header3: row[10] || '',
            content3: row[11] || ''
        })).filter(notice => notice.title && notice.title !== '제목 없음');

        // 날짜순 정렬 (최신순)
        noticesData.sort((a, b) => {
            if (a.isPinned && !b.isPinned) return -1;
            if (!a.isPinned && b.isPinned) return 1;
            return new Date(b.date) - new Date(a.date);
        });

        renderNotices();
    } catch (error) {
        console.error('공지사항 로드 실패:', error);
        showEmptyState();
    }
}

// 공지사항 렌더링
function renderNotices() {
    const container = document.getElementById('noticeList');
    
    let filteredNotices = noticesData;
    
    // 필터 적용
    if (currentFilter === 'pinned') {
        filteredNotices = noticesData.filter(n => n.isPinned);
    } else if (currentFilter === 'recent') {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        filteredNotices = noticesData.filter(n => new Date(n.date) >= oneWeekAgo);
    }

    // 검색어 적용
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    if (searchTerm) {
        filteredNotices = filteredNotices.filter(n => 
            n.title.toLowerCase().includes(searchTerm) ||
            n.content1.toLowerCase().includes(searchTerm) ||
            n.content2.toLowerCase().includes(searchTerm) ||
            n.content3.toLowerCase().includes(searchTerm)
        );
    }

    if (filteredNotices.length === 0) {
        showEmptyState();
        return;
    }

    // 고정 공지와 일반 공지 분리
    const pinnedNotices = filteredNotices.filter(n => n.isPinned);
    const regularNotices = filteredNotices.filter(n => !n.isPinned);

    let html = '';

    // 고정 공지사항
    if (pinnedNotices.length > 0) {
        html += `
            <div class="pinned-section">
                <div class="section-label">
                    고정 공지사항
                </div>
                <div class="notice-grid">
                    ${pinnedNotices.map(notice => createNoticeCard(notice, true)).join('')}
                </div>
            </div>
        `;
    }

    // 일반 공지사항
    if (regularNotices.length > 0) {
        html += `
            <div class="notice-grid">
                ${regularNotices.map(notice => createNoticeCard(notice, false)).join('')}
            </div>
        `;
    }

    container.innerHTML = html;
}

// 공지사항 카드 생성
function createNoticeCard(notice, isPinned) {
    const excerpt = notice.content1 ? 
        (notice.content1.length > 100 ? notice.content1.substring(0, 100) + '...' : notice.content1) : 
        '내용이 없습니다.';

    return `
        <div class="notice-card ${isPinned ? 'pinned' : ''}" onclick="showNoticeDetail(${noticesData.indexOf(notice)})">
            ${isPinned ? '<div class="pinned-badge">고정</div>' : ''}
            <div class="notice-card-header">
                ${notice.titleThumbnail ? `
                    <img src="${notice.titleThumbnail}" alt="${notice.title}" class="notice-thumbnail" onerror="this.style.display='none'">
                ` : ''}
                <div class="notice-content">
                    <div class="notice-date">${formatDate(notice.date)}</div>
                    <h3 class="notice-title">${notice.title}</h3>
                    <p class="notice-excerpt">${excerpt}</p>
                    <div class="notice-meta">
                        <span class="meta-item">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                            <span>자세히 보기</span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// 공지사항 상세 보기
window.showNoticeDetail = function(index) {
    const notice = noticesData[index];
    const modal = document.getElementById('noticeModal');
    const modalHeader = document.getElementById('modalHeader');
    const modalBody = document.getElementById('modalBody');

    // 헤더 내용
    modalHeader.innerHTML = `
        <div class="notice-date">${formatDate(notice.date)}</div>
        <h2 class="notice-title" style="font-size: var(--text-2xl); margin-top: var(--space-sm);">${notice.title}</h2>
    `;

    // 바디 내용
    let bodyHtml = '';
    
    if (notice.contentThumbnail) {
        bodyHtml += `<img src="${notice.contentThumbnail}" alt="${notice.title}" class="modal-thumbnail" onerror="this.style.display='none'">`;
    }

    // 섹션 1
    if (notice.header1 || notice.content1) {
        bodyHtml += `
            <div class="modal-section">
                ${notice.header1 ? `<h3 class="modal-section-title">${notice.header1}</h3>` : ''}
                ${notice.content1 ? `<div class="modal-section-content">${notice.content1}</div>` : ''}
            </div>
        `;
    }

    // 섹션 2
    if (notice.header2 || notice.content2) {
        bodyHtml += `
            <div class="modal-section">
                ${notice.header2 ? `<h3 class="modal-section-title">${notice.header2}</h3>` : ''}
                ${notice.content2 ? `<div class="modal-section-content">${notice.content2}</div>` : ''}
            </div>
        `;
    }

    // 섹션 3
    if (notice.header3 || notice.content3) {
        bodyHtml += `
            <div class="modal-section">
                ${notice.header3 ? `<h3 class="modal-section-title">${notice.header3}</h3>` : ''}
                ${notice.content3 ? `<div class="modal-section-content">${notice.content3}</div>` : ''}
            </div>
        `;
    }

    modalBody.innerHTML = bodyHtml;
    modal.classList.add('active');
}

// 모달 닫기
window.closeModal = function() {
    document.getElementById('noticeModal').classList.remove('active');
}

// 빈 상태 표시
function showEmptyState() {
    document.getElementById('noticeList').innerHTML = `
        <div class="empty-state">
            <div class="empty-icon"></div>
            <div class="empty-title">공지사항이 없습니다</div>
            <div class="empty-message">새로운 공지사항이 등록되면 여기에 표시됩니다.</div>
        </div>
    `;
}

// 날짜 포맷
function formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diff === 0) return '오늘';
    if (diff === 1) return '어제';
    if (diff < 7) return `${diff}일 전`;
    
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
}

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', function() {
    // 필터 태그 클릭
    document.querySelectorAll('.filter-tag').forEach(tag => {
        tag.addEventListener('click', function() {
            document.querySelectorAll('.filter-tag').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.dataset.filter;
            renderNotices();
        });
    });

    // 검색 입력
    document.getElementById('searchInput').addEventListener('input', renderNotices);

    // 모달 외부 클릭 시 닫기
    document.getElementById('noticeModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });

    // 데이터 로드
    loadNotices();

    // 헤더 활성화
    setTimeout(() => {
        if (window.DalraeHeader && window.DalraeHeader.setActivePage) {
            window.DalraeHeader.setActivePage('notice');
        }
    }, 200);
});