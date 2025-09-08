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
    
    // 헤더 제거하고 각 행을 9개 열로 확장
    const deliveryData = rows.slice(1).map(row => {
      const expandedRow = [...row];
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
