/**
 * 연간 캘린더 Web Component
 * 12월 중순 이후 시작 품종은 시작 아이콘만 12월에 표시하고 텍스트는 1월에 표시
 */
class YearCalendar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.yearTimelines = [];
        this.colorMap = {};
    }
    
    connectedCallback() {
        this.render();
        this.loadData();
    }
    
    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    font-family: 'Noto Sans KR', -apple-system, sans-serif;
                }
                
                .year-container {
                    background: white;
                    border-radius: 12px;
                    padding: 24px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
                    overflow-x: auto;
                }
                
                .year-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                }
                
                .year-title {
                    font-size: 20px;
                    font-weight: 600;
                    color: #212529;
                }
                
                .today-btn {
                    padding: 8px 16px;
                    background: white;
                    border: 1px solid #dee2e6;
                    border-radius: 6px;
                    color: #495057;
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .today-btn:hover {
                    background: #2563eb;
                    color: white;
                    border-color: #2563eb;
                }
                
                .year-content {
                    position: relative;
                    min-width: 900px;
                }
                
                .months-header {
                    display: grid;
                    grid-template-columns: repeat(12, 1fr);
                    gap: 0;
                    background: white;
                    border-bottom: 2px solid #e9ecef;
                    margin-bottom: 20px;
                    position: sticky;
                    top: 0;
                    z-index: 50;
                }
                
                .month-label {
                    padding: 14px 8px;
                    text-align: center;
                    font-weight: 700;
                    font-size: 12px;
                    letter-spacing: 0.05em;
                    text-transform: uppercase;
                    color: #6c757d;
                }
                
                .timeline-container {
                    position: relative;
                    min-height: 400px;
                }
                
                .timeline-row {
                    position: relative;
                    height: 24px;
                    margin-bottom: 4px;
                    display: grid;
                    grid-template-columns: repeat(12, 1fr);
                    border-bottom: 1px solid #f8f9fa;
                    transition: background 0.2s;
                }
                
                .timeline-row:hover {
                    background: #fafbfc;
                }
                
                .month-cell {
                    position: relative;
                    border-right: 1px solid #f1f3f5;
                }
                
                .month-cell:last-child {
                    border-right: none;
                }
                
                .timeline-bar {
                    position: absolute;
                    height: 18px;
                    top: 3px;
                    color: white;
                    font-size: 10px;
                    display: flex;
                    align-items: center;
                    padding: 0 8px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    cursor: pointer;
                    transition: all 0.2s;
                    z-index: 10;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.1);
                    border-radius: 3px;
                    opacity: 0.9;
                }
                
                .timeline-bar:hover {
                    transform: scale(1.05) translateY(-1px);
                    z-index: 100;
                    box-shadow: 0 3px 6px rgba(0,0,0,0.15);
                    opacity: 1;
                }
                
                .bar-icon {
                    margin-right: 3px;
                    font-size: 9px;
                    flex-shrink: 0;
                }
                
                .bar-text {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                
                /* 12월 중순 이후 시작하는 품종 스타일 */
                .timeline-bar.icon-only {
                    min-width: 20px;
                    justify-content: center;
                    padding: 0 4px;
                }
                
                .timeline-bar.icon-only .bar-text {
                    display: none;
                }
                
                .timeline-bar.continuation {
                    border-left: 2px dashed rgba(255,255,255,0.5);
                }
                
                /* 오늘 라인 */
                .today-line {
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    width: 3px;
                    background: #2563eb;
                    z-index: 999;
                    opacity: 1;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                
                /* 무지개 애니메이션 */
                @keyframes rainbow-pulse {
                    0% {
                        background: #2563eb;
                        box-shadow: 0 0 10px rgba(37, 99, 235, 0.5);
                    }
                    20% {
                        background: #ff0000;
                        box-shadow: 0 0 15px rgba(255, 0, 0, 0.5);
                    }
                    40% {
                        background: #ffff00;
                        box-shadow: 0 0 15px rgba(255, 255, 0, 0.5);
                    }
                    60% {
                        background: #0000ff;
                        box-shadow: 0 0 15px rgba(0, 0, 255, 0.5);
                    }
                    80% {
                        background: #00ff00;
                        box-shadow: 0 0 15px rgba(0, 255, 0, 0.5);
                    }
                    100% {
                        background: #2563eb;
                        box-shadow: 0 0 10px rgba(37, 99, 235, 0.5);
                    }
                }
                
                .today-line.highlight {
                    width: 5px;
                    animation: rainbow-pulse 2s ease-in-out;
                }
                
                .today-marker {
                    position: absolute;
                    top: -25px;
                    transform: translateX(-50%);
                    z-index: 1000;
                    background: #2563eb;
                    color: white;
                    padding: 4px 10px;
                    border-radius: 4px;
                    font-size: 12px;
                    font-weight: 600;
                    box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                
                .today-marker.highlight {
                    transform: translateX(-50%) scale(1.1);
                    animation: rainbow-pulse 2s ease-in-out;
                }
                
                .loading {
                    text-align: center;
                    padding: 40px;
                    color: #6c757d;
                }
                
                @media (max-width: 768px) {
                    .year-container {
                        padding: 15px;
                    }
                    
                    .timeline-row {
                        height: 20px;
                    }
                    
                    .timeline-bar {
                        height: 14px;
                        font-size: 8px;
                        padding: 0 6px;
                    }
                }
            </style>
            
            <div class="year-container">
                <div class="year-header">
                    <div class="year-title" id="yearTitle">2024년 연간 캘린더</div>
                    <button class="today-btn" id="todayBtn">오늘</button>
                </div>
                
                <div class="year-content">
                    <div class="months-header">
                        <div class="month-label">1월</div>
                        <div class="month-label">2월</div>
                        <div class="month-label">3월</div>
                        <div class="month-label">4월</div>
                        <div class="month-label">5월</div>
                        <div class="month-label">6월</div>
                        <div class="month-label">7월</div>
                        <div class="month-label">8월</div>
                        <div class="month-label">9월</div>
                        <div class="month-label">10월</div>
                        <div class="month-label">11월</div>
                        <div class="month-label">12월</div>
                    </div>
                    
                    <div class="timeline-container" id="timelineContainer">
                        <div class="loading">연간 캘린더 로딩중...</div>
                    </div>
                </div>
            </div>
        `;
        
        // 이벤트 리스너
        const todayBtn = this.shadowRoot.getElementById('todayBtn');
        todayBtn.addEventListener('click', () => this.scrollToToday());
    }
    
    async loadData() {
        try {
            this.yearTimelines = await DataService.getYearTimelines();
            this.assignColors();
            this.renderTimelines();
        } catch (error) {
            console.error('데이터 로드 실패:', error);
            this.showError();
        }
    }
    
    assignColors() {
        this.yearTimelines.forEach((timeline, index) => {
            if (timeline.color) {
                this.colorMap[timeline.name] = timeline.color;
            } else {
                this.colorMap[timeline.name] = DataService.getDefaultColor(index);
            }
        });
    }
    
    renderTimelines() {
        const container = this.shadowRoot.getElementById('timelineContainer');
        const currentYear = new Date().getFullYear();
        this.shadowRoot.getElementById('yearTitle').textContent = `${currentYear}년 연간 캘린더`;
        
        let html = '';
        
        this.yearTimelines.forEach((product) => {
            html += '<div class="timeline-row">';
            
            // 월별 셀 생성
            for (let m = 0; m < 12; m++) {
                html += '<div class="month-cell"></div>';
            }
            
            const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            const color = this.colorMap[product.name];
            
            let displayText = product.item === product.name ? 
                            product.name : 
                            `${product.item} | ${product.name}`;
            
            // 12월 중순 이후 시작 체크
            const isLateDecemberStart = product.startMonth === 11 && product.startDay >= 15;
            
            if (product.startMonth > product.endMonth) {
                // 연도를 넘어가는 경우
                const firstStart = (100 / 12) * (product.startMonth + product.startDay / monthDays[product.startMonth]);
                const firstWidth = 100 - firstStart;
                
                // 12월 부분 (시작)
                if (isLateDecemberStart) {
                    // 아이콘만 표시
                    html += `
                        <div class="timeline-bar icon-only"
                             data-product-name="${product.name}"
                             style="left: ${firstStart}%; width: 2%; background: ${color};">
                            <span class="bar-icon">▶</span>
                        </div>
                    `;
                } else {
                    html += `
                        <div class="timeline-bar"
                             data-product-name="${product.name}"
                             style="left: ${firstStart}%; width: ${firstWidth}%; background: ${color};">
                            <span class="bar-icon">▶</span>
                            <span class="bar-text">${displayText}</span>
                        </div>
                    `;
                }
                
                // 1월 부분 (이어짐)
                const secondWidth = (100 / 12) * (product.endMonth + product.endDay / monthDays[product.endMonth]);
                const continuationClass = isLateDecemberStart ? 'timeline-bar continuation' : 'timeline-bar';
                const continuationText = isLateDecemberStart ? displayText : '';
                
                html += `
                    <div class="${continuationClass}"
                         data-product-name="${product.name}"
                         style="left: 0; width: ${secondWidth}%; background: ${color};">
                        ${continuationText ? '<span class="bar-text">' + continuationText + '</span>' : ''}
                    </div>
                `;
            } else {
                // 같은 연도 내
                const startOffset = (100 / 12) * (product.startMonth + product.startDay / monthDays[product.startMonth]);
                const endOffset = (100 / 12) * (product.endMonth + product.endDay / monthDays[product.endMonth]);
                const width = endOffset - startOffset;
                
                html += `
                    <div class="timeline-bar"
                         data-product-name="${product.name}"
                         style="left: ${startOffset}%; width: ${width}%; background: ${color};">
                        <span class="bar-icon">▶</span>
                        <span class="bar-text">${displayText}</span>
                    </div>
                `;
            }
            
            html += '</div>';
        });
        
        // 오늘 표시
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentDay = today.getDate();
        const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        const todayPosition = (100 / 12) * (currentMonth + currentDay / monthDays[currentMonth]);
        
        html += `<div class="today-line" id="todayLine" style="left: ${todayPosition}%;"></div>`;
        html += `<div class="today-marker" id="todayMarker" style="left: ${todayPosition}%;">오늘</div>`;
        
        container.innerHTML = html;
        
        // 이벤트 리스너 추가
        this.attachBarEvents();
    }
    
    attachBarEvents() {
        const bars = this.shadowRoot.querySelectorAll('.timeline-bar');
        bars.forEach(bar => {
            const productName = bar.dataset.productName;
            
            bar.addEventListener('click', () => {
                this.dispatchEvent(new CustomEvent('show-modal', {
                    detail: { variety: productName },
                    bubbles: true,
                    composed: true
                }));
            });
            
            bar.addEventListener('mouseenter', (e) => {
                const product = this.yearTimelines.find(p => p.name === productName);
                if (product) {
                    this.dispatchEvent(new CustomEvent('show-tooltip', {
                        detail: {
                            x: e.pageX,
                            y: e.pageY,
                            product: product
                        },
                        bubbles: true,
                        composed: true
                    }));
                }
            });
            
            bar.addEventListener('mouseleave', () => {
                this.dispatchEvent(new CustomEvent('hide-tooltip', {
                    bubbles: true,
                    composed: true
                }));
            });
        });
    }
    
    scrollToToday() {
        const todayLine = this.shadowRoot.getElementById('todayLine');
        const todayMarker = this.shadowRoot.getElementById('todayMarker');
        
        // 깔끔한 애니메이션 적용 (모바일/데스크톱 모두)
        todayLine.classList.add('highlight');
        todayMarker.classList.add('highlight');
        
        setTimeout(() => {
            todayLine.classList.remove('highlight');
            todayMarker.classList.remove('highlight');
        }, 1000);  // 애니메이션 시간과 동일하게
        
        // 모바일에서 스크롤
        if (window.innerWidth <= 768) {
            const container = this.shadowRoot.querySelector('.year-container');
            const todayPosition = parseFloat(todayLine.style.left);
            const containerWidth = container.scrollWidth;
            const scrollPosition = (containerWidth * todayPosition / 100) - (container.clientWidth / 2);
            
            container.scrollTo({
                left: Math.max(0, scrollPosition),
                behavior: 'smooth'
            });
        }
    }
    
    showError() {
        const container = this.shadowRoot.getElementById('timelineContainer');
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #dc3545;">
                데이터를 불러올 수 없습니다.
            </div>
        `;
    }
}

// Web Component 등록
customElements.define('year-calendar', YearCalendar);
