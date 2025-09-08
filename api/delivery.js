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
      valueRenderOption: 'UNFORMATTED_VALUE',
      majorDimension: 'ROWS'
    });
    
    const rows = response.data.values || [];
    
    // 헤더 제거하고 각 행을 9개 열로 확장
    const deliveryData = rows.slice(1).map(row => {
      // 빈 배열 처리
      if (!row) {
        return Array(9).fill('');
      }
      
      // 배열 복사 후 9개 열로 확장
      const expandedRow = [...row];
      while (expandedRow.length < 9) {
        expandedRow.push('');
      }
      
      return expandedRow;
    });
    
    // 디버깅용 로그
    console.log('First row columns:', deliveryData[0]?.length);
    console.log('Sample H column:', deliveryData[0]?.[7]);
    console.log('Sample I column:', deliveryData[0]?.[8]);
    
    res.status(200).json(deliveryData);
  } catch (error) {
    console.error('Error fetching delivery data:', error);
    res.status(500).json({ error: 'Failed to fetch delivery data' });
  }
}
