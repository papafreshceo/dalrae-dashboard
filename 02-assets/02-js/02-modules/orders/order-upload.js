// ========== order-upload.js ==========
export const OrderUpload = {
    init() {
        const uploadSection = document.getElementById('orderUploadSection');
        if (!uploadSection) return;
        
        uploadSection.innerHTML = `
            <h2 class="form-title">주문서 업로드</h2>
            <p class="form-subtitle">엑셀 파일(.xlsx, .xls)을 업로드하여 대량 주문이 가능합니다.</p>
            
            <div style="padding: 40px; background: #f8f9fa; border: 2px dashed #dee2e6; border-radius: 8px; text-align: center;">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#6c757d" stroke-width="2" style="margin: 0 auto 16px;">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                <p style="color: #495057; margin-bottom: 16px;">파일을 드래그하거나 클릭하여 업로드</p>
                <input type="file" id="fileUpload" accept=".xlsx,.xls" style="display: none;">
                <button class="btn btn-primary" onclick="document.getElementById('fileUpload').click()">
                    파일 선택
                </button>
                <p style="color: #6c757d; font-size: 12px; margin-top: 12px;">
                    최대 파일 크기: 10MB
                </p>
            </div>
            
            <div style="margin-top: 20px;">
                <a href="/templates/order-template.xlsx" class="btn btn-secondary" download>
                    주문서 템플릿 다운로드
                </a>
            </div>
        `;
        
        this.setupFileUpload();
    },
    
    initMulti() {
        const multiSection = document.getElementById('multiUploadSection');
        if (!multiSection) return;
        
        multiSection.innerHTML = `
            <h2 class="form-title">멀티 업로드</h2>
            <p class="form-subtitle">여러 파일을 한 번에 업로드할 수 있습니다.</p>
            
            <div style="padding: 40px; background: #f8f9fa; border: 2px dashed #dee2e6; border-radius: 8px; text-align: center;">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#6c757d" stroke-width="2" style="margin: 0 auto 16px;">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="12" y1="18" x2="12" y2="12"></line>
                    <line x1="9" y1="15" x2="15" y2="15"></line>
                </svg>
                <p style="color: #495057; margin-bottom: 16px;">여러 파일을 드래그하거나 클릭하여 업로드</p>
                <input type="file" id="multiFileUpload" multiple accept=".xlsx,.xls,.csv" style="display: none;">
                <button class="btn btn-primary" onclick="document.getElementById('multiFileUpload').click()">
                    파일 선택
                </button>
                <p style="color: #6c757d; font-size: 12px; margin-top: 12px;">
                    지원 형식: .xlsx, .xls, .csv | 최대 10개 파일
                </p>
            </div>
            
            <div id="fileList" style="margin-top: 20px;"></div>
        `;
        
        this.setupMultiFileUpload();
    },
    
    setupFileUpload() {
        const fileInput = document.getElementById('fileUpload');
        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    this.processFile(file);
                }
            });
        }
    },
    
    setupMultiFileUpload() {
        const fileInput = document.getElementById('multiFileUpload');
        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                const files = Array.from(e.target.files);
                if (files.length > 0) {
                    this.processMultipleFiles(files);
                }
            });
        }
    },
    
    processFile(file) {
        console.log('파일 처리:', file.name);
        alert(`파일 "${file.name}"이 업로드되었습니다.`);
    },
    
    processMultipleFiles(files) {
        const fileList = document.getElementById('fileList');
        if (!fileList) return;
        
        let html = '<h3 style="margin-bottom: 12px;">업로드된 파일</h3>';
        files.forEach(file => {
            html += `
                <div style="padding: 8px 12px; background: #f8f9fa; border-radius: 4px; margin-bottom: 8px;">
                    ${file.name} (${(file.size / 1024).toFixed(1)}KB)
                </div>
            `;
        });
        
        fileList.innerHTML = html;
    }
};