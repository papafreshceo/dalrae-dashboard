// api/services.js
app.get('/api/services', async (req, res) => {
  try {
    // Google Sheets 데이터 가져오기
    const doc = new GoogleSpreadsheet('YOUR_SHEET_ID');
    await doc.useServiceAccountAuth(credentials);
    await doc.loadInfo();
    
    const sheet = doc.sheetsByTitle['SERVICES'];
    const rows = await sheet.getRows();
    
    const servicesPrices = rows.map(row => ({
      '구분': row['구분'],
      '실내촬영': row['실내촬영'],
      '야외촬영': row['야외촬영'],
      '요리촬영': row['요리촬영'],
      '드론촬영': row['드론촬영'],
      '일반편집': row['일반편집'],
      '풀편집': row['풀편집']
    }));
    
    res.json(servicesPrices);
  } catch (error) {
    console.error('Error loading services prices:', error);
    res.status(500).json({ error: 'Failed to load services prices' });
  }
});
