export default async function handler(req, res) {
  try {
    const SHEET_ID = process.env.GOOGLE_SHEET_ID;
    const API_KEY = process.env.GOOGLE_API_KEY;
    const range = 'DELIVERY!A:F';
    
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${API_KEY}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    // 헤더 제거하고 데이터만 반환
    const deliveryData = data.values ? data.values.slice(1) : [];
    
    res.status(200).json(deliveryData);
  } catch (error) {
    console.error('Delivery data fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch delivery data' });
  }
}