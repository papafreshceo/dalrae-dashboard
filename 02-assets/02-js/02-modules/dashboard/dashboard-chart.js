/**
 * dashboard-chart.js
 * 대시보드 차트 모듈
 */

export class DashboardChart {
    constructor() {
        this.chart = null;
        this.modal = document.getElementById('chartModal');
        this.modalTitle = document.getElementById('chartModalTitle');
        this.modalBody = document.getElementById('chartModalBody');
    }
    
    /**
     * 차트 표시
     */
    displayChart(data, title) {
        if (!this.modal) return;
        
        // 모달 열기
        this.modal.classList.add('show');
        this.modalTitle.textContent = title || '가격 변동 차트';
        
        if (!data || data.length === 0) {
            this.showNoData();
            return;
        }
        
        // 차트 데이터 준비
        const chartData = this.prepareChartData(data);
        
        // HTML 렌더링
        this.renderChartHTML(chartData);
        
        // 차트 그리기
        setTimeout(() => {
            this.drawChart(chartData);
        }, 100);
    }
    
    /**
     * 차트 데이터 준비
     */
    prepareChartData(data) {
        // 날짜순 정렬
        const sorted = [...data].sort((a, b) => 
            new Date(a.날짜) - new Date(b.날짜)
        );
        
        // 가격 데이터 추출
        const prices = sorted.map(d => {
            const price = parseInt(String(d.공급가 || 0).replace(/,/g, ''));
            return isNaN(price) ? 0 : price;
        });
        
        // 통계 계산
        const validPrices = prices.filter(p => p > 0);
        const stats = {
            current: validPrices[validPrices.length - 1] || 0,
            max: Math.max(...validPrices, 0),
            min: Math.min(...validPrices.filter(p => p > 0), 0),
            avg: validPrices.length > 0 ? 
                Math.round(validPrices.reduce((a, b) => a + b, 0) / validPrices.length) : 0
        };
        
        // 날짜 레이블
        const labels = sorted.map(d => {
            const date = new Date(d.날짜);
            return `${date.getMonth() + 1}/${date.getDate()}`;
        });
        
        // 기간
        const firstDate = this.formatDateRange(sorted[0].날짜);
        const lastDate = this.formatDateRange(sorted[sorted.length - 1].날짜);
        
        return {
            labels,
            prices,
            stats,
            period: `${firstDate} ~ ${lastDate}`,
            raw: sorted
        };
    }
    
    /**
     * 차트 HTML 렌더링
     */
    renderChartHTML(data) {
        const isMobile = window.innerWidth <= 768;
        
        const html = `
            <div style="text-align: center; font-size: ${isMobile ? '10px' : '13px'}; 
                        color: #6b7280; margin-bottom: 16px;">
                ${data.period}
            </div>
            <div class="chart-container">
                <canvas id="priceChartCanvas"></canvas>
            </div>
            <div class="chart-stats">
                <div class="chart-stat-box">
                    <div class="chart-stat-label">현재 가격</div>
                    <div class="chart-stat-value current">
                        ${data.stats.current.toLocaleString()}원
                    </div>
                </div>
                <div class="chart-stat-box">
                    <div class="chart-stat-label">최고 가격</div>
                    <div class="chart-stat-value increase">
                        ${data.stats.max.toLocaleString()}원
                    </div>
                </div>
                <div class="chart-stat-box">
                    <div class="chart-stat-label">최저 가격</div>
                    <div class="chart-stat-value decrease">
                        ${data.stats.min.toLocaleString()}원
                    </div>
                </div>
                <div class="chart-stat-box">
                    <div class="chart-stat-label">평균 가격</div>
                    <div class="chart-stat-value">
                        ${data.stats.avg.toLocaleString()}원
                    </div>
                </div>
            </div>
        `;
        
        this.modalBody.innerHTML = html;
    }
    
    /**
     * Chart.js로 차트 그리기
     */
    drawChart(data) {
        const canvas = document.getElementById('priceChartCanvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const isMobile = window.innerWidth <= 768;
        
        // 기존 차트 제거
        if (this.chart) {
            this.chart.destroy();
        }
        
        // 새 차트 생성
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: '공급가',
                    data: data.prices,
                    borderColor: 'rgb(102, 126, 234)',
                    backgroundColor: 'rgba(102, 126, 234, 0.12)',
                    tension: 0.1,
                    borderWidth: isMobile ? 1.5 : 2,
                    pointRadius: isMobile ? 2 : 4,
                    pointBackgroundColor: 'rgb(102, 126, 234)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: isMobile ? 1 : 2,
                    pointHoverRadius: isMobile ? 3 : 6,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                return '공급가: ' + context.parsed.y.toLocaleString() + '원';
                            }
                        },
                        titleFont: {
                            size: isMobile ? 10 : 12
                        },
                        bodyFont: {
                            size: isMobile ? 10 : 12
                        },
                        padding: isMobile ? 4 : 8
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            font: {
                                size: isMobile ? 9 : 12
                            },
                            maxRotation: isMobile ? 45 : 0,
                            autoSkip: true,
                            maxTicksLimit: isMobile ? 6 : 12
                        },
                        grid: {
                            display: !isMobile
                        }
                    },
                    y: {
                        beginAtZero: true,
                        max: Math.ceil(data.stats.max * 1.2),
                        ticks: {
                            callback: (value) => {
                                return value.toLocaleString() + '원';
                            },
                            font: {
                                size: isMobile ? 9 : 12
                            },
                            maxTicksLimit: isMobile ? 5 : 8
                        },
                        grid: {
                            display: !isMobile
                        }
                    }
                },
                layout: {
                    padding: {
                        left: isMobile ? 2 : 10,
                        right: isMobile ? 2 : 10,
                        top: isMobile ? 2 : 10,
                        bottom: isMobile ? 2 : 10
                    }
                }
            }
        });
    }
    
    /**
     * 날짜 포맷팅
     */
    formatDateRange(dateStr) {
        const date = new Date(dateStr);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        
        return `${year}.${month}.${day}`;
    }
    
    /**
     * 데이터 없음 표시
     */
    showNoData() {
        this.modalBody.innerHTML = `
            <div class="no-data-message">
                <div class="no-data-icon"></div>
                <div class="no-data-title">데이터가 없습니다</div>
                <div class="no-data-text">
                    해당 상품의 가격 이력이 없습니다.
                </div>
            </div>
        `;
    }
    
    /**
     * 차트 모달 닫기
     */
    close() {
        if (this.modal) {
            this.modal.classList.remove('show');
        }
        
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }
    }
}