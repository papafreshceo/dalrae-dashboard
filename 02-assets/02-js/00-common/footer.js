// footer.js - 달래마켓 공통 푸터 (최소화 버전)
(function() {
    // 푸터 스타일 생성
    function createFooterStyles() {
        const styles = `
            /* 푸터 스타일 - 최소화 */
            .footer {
                background: #ffffff;
                border-top: 1px solid #e8e9eb;
                padding: 20px 0 15px;
            }

            .footer-content {
                max-width: 1400px;
                margin: 0 auto;
                padding: 0 30px;
                text-align: center;
            }

            /* 1행: 로고 */
            .footer-logo {
                height: 14px;
                object-fit: contain;
                margin-bottom: 10px;
                filter: grayscale(100%) brightness(0.4);
                opacity: 0.7;
            }

            /* 2행: 회사 정보 */
            .footer-info {
                font-size: 11px;
                color: #6b7280;
                line-height: 1.4;
                margin-bottom: 10px;
            }

            .footer-info span {
                display: inline-block;
                margin: 0 8px;
            }

            .footer-info span:first-child {
                margin-left: 0;
            }

            .footer-info span:last-child {
                margin-right: 0;
            }

            /* 3행: 메뉴 링크 */
            .footer-menu {
                margin-bottom: 10px;
            }

            .footer-link {
                font-size: 11px;
                color: #6b7280;
                text-decoration: none;
                margin: 0 10px;
                transition: color 0.2s ease;
                cursor: pointer;
            }

            .footer-link:hover {
                color: #667eea;
            }

            .footer-link:first-child {
                margin-left: 0;
            }

            .footer-link:last-child {
                margin-right: 0;
            }

            /* 4행: 연락처 & SNS */
            .footer-contact-row {
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 20px;
                font-size: 11px;
                color: #6b7280;
            }

            .contact-item {
                display: flex;
                align-items: center;
                gap: 5px;
            }

            .contact-item a {
                color: #6b7280;
                text-decoration: none;
                transition: color 0.2s ease;
            }

            .contact-item a:hover {
                color: #667eea;
            }

            .contact-icon {
                width: 12px;
                height: 12px;
                opacity: 0.6;
            }

            /* SNS 아이콘 */
            .footer-social {
                display: flex;
                gap: 8px;
            }

            .social-link {
                width: 24px;
                height: 24px;
                border-radius: 4px;
                background: #f3f4f6;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
                cursor: pointer;
            }

            .social-link:hover {
                background: #667eea;
                transform: translateY(-1px);
            }

            .social-link svg {
                width: 12px;
                height: 12px;
                fill: #6b7280;
                transition: fill 0.2s ease;
            }

            .social-link:hover svg {
                fill: white;
            }

            /* 카카오톡 버튼 특별 스타일 */
            .social-link.kakao {
                background: #FEE500;
            }

            .social-link.kakao:hover {
                background: #FDD835;
            }

            .social-link.kakao img {
                width: 14px !important;
                height: 14px !important;
            }

            /* 구분선 */
            .divider {
                display: inline-block;
                width: 1px;
                height: 10px;
                background: #e8e9eb;
                margin: 0 8px;
                vertical-align: middle;
            }

            /* 하단 카피라이트 */
            .footer-bottom {
                margin-top: 12px;
                padding-top: 12px;
                border-top: 1px solid #e8e9eb;
                text-align: center;
                font-size: 10px;
                color: #9ca3af;
            }

            .footer-bottom a {
                color: #6b7280;
                text-decoration: none;
                margin: 0 6px;
                transition: color 0.2s ease;
            }

            .footer-bottom a:hover {
                color: #667eea;
            }

            /* 모바일 반응형 */
            @media (max-width: 768px) {
                .footer {
                    padding: 15px 0 12px;
                }

                .footer-content {
                    padding: 0 15px;
                }

                .footer-logo {
                    height: 12px;
                    margin-bottom: 8px;
                }

                .footer-info {
                    font-size: 10px;
                    margin-bottom: 8px;
                }

                .footer-info span {
                    display: block;
                    margin: 2px 0;
                }

                .footer-menu {
                    margin-bottom: 8px;
                }

                .footer-link {
                    font-size: 10px;
                    margin: 0 6px;
                    display: inline-block;
                    line-height: 1.6;
                }

                .footer-contact-row {
                    flex-direction: column;
                    gap: 8px;
                    font-size: 10px;
                }

                .contact-item {
                    gap: 4px;
                }

                .contact-icon {
                    width: 10px;
                    height: 10px;
                }

                .social-link {
                    width: 22px;
                    height: 22px;
                }

                .social-link svg {
                    width: 11px;
                    height: 11px;
                }

                .social-link.kakao img {
                    width: 12px !important;
                    height: 12px !important;
                }

                .footer-bottom {
                    margin-top: 10px;
                    padding-top: 10px;
                    font-size: 9px;
                }
            }
        `;
        
        const styleElement = document.createElement('style');
        styleElement.textContent = styles;
        document.head.appendChild(styleElement);
    }

    // 푸터 HTML 생성
    function createFooter() {
        const footerHTML = `
            <footer class="footer">
                <div class="footer-content">
                    <!-- 1행: 로고 -->
                    <img src="https://res.cloudinary.com/dde1hpbrp/image/upload/v1753148563/05_etc/dalraemarket_papafarmers.com/DalraeMarket_loge_trans.png" 
                         alt="달래마켓" 
                         class="footer-logo">
                    
                    <!-- 2행: 회사 정보 -->
                    <div class="footer-info">
                        <span>대표: 남잠화</span>
                        <span>사업자등록번호: 107-30-96371</span>
                        <span>통신판매업신고: 2022-경북청도-0003</span>
                    </div>
                    
                    <!-- 3행: 메뉴 링크 -->
                    <div class="footer-menu">
                        <a class="footer-link" onclick="navigateToFooterPage('dashboard')">대시보드</a>
                        <span class="divider"></span>
                        <a class="footer-link" onclick="navigateToFooterPage('products')">상품리스트</a>
                        <span class="divider"></span>
                        <a class="footer-link" onclick="navigateToFooterPage('calendar')">상품캘린더</a>
                        <span class="divider"></span>
                        <a class="footer-link" onclick="navigateToFooterPage('delivery')">배송캘린더</a>
                        <span class="divider"></span>
                        <a class="footer-link" onclick="navigateToFooterPage('orders')">주문관리</a>
                        <span class="divider"></span>
                        <a class="footer-link" onclick="navigateToFooterPage('services')">서비스&프로그램</a>
                        <span class="divider"></span>
                        <a class="footer-link" onclick="navigateToFooterPage('notice')">공지사항</a>
                    </div>
                    
                    <!-- 4행: 연락처 & SNS -->
                    <div class="footer-contact-row">
                        <div class="contact-item">
                            <svg class="contact-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 8L10.89 13.26C11.2187 13.4793 11.6049 13.5963 12 13.5963C12.3951 13.5963 12.7813 13.4793 13.11 13.26L21 8M5 19H19C19.5304 19 20.0391 18.7893 20.4142 18.4142C20.7893 18.0391 21 17.5304 21 17V7C21 6.46957 20.7893 5.96086 20.4142 5.58579C20.0391 5.21071 19.5304 5 19 5H5C4.46957 5 3.96086 5.21071 3.58579 5.58579C3.21071 5.96086 3 6.46957 3 7V17C3 17.5304 3.21071 18.0391 3.58579 18.4142C3.96086 18.7893 4.46957 19 5 19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <span>papa_fresh@naver.com</span>
                        </div>
                        
                        <div class="contact-item">
                            <svg class="contact-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 4H9L11 9L8.5 10.5C9.57096 12.6715 11.3285 14.429 13.5 15.5L15 13L20 15V19C20 19.5304 19.7893 20.0391 19.4142 20.4142C19.0391 20.7893 18.5304 21 18 21C14.0993 20.763 10.4202 19.1065 7.65683 16.3432C4.8935 13.5798 3.23705 9.90074 3 6C3 5.46957 3.21071 4.96086 3.58579 4.58579C3.96086 4.21071 4.46957 4 5 4Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <a href="tel:01026881388">010-2688-1388</a>
                        </div>
                        
                        <!-- SNS 링크 -->
                        <div class="footer-social">
                            <a class="social-link" href="https://papafarmers.com/orders/" target="_blank" title="발주시스템">
                                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
                                </svg>
                            </a>
                            <a class="social-link" href="https://blog.naver.com/papa_fresh" target="_blank" title="네이버 블로그">
                                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M16.273 12.845 7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727v12.845z"/>
                                </svg>
                            </a>
                            <a class="social-link" href="https://www.instagram.com/dalraemarket" target="_blank" title="인스타그램">
                                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.405a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z"/>
                                </svg>
                            </a>
                            <a class="social-link kakao" href="https://open.kakao.com/o/gXyZdXYg" target="_blank" title="카카오톡">
                                <img src="https://res.cloudinary.com/dde1hpbrp/image/upload/v1757496850/kakaotalk_sharing_btn_small_wozpwf.png" 
                                     alt="카카오톡">
                            </a>
                        </div>
                    </div>
                </div>

                <!-- 하단 카피라이트 -->
                <div class="footer-bottom">
                    © 2024 달래마켓. All rights reserved.
                    <span style="margin: 0 6px;">|</span>
                    <a href="#" onclick="showTerms(); return false;">이용약관</a>
                    <a href="#" onclick="showPrivacy(); return false;">개인정보처리방침</a>
                </div>
            </footer>
        `;
        
        return footerHTML;
    }

    // 푸터 페이지 이동
    window.navigateToFooterPage = function(page) {
    // 현재 페이지 위치 확인
        const currentPath = window.location.pathname;
        const isInPagesFolder = currentPath.includes('/01-pages/');
        const isRoot = !isInPagesFolder;
        
        let pageUrls = {};
        
        if (isRoot) {
            // 루트(index.html)에서 다른 페이지로 이동
            pageUrls = {
                'dashboard': '01-pages/01-dashboard.html',
                'products': '01-pages/02-products.html',
                'calendar': '01-pages/03-products-calendar.html',
                'delivery': '01-pages/04-delivery-calendar.html',
                'orders': '01-pages/05-orders.html',
                'services': '01-pages/06-services.html',
                'notice': '01-pages/07-notice.html'
            };
        } else {
            // 01-pages 폴더 내에서 이동
            pageUrls = {
                'dashboard': '01-dashboard.html',
                'products': '02-products.html',
                'calendar': '03-products-calendar.html',
                'delivery': '04-delivery-calendar.html',
                'orders': '05-orders.html',
                'services': '06-services.html',
                'notice': '07-notice.html'
            };
            
            // index로 가는 경우
            if (page === 'index') {
                window.location.href = '../index.html';
                return;
            }
        }
        
        if (pageUrls[page]) {
            if (window.navigateTo) {
                window.navigateTo(pageUrls[page]);
            } else {
                window.location.href = pageUrls[page];
            }
        }
    };

    // 약관 표시
    window.showTerms = function() {
        alert('이용약관 페이지로 이동합니다.');
    };

    // 개인정보처리방침 표시
    window.showPrivacy = function() {
        alert('개인정보처리방침 페이지로 이동합니다.');
    };

    // 푸터 초기화
    function initFooter(options = {}) {
        createFooterStyles();
        
        const { containerId = 'footer-container' } = options;
        
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`푸터 컨테이너 '${containerId}'를 찾을 수 없습니다`);
            return;
        }
        
        container.innerHTML = createFooter();
    }

    // DOM이 로드되면 자동 초기화
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            if (document.getElementById('footer-container')) {
                initFooter();
            }
        });
    } else {
        if (document.getElementById('footer-container')) {
            initFooter();
        }
    }

    // 전역으로 내보내기
    window.DalraeFooter = {
        init: initFooter
    };
})();
