// api/services.js
const express = require('express');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const router = express.Router();

// Google Sheets 인증 정보
const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID'; // 실제 시트 ID로 교체
const credentials = {
  client_email: 'YOUR_SERVICE_ACCOUNT_EMAIL',
  private_key: 'YOUR_PRIVATE_KEY'
};

// GET /api/services
router.get('/api/services', async (req, res) => {
  try {
    console.log('SERVICES 시트 데이터 로딩 시작...');
    
    // Google Sheets 연결
    const doc = new GoogleSpreadsheet(SHEET_ID);
    await doc.useServiceAccountAuth(credentials);
    await doc.loadInfo();
    
    // SERVICES 시트 찾기
    const sheet = doc.sheetsByTitle['SERVICES'];
    if (!sheet) {
      throw new Error('SERVICES 시트를 찾을 수 없습니다');
    }
    
    // 모든 행 가져오기
    const rows = await sheet.getRows();
    
    // 데이터를 JSON 형태로 변환
    const servicesPrices = rows.map(row => {
      // 시트의 각 열 데이터 매핑
      return {
        '구분': row['구분'] || row._rawData[0] || '',
        '실내촬영': row['실내촬영'] || row._rawData[1] || '',
        '야외촬영': row['야외촬영'] || row._rawData[2] || '',
        '요리촬영': row['요리촬영'] || row._rawData[3] || '',
        '드론촬영': row['드론촬영'] || row._rawData[4] || '',
        '일반편집': row['일반편집'] || row._rawData[5] || '',
        '풀편집': row['풀편집'] || row._rawData[6] || ''
      };
    });
    
    console.log(`SERVICES 데이터 로드 완료: ${servicesPrices.length}개 행`);
    
    // 응답 헤더 설정
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    
    // JSON 응답
    res.json(servicesPrices);
    
  } catch (error) {
    console.error('SERVICES 데이터 로드 오류:', error);
    res.status(500).json({ 
      error: 'Failed to load services prices',
      message: error.message 
    });
  }
});

// 또는 배열 형태로 반환하는 버전
router.get('/api/services-raw', async (req, res) => {
  try {
    const doc = new GoogleSpreadsheet(SHEET_ID);
    await doc.useServiceAccountAuth(credentials);
    await doc.loadInfo();
    
    const sheet = doc.sheetsByTitle['SERVICES'];
    const rows = await sheet.getRows();
    
    // 헤더 포함 2차원 배열로 반환
    const data = [];
    
    // 헤더 추가
    data.push(['구분', '실내촬영', '야외촬영', '요리촬영', '드론촬영', '일반편집', '풀편집']);
    
    // 데이터 행 추가
    rows.forEach(row => {
      data.push([
        row['구분'] || '',
        row['실내촬영'] || '',
        row['야외촬영'] || '',
        row['요리촬영'] || '',
        row['드론촬영'] || '',
        row['일반편집'] || '',
        row['풀편집'] || ''
      ]);
    });
    
    res.json(data);
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to load services data' });
  }
});

module.exports = router;
