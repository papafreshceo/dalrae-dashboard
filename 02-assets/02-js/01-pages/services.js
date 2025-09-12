// services.js - 촬영 서비스 페이지 JavaScript

// 가격 설정 객체
const PRICE_CONFIG = {
  locations: {
    indoor: {
      basePrice: 30000,
      basePhoto: 50,
      baseVideo: 10,
      photoAddCost: 500,
      videoAddCost: 2000,
      handCost: 30000,
      modelCost: 200000,
      sceneAddCost: 30000
    },
    outdoor: {
      basePrice: 50000,
      basePhoto: 50,
      baseVideo: 5,
      photoAddCost: 500,
      videoAddCost: 2000,
      handCost: 30000,
      modelCost: 200000,
      sceneAddCost: 50000
    },
    cooking: {
      basePrice: 60000,
      basePhoto: 30,
      baseVideo: 3,
      photoAddCost: 500,
      videoAddCost: 2000,
      menuCost: 30000,
      handCost: 30000,
      modelCost: 200000,
      sceneAddCost: 60000
    },
    drone: {
      basePrice: 90000,
      basePhoto: 20,
      baseVideo: 5,
      photoAddCost: 500,
      videoAddCost: 2000,
      handCost: 0,
      modelCost: 0,
      sceneAddCost: 90000
    }
  },
  editing: {
    basic: {
      basePrice: 30000,
      perMinute: 30000
    },
    full: {
      basePrice: 70000,
      perMinute: 20000
    }
  },
  baseLocationCost: 30000,
  farmService: {
    visit: { price: 150000, features: [] },
    matching: { price: 100000, features: [] },
    full: { price: 200000, features: [] },
    accordion: []
  }
};

// API 상태 표시 함수
function showApiStatus(message, type) {
  const statusEl = document.getElementById('apiStatus');
  if (statusEl) {
    statusEl.textContent = message;
    statusEl.className = `api-status ${type}`;
    
    if (type === 'success' || type === 'error') {
      setTimeout(() => {
        statusEl.className = 'api-status';
      }, 3000);
    }
  }
}

// API에서 가격 데이터 로드
async function loadPricesFromSheet() {
  try {
    console.log('서비스 가격 데이터 로딩 중...');
    showApiStatus('가격 데이터 로딩 중...', 'loading');
    
    const response = await fetch('../api/services');
    
    if (response.ok) {
      const data = await response.json();
      
      if (data && data.length > 0) {
        console.log('Google Sheets 데이터 로드 성공:', data);
        showApiStatus('가격 데이터 로드 완료', 'success');
        parseServicePrices(data);
      } else {
        console.log('시트 응답이 비어있습니다. 기본 가격 사용');
        showApiStatus('시트 데이터 없음 - 기본 가격 사용', 'error');
      }
    } else {
      throw new Error(`API 응답 실패: ${response.status}`);
    }
  } catch (error) {
    console.error('API 로드 실패:', error);
    showApiStatus('API 연결 실패 - 기본 가격 사용', 'error');
    
    const savedPrices = localStorage.getItem('dalraeServicePrices');
    if (savedPrices) {
      const prices = JSON.parse(savedPrices);
      Object.assign(PRICE_CONFIG, prices);
      updateAllPrices();
      console.log('localStorage 백업 데이터 사용');
    }
  }
}

// API 데이터 파싱
function parseServicePrices(data) {
  console.log('파싱 시작:', data);
  
  if (Array.isArray(data)) {
    data.forEach(row => {
      const itemName = row['구분'] || row[0];
      
      switch(itemName) {
        case '기본요금':
          if (row['실내촬영']) PRICE_CONFIG.locations.indoor.basePrice = parseInt(String(row['실내촬영']).replace(/,/g, ''));
          if (row['야외촬영']) PRICE_CONFIG.locations.outdoor.basePrice = parseInt(String(row['야외촬영']).replace(/,/g, ''));
          if (row['요리촬영']) PRICE_CONFIG.locations.cooking.basePrice = parseInt(String(row['요리촬영']).replace(/,/g, ''));
          if (row['드론촬영']) PRICE_CONFIG.locations.drone.basePrice = parseInt(String(row['드론촬영']).replace(/,/g, ''));
          if (row['일반편집']) PRICE_CONFIG.editing.basic.basePrice = parseInt(String(row['일반편집']).replace(/,/g, ''));
          if (row['풀편집']) PRICE_CONFIG.editing.full.basePrice = parseInt(String(row['풀편집']).replace(/,/g, ''));
          if (row['방문견학동행']) PRICE_CONFIG.farmService.visit.price = parseInt(String(row['방문견학동행']).replace(/,/g, ''));
          if (row['농가매칭']) PRICE_CONFIG.farmService.matching.price = parseInt(String(row['농가매칭']).replace(/,/g, ''));
          if (row['풀서비스']) PRICE_CONFIG.farmService.full.price = parseInt(String(row['풀서비스']).replace(/,/g, ''));
          break;
          
        case '기본제공 사진(매)':
          if (row['실내촬영']) PRICE_CONFIG.locations.indoor.basePhoto = parseInt(row['실내촬영']);
          if (row['야외촬영']) PRICE_CONFIG.locations.outdoor.basePhoto = parseInt(row['야외촬영']);
          if (row['요리촬영']) PRICE_CONFIG.locations.cooking.basePhoto = parseInt(row['요리촬영']);
          if (row['드론촬영']) PRICE_CONFIG.locations.drone.basePhoto = parseInt(row['드론촬영']);
          break;
          
        case '기본제공 영상(분)':
          if (row['실내촬영']) PRICE_CONFIG.locations.indoor.baseVideo = parseInt(row['실내촬영']);
          if (row['야외촬영']) PRICE_CONFIG.locations.outdoor.baseVideo = parseInt(row['야외촬영']);
          if (row['요리촬영']) PRICE_CONFIG.locations.cooking.baseVideo = parseInt(row['요리촬영']);
          if (row['드론촬영']) PRICE_CONFIG.locations.drone.baseVideo = parseInt(row['드론촬영']);
          break;
          
        default:
          // 농가 매칭 features 데이터
          if (row['방문견학동행'] && row['방문견학동행'] !== '') {
            PRICE_CONFIG.farmService.visit.features.push(row['방문견학동행']);
          }
          if (row['농가매칭'] && row['농가매칭'] !== '') {
            PRICE_CONFIG.farmService.matching.features.push(row['농가매칭']);
          }
          if (row['풀서비스'] && row['풀서비스'] !== '') {
            PRICE_CONFIG.farmService.full.features.push(row['풀서비스']);
          }
          
          // 아코디언 데이터
          if (row['제목'] && row['설명내용']) {
            PRICE_CONFIG.farmService.accordion.push({
              title: row['제목'],
              content: row['설명내용']
            });
          }
          break;
      }
    });
    
    console.log('파싱 완료, 농가 서비스:', PRICE_CONFIG.farmService);
    updateAllPrices();
    localStorage.setItem('dalraeServicePrices', JSON.stringify(PRICE_CONFIG));
  }
}

// 모든 가격 표시 업데이트 (null 체크 추가)
function updateAllPrices() {
  // 기본 가격 업데이트
  const indoorPrice = document.getElementById('indoor-base-price');
  if (indoorPrice) indoorPrice.textContent = formatPrice(PRICE_CONFIG.locations.indoor.basePrice);
  
  const outdoorPrice = document.getElementById('outdoor-base-price');
  if (outdoorPrice) outdoorPrice.textContent = formatPrice(PRICE_CONFIG.locations.outdoor.basePrice);
  
  const cookingPrice = document.getElementById('cooking-base-price');
  if (cookingPrice) cookingPrice.textContent = formatPrice(PRICE_CONFIG.locations.cooking.basePrice);
  
  const dronePrice = document.getElementById('drone-base-price');
  if (dronePrice) dronePrice.textContent = formatPrice(PRICE_CONFIG.locations.drone.basePrice);
  
  // 기본 제공 정보 업데이트
  const indoorInfo = document.getElementById('indoor-default-info');
  if (indoorInfo) {
    indoorInfo.textContent = `기본 제공: 사진 ${PRICE_CONFIG.locations.indoor.basePhoto}매, 영상길이 ${PRICE_CONFIG.locations.indoor.baseVideo}분 이상 (총 재생시간)`;
  }
  
  const outdoorInfo = document.getElementById('outdoor-default-info');
  if (outdoorInfo) {
    outdoorInfo.textContent = `기본 제공: 사진 ${PRICE_CONFIG.locations.outdoor.basePhoto}매, 영상길이 ${PRICE_CONFIG.locations.outdoor.baseVideo}분 이상 (총 재생시간)`;
  }
  
  const cookingInfo = document.getElementById('cooking-default-info');
  if (cookingInfo) {
    cookingInfo.textContent = `기본 제공: 1개 메뉴 (사진 ${PRICE_CONFIG.locations.cooking.basePhoto}매), 영상길이 ${PRICE_CONFIG.locations.cooking.baseVideo}분 이상 (총 재생시간)`;
  }
  
  const droneInfo = document.getElementById('drone-default-info');
  if (droneInfo) {
    droneInfo.textContent = `기본 제공: 사진 ${PRICE_CONFIG.locations.drone.basePhoto}매, 영상길이 ${PRICE_CONFIG.locations.drone.baseVideo}분 이상 (총 재생시간)`;
  }
  
  // 농가 서비스 업데이트
  updateFarmService();
  
  // 견적 재계산 - 요소가 있을 때만
  if (document.getElementById('statsGrid')) {
    calculateQuote();
  }
}

// 서비스 전환
window.switchService = function(service) {
  const photoBtn = document.getElementById('photo-service-btn');
  const farmBtn = document.getElementById('farm-service-btn');
  const photoSection = document.getElementById('photo-service');
  const farmSection = document.getElementById('farm-service');
  
  if (photoBtn && farmBtn && photoSection && farmSection) {
    if (service === 'photo') {
      photoBtn.classList.add('active');
      farmBtn.classList.remove('active');
      photoSection.classList.add('active');
      farmSection.classList.remove('active');
    } else {
      farmBtn.classList.add('active');
      photoBtn.classList.remove('active');
      farmSection.classList.add('active');
      photoSection.classList.remove('active');
    }
  }
}

// 로케이션 토글
window.toggleLocation = function(type) {
  const card = document.getElementById(`${type}-card`);
  const checkbox = document.getElementById(`${type}-check`);
  
  if (card && checkbox) {
    card.classList.toggle('active');
    checkbox.checked = card.classList.contains('active');
    calculateQuote();
  }
}

// 수량 조절
window.adjustQuantity = function(id, delta) {
  const input = document.getElementById(id);
  if (input) {
    const newValue = Math.max(0, parseInt(input.value || 0) + delta);
    input.value = newValue;
    calculateQuote();
  }
}

// 편집 수량 조절
window.adjustEditQuantity = function(type, delta) {
  const input = document.getElementById(`edit-${type}`);
  if (input) {
    const newValue = Math.max(0, parseInt(input.value || 0) + delta);
    input.value = newValue;
    calculateQuote();
  }
}

// 직접 입력 처리
window.handleDirectInput = function(id) {
  const input = document.getElementById(id);
  if (input) {
    const value = parseInt(input.value) || 0;
    input.value = Math.max(0, value);
    calculateQuote();
  }
}

// 가격 포맷
function formatPrice(price) {
  return price.toLocaleString() + '원';
}

// 견적 계산 (null 체크 추가)
window.calculateQuote = function() {
  let totalCost = 0;
  let locationCost = 0;
  let transitionCost = 0;
  let photoCost = 0;
  let videoCost = 0;
  let handCost = 0;
  let modelCost = 0;
  let menuCost = 0;
  let editCost = 0;
  
  let totalPhotos = 0;
  let totalVideos = 0;
  let totalEditVideos = 0;
  
  const activeLocations = [];
  const statsGrid = document.getElementById('statsGrid');
  
  if (statsGrid) {
    statsGrid.innerHTML = '';
    
    // 각 로케이션 체크
    ['indoor', 'outdoor', 'cooking', 'drone'].forEach(type => {
      const checkbox = document.getElementById(`${type}-check`);
      if (checkbox && checkbox.checked) {
        activeLocations.push(type);
        const config = PRICE_CONFIG.locations[type];
        
        locationCost += config.basePrice;
        
        let locationPhotos = config.basePhoto;
        let locationVideos = config.baseVideo;
        
        const photoInput = document.getElementById(`${type}-photo`);
        const videoInput = document.getElementById(`${type}-video`);
        
        const addPhotos = photoInput ? (parseInt(photoInput.value) || 0) : 0;
        const addVideos = videoInput ? (parseInt(videoInput.value) || 0) : 0;
        
        photoCost += addPhotos * config.photoAddCost;
        videoCost += addVideos * config.videoAddCost;
        
        locationPhotos += addPhotos;
        locationVideos += addVideos;
        
        if (type === 'cooking') {
          const menuInput = document.getElementById('cooking-menu');
          const addMenus = menuInput ? (parseInt(menuInput.value) || 0) : 0;
          menuCost += addMenus * config.menuCost;
          locationPhotos += addMenus * 30;
        }
        
        const handCheck = document.getElementById(`${type}-hand`);
        if (handCheck?.checked) {
          handCost += config.handCost;
        }
        
        const modelCheck = document.getElementById(`${type}-model`);
        if (modelCheck?.checked) {
          modelCost += config.modelCost;
        }
        
        totalPhotos += locationPhotos;
        totalVideos += locationVideos;
        
        const statItem = document.createElement('div');
        statItem.className = 'stat-item';
        statItem.innerHTML = `
          <div class="stat-location">${getLocationName(type)}</div>
          <div class="stat-details">
            <span>사진</span>
            <span class="stat-value">${locationPhotos}매</span>
          </div>
          <div class="stat-details">
            <span>영상</span>
            <span class="stat-value">${locationVideos}분</span>
          </div>
        `;
        statsGrid.appendChild(statItem);
      }
    });
  }
  
  if (activeLocations.length > 1) {
    transitionCost = (activeLocations.length - 1) * PRICE_CONFIG.baseLocationCost;
  }
  
  // 편집 비용 계산
  ['basic', 'full'].forEach(editType => {
    ['1min', '2min', '3min'].forEach(duration => {
      const editInput = document.getElementById(`edit-${editType}-${duration}`);
      const count = editInput ? (parseInt(editInput.value) || 0) : 0;
      
      if (count > 0) {
        totalEditVideos += count;
        const minutes = parseInt(duration.replace('min', ''));
        
        if (editType === 'basic') {
          editCost += count * minutes * PRICE_CONFIG.editing.basic.perMinute;
        } else {
          if (minutes === 1) {
            editCost += count * PRICE_CONFIG.editing.full.basePrice;
          } else {
            editCost += count * (PRICE_CONFIG.editing.full.basePrice + (minutes - 1) * PRICE_CONFIG.editing.full.perMinute);
          }
        }
      }
    });
  });
  
  // 통계 업데이트
  const totalPhotosEl = document.getElementById('totalPhotos');
  if (totalPhotosEl) totalPhotosEl.textContent = totalPhotos + '매';
  
  const totalVideosEl = document.getElementById('totalVideos');
  if (totalVideosEl) totalVideosEl.textContent = totalVideos + '분';
  
  const totalEditVideosEl = document.getElementById('totalEditVideos');
  if (totalEditVideosEl) totalEditVideosEl.textContent = totalEditVideos + '개';
  
  // 견적 항목 업데이트
  const updateElement = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = formatPrice(value);
  };
  
  updateElement('locationCost', locationCost);
  updateElement('transitionCost', transitionCost);
  updateElement('menuCost', menuCost);
  updateElement('photoCost', photoCost);
  updateElement('videoCost', videoCost);
  updateElement('handCost', handCost);
  updateElement('modelCost', modelCost);
  updateElement('editCost', editCost);
  
  // 총 비용
  totalCost = locationCost + transitionCost + menuCost + photoCost + videoCost + handCost + modelCost + editCost;
  updateElement('totalAmount', totalCost);
}

// 로케이션 이름 가져오기
function getLocationName(type) {
  const names = {
    indoor: '일반 실내 촬영',
    outdoor: '야외 촬영',
    cooking: '요리 촬영',
    drone: '드론 촬영'
  };
  return names[type] || type;
}

// 아코디언 토글
function toggleAccordion(index) {
  const cards = document.querySelectorAll('.accordion-card');
  if (cards[index]) {
    cards[index].classList.toggle('active');
  }
}

// 농가 서비스 업데이트
function updateFarmService() {
  // 아코디언 생성
  const accordionContainer = document.getElementById('serviceAccordion');
  if (accordionContainer && PRICE_CONFIG.farmService.accordion.length > 0) {
    accordionContainer.innerHTML = PRICE_CONFIG.farmService.accordion.map((item, index) => `
      <div class="accordion-card">
        <div class="accordion-header">
          <span>${item.title || '제목 없음'}</span>
          <span class="accordion-icon">▼</span>
        </div>
        <div class="accordion-body">${item.content || '내용 없음'}</div>
      </div>
    `).join('');
    
    // 아코디언 이벤트 리스너
    document.querySelectorAll('.accordion-header').forEach((header, index) => {
      header.addEventListener('click', () => toggleAccordion(index));
    });
  }

  // 가격 업데이트
  if (PRICE_CONFIG.farmService.visit.price) {
    const visitPrice = document.getElementById('visit-price');
    if (visitPrice) visitPrice.textContent = formatPrice(PRICE_CONFIG.farmService.visit.price);
  }
  if (PRICE_CONFIG.farmService.matching.price) {
    const matchingPrice = document.getElementById('matching-price');
    if (matchingPrice) matchingPrice.textContent = formatPrice(PRICE_CONFIG.farmService.matching.price);
  }
  if (PRICE_CONFIG.farmService.full.price) {
    const fullPrice = document.getElementById('full-price');
    if (fullPrice) fullPrice.textContent = formatPrice(PRICE_CONFIG.farmService.full.price);
  }

  // features 업데이트
  ['visit', 'matching', 'full'].forEach(plan => {
    const featuresEl = document.getElementById(`${plan}-features`);
    if (featuresEl && PRICE_CONFIG.farmService[plan].features.length > 0) {
      featuresEl.innerHTML = PRICE_CONFIG.farmService[plan].features
        .filter(f => f)
        .map(feature => `<li>${feature}</li>`)
        .join('');
    }
  });
}

// 이벤트 리스너 설정
function setupEventListeners() {
  // 서비스 전환 버튼
  const photoBtn = document.getElementById('photo-service-btn');
  const farmBtn = document.getElementById('farm-service-btn');
  
  if (photoBtn) {
    photoBtn.addEventListener('click', () => window.switchService('photo'));
  }
  if (farmBtn) {
    farmBtn.addEventListener('click', () => window.switchService('farm'));
  }
  
  // 로케이션 헤더 클릭
  document.querySelectorAll('.location-header').forEach(header => {
    header.addEventListener('click', function(e) {
      if (!e.target.classList.contains('location-checkbox')) {
        const card = this.closest('.location-card');
        if (card) {
          const type = card.id.replace('-card', '');
          window.toggleLocation(type);
        }
      }
    });
  });
  
  // 체크박스 이벤트
  document.querySelectorAll('.location-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', function(e) {
      e.stopPropagation();
      const type = this.id.replace('-check', '');
      const card = document.getElementById(`${type}-card`);
      if (card) {
        if (this.checked) {
          card.classList.add('active');
        } else {
          card.classList.remove('active');
          // 옵션 초기화
          const photoInput = document.getElementById(`${type}-photo`);
          if (photoInput) photoInput.value = 0;
          
          const videoInput = document.getElementById(`${type}-video`);
          if (videoInput) videoInput.value = 0;
          
          if (type === 'cooking') {
            const menuInput = document.getElementById('cooking-menu');
            if (menuInput) menuInput.value = 0;
          }
          
          const handCheck = document.getElementById(`${type}-hand`);
          if (handCheck) handCheck.checked = false;
          
          const modelCheck = document.getElementById(`${type}-model`);
          if (modelCheck) modelCheck.checked = false;
        }
        window.calculateQuote();
      }
    });
  });
  
  // 수량 조절 버튼
  document.querySelectorAll('.stepper-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const type = this.dataset.type;
      const delta = parseInt(this.dataset.delta);
      window.adjustQuantity(type, delta);
    });
  });
  
  // 편집 수량 조절 버튼
  document.querySelectorAll('.edit-stepper-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const type = this.dataset.type;
      const delta = parseInt(this.dataset.delta);
      window.adjustEditQuantity(type, delta);
    });
  });
  
  // 수량 입력 필드
  document.querySelectorAll('input[type="number"]').forEach(input => {
    input.addEventListener('change', function() {
      window.handleDirectInput(this.id);
    });
  });
  
  // 옵션 체크박스
  document.querySelectorAll('.option-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', window.calculateQuote);
  });
}

// 페이지 로드 시 실행
window.addEventListener('DOMContentLoaded', function() {
  console.log('DOM 로드 완료');
  
  // API에서 가격 데이터 로드
  loadPricesFromSheet();
  
  // 이벤트 리스너 설정
  setupEventListeners();
  
  // 초기 견적 계산
  if (document.getElementById('statsGrid')) {
    window.calculateQuote();
  }
});
