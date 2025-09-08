import { google } from 'googleapis';

export default async function handler(req, res) {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT),
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });
    const sheets = google.sheets({ version: 'v4', auth });
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range: 'DELIVERY!A:I',
    });
    
    const rows = response.data.values || [];
    
    // 헤더 제거
    const headers = rows[0];
    const deliveryData = rows.slice(1).map(row => {
      // 행이 없으면 빈 배열 반환
      if (!row) return [];
      
      // 현재 행 복사
      const expandedRow = [...row];
      
      // 9개 열이 되도록 빈 문자열 추가
      while (expandedRow.length < 9) {
        expandedRow.push('');
      }
      
      return expandedRow;
    });
    
    res.status(200).json(deliveryData);
  } catch (error) {
    console.error('Error fetching delivery data:', error);
    res.status(500).json({ error: 'Failed to fetch delivery data' });
  }
}
