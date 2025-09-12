/**
 * calendar-chart.js
 * 캘린더 차트 모듈
 */

export class CalendarChart {
    constructor() {
        this.chart = null;
        this.modal = null;
        this.createChartModal();
    }
    
    /**
     * 차트 모달 생성
     */
    createChartModal() {
        const existing = document.getElementById('priceChartModal');
        if (existing) {
            existing.remove();
        }
        
        const modalHtml = `
            <div class="price-chart-modal" id="priceChartModal">
                <div class="price-chart-content">
                    <div class="price-chart-header">
                        <h2 class="price-chart-title" id="chartTitle">가격 변동 차트</h2>
                        <p class="price-chart-subtitle" id="chartSubtitle">가격 추이를 확인하세요</p>
                    </div>
                    <div id="chartBody">
                        <div style="text-align: center; padding: 50px;">
                            <div style="color: #6c757d;">데이터 로딩 중...</div>
                        </div>
                    </div>
                    <div class="price-chart-footer">
                        <button class="chart-btn" onclick="this.closest('.price-chart-modal').classList.remove('show')">닫기</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        this.modal = document.getElementById('priceChartModal');
    }
    
    /**
     * 차트 표시
     */
    show(data, title) {
        if (!this.modal) return;
        
        document.getElementById('chartTitle').textContent = title || '가격 변동 차트';
        
        if (!data || data.length === 0) {
            this.showNoData();
            this.modal.classList.add('show');
            return;
        }
        
        // 차트 데이터 준비
        const chartData = this.prepareChartData(data);
        
        // HTML 렌더링
        this.renderChartHTML(chartData);
        
        // 모달 표시
        this.modal.classList.add('show');
        
        // 차트 그리기
        setTimeout(() => {
            this.drawChart(chartData);
        }, 100);
    }
    
    /**
     * 차트 데이터 준비
     */
    prepareChartData(data) {
        const sorted = [...data].sort((a, b) => 
            new Date(a.날짜) - new Date(b.날짜)
        );
        
        const prices = sorted.map(d => {
            const price = parseInt(String(d.공급가 || 0).replace(/,/g, ''));
            return isNaN(price) ? 0 : price;
        });
        
        const validPrices = prices.filter(p => p > 0);
        
        const stats = {
            current: validPrices[validPrices.length - 1] || 0,
            max: Math.max(...validPrices, 0),
            min: Math.min(...validPrices.filter(p => p > 0), 0),
            avg: validPrices.length > 0 ? 
                Math.round(validPrices.reduce((a, b) => a + b, 0) / validPrices.length) : 0
        };
        
        const labels = sorted.map(d => {
            const date = new Date(d.날짜);
            return `${date.getMonth() + 1}/${date.getDate()}`;
        });
        
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
        const html = `
            <div style="text-align: center; font-size: 13px; color: #6b7280; margin-bottom: 16px;">
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
        
        document.getElementById('chartBody').innerHTML = html;
    }
    
    /**
     * Chart.js로 차트 그리기
     */
    drawChart(data) {
        const canvas = document.getElementById('priceChartCanvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        if (this.chart) {
            this.chart.destroy();
        }
        
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: '공급가',
                    data: data.prices,
                    borderColor: 'rgb(37, 99, 235)',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    tension: 0.1,
                    borderWidth: 2,
                    pointRadius: 4,
                    pointBackgroundColor: 'rgb(37, 99, 235)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointHoverRadius: 6,
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
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            font: {
                                size: 11
                            },
                            autoSkip: true,
                            maxTicksLimit: 10
                        }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: (value) => {
                                return value.toLocaleString() + '원';
                            },
                            font: {
                                size: 11
                            }
                        }
                    }
                }
            }
        });
    }
    
    showNoData() {
        document.getElementById('chartBody').innerHTML = `
            <div style="text-align: center; padding: 50px;">
                <div style="color: #6c757d;">가격 데이터가 없습니다.</div>
            </div>
        `;
    }
    
    formatDateRange(dateStr) {
        const date = new Date(dateStr);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}.${month}.${day}`;
    }
    
    hide() {
        if (this.modal) {
            this.modal.classList.remove('show');
        }
        
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }
    }
}