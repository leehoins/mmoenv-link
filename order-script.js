// 업그레이드된 주문 폼 JavaScript 로직
document.addEventListener('DOMContentLoaded', function() {
    // DOM 요소들
    const noticeModal = document.getElementById('noticeModal');
    const orderPage = document.getElementById('orderPage');
    const agreeNotice = document.getElementById('agreeNotice');
    const startOrderBtn = document.getElementById('startOrder');
    const closeNoticeBtn = document.getElementById('closeNotice');
    const form = document.getElementById('orderForm');
    
    const deliveryRadios = document.querySelectorAll('input[name="deliveryMethod"]');
    const pickupDetails = document.getElementById('pickupDetails');
    const deliveryDetails = document.getElementById('deliveryDetails');
    const directDetails = document.getElementById('directDetails');
    
    const orderType = document.getElementById('orderType');
    const letteringOptions = document.getElementById('letteringOptions');
    const orderSummary = document.getElementById('orderSummary');
    const desiredDateInput = document.getElementById('desiredDate');
    const usageDateInput = document.getElementById('usageDate');
    
    // 초기 설정
    initializeForm();
    
    // Supabase 초기화
    initializeSupabase();
    
    // Supabase 초기화 함수
    async function initializeSupabase() {
        try {
            const success = await initOrderManager();
            if (success) {
                console.log('🎈 Supabase 연동 완료');
            } else {
                console.log('📝 카카오톡 주문 모드로 동작');
            }
        } catch (error) {
            console.error('Supabase 초기화 오류:', error);
        }
    }
    
    function initializeForm() {
        setMinDates();
        setupNoticeModal();
        setupEventListeners();
        toggleDeliveryDetails();
        toggleLetteringOptions();
    }
    
    // 안내사항 모달 설정
    function setupNoticeModal() {
        // 체크박스 상태에 따라 버튼 활성화
        agreeNotice.addEventListener('change', function() {
            startOrderBtn.disabled = !this.checked;
        });
        
        // 주문 시작 버튼
        startOrderBtn.addEventListener('click', function() {
            noticeModal.style.display = 'none';
            orderPage.style.display = 'block';
        });
        
        // 모달 닫기 (X 버튼)
        closeNoticeBtn.addEventListener('click', function() {
            if (confirm('주문을 취소하고 메인 페이지로 돌아가시겠습니까?')) {
                window.location.href = 'index.html';
            }
        });
        
        // 모달 배경 클릭시 닫기
        noticeModal.addEventListener('click', function(e) {
            if (e.target === noticeModal) {
                if (confirm('주문을 취소하고 메인 페이지로 돌아가시겠습니까?')) {
                    window.location.href = 'index.html';
                }
            }
        });
    }
    
    // 최소 날짜 설정
    function setMinDates() {
        const today = new Date();
        const minDate = new Date(today.getTime() + (7 * 24 * 60 * 60 * 1000)); // 일주일 후
        const maxDate = new Date(today.getTime() + (90 * 24 * 60 * 60 * 1000)); // 90일 후
        
        const minDateStr = minDate.toISOString().split('T')[0];
        const maxDateStr = maxDate.toISOString().split('T')[0];
        
        if (desiredDateInput) {
            desiredDateInput.min = minDateStr;
            desiredDateInput.max = maxDateStr;
        }
        
        if (usageDateInput) {
            usageDateInput.min = minDateStr;
            usageDateInput.max = maxDateStr;
        }
    }

    // 모엔브 상품 데이터
    const MMOENV_PRODUCTS = {
        helium: [
            { value: 'bubble-lettering-24', text: '24인치 버블인버블 레터링 (37,000원)', hasLettering: true, hasQuantity: false },
            { value: 'macaron-lettering-24', text: '24인치 마카롱 레터링 (35,000원)', hasLettering: true, hasQuantity: false },
            { value: 'mini-shape-24', text: '24인치 미니쉐입 (37,000원)', hasLettering: false, hasQuantity: false },
            { value: 'bouquet-round', text: '다발풍선(라운드)', hasLettering: false, hasQuantity: true, unitPrice: 4000, priceText: '4,000원/개' },
            { value: 'heart-in-heart-20', text: '20인치 하트인하트 (33,000원)', hasLettering: false, hasQuantity: false },
            { value: 'number-foil-large-helium', text: '숫자은박(대형) - 헬륨 (31,000원)', hasLettering: false, hasQuantity: false },
            { value: 'clear-balloon', text: '클리어 풍선', hasLettering: false, hasQuantity: true, unitPrice: 8000, priceText: '8,000원/개' }
        ],
        air: [
            { value: 'flower-balloon-daisy', text: '꽃풍선 - 데이지 (상담 후 결정)', hasLettering: false, hasQuantity: false },
            { value: 'flower-balloon-tulip', text: '꽃풍선 - 튤립 (상담 후 결정)', hasLettering: false, hasQuantity: false },
            { value: 'balloon-cake-basic', text: '풍선케이크 - 기본 (상담 후 결정)', hasLettering: false, hasQuantity: false },
            { value: 'balloon-cake-mini', text: '풍선케이크 - 미니 (상담 후 결정)', hasLettering: false, hasQuantity: false },
            { value: 'number-foil-large-air', text: '숫자은박(대형) - 공기 (9,000원)', hasLettering: false, hasQuantity: false }
        ],
        consultation: [
            { value: 'custom-design', text: '맞춤 디자인 상담', hasLettering: true, hasQuantity: false },
            { value: 'special-occasion', text: '특별한 행사 상담', hasLettering: true, hasQuantity: false },
            { value: 'bulk-order', text: '대량 주문 상담', hasLettering: false, hasQuantity: false }
        ]
    };

    // 상품 옵션 업데이트
    function updateProductOptions() {
        const orderTypeValue = orderType.value;
        const balloonTypeSelect = document.getElementById('balloonType');
        
        // 기존 옵션 지우기
        balloonTypeSelect.innerHTML = '<option value="">상품을 선택해주세요</option>';
        
        if (orderTypeValue && MMOENV_PRODUCTS[orderTypeValue]) {
            const products = MMOENV_PRODUCTS[orderTypeValue];
            products.forEach(product => {
                const option = document.createElement('option');
                option.value = product.value;
                // 개수 상품이면 가격 텍스트만 표시, 아니면 전체 텍스트 표시
                option.textContent = product.hasQuantity ? 
                    `${product.text} (${product.priceText})` : 
                    product.text;
                option.dataset.hasLettering = product.hasLettering;
                option.dataset.hasQuantity = product.hasQuantity;
                if (product.unitPrice) {
                    option.dataset.unitPrice = product.unitPrice;
                }
                balloonTypeSelect.appendChild(option);
            });
            
            // balloonType 선택 시 옵션 체크
            balloonTypeSelect.removeEventListener('change', handleProductSelection);
            balloonTypeSelect.addEventListener('change', handleProductSelection);
        }
        
        updateOrderSummary();
    }
    
    // 상품 선택 처리
    function handleProductSelection() {
        toggleLetteringOptions();
        toggleQuantityOptions();
        updateOrderSummary();
    }
    
    // 개수 옵션 표시/숨김
    function toggleQuantityOptions() {
        const quantityOptions = document.getElementById('quantityOptions');
        if (!quantityOptions) return;
        
        const balloonTypeSelect = document.getElementById('balloonType');
        const selectedOption = balloonTypeSelect.options[balloonTypeSelect.selectedIndex];
        const balloonQuantitySelect = document.getElementById('balloonQuantity');
        
        // 개수 선택이 필요한 상품인지 확인
        const hasQuantity = selectedOption && selectedOption.dataset.hasQuantity === 'true';
        
        if (hasQuantity) {
            quantityOptions.style.display = 'block';
            if (balloonQuantitySelect) {
                balloonQuantitySelect.setAttribute('required', '');
            }
        } else {
            quantityOptions.style.display = 'none';
            if (balloonQuantitySelect) {
                balloonQuantitySelect.removeAttribute('required');
                balloonQuantitySelect.value = '';
            }
            // 가격 표시 숨기기
            const priceDisplay = document.getElementById('priceDisplay');
            if (priceDisplay) {
                priceDisplay.style.display = 'none';
            }
        }
    }
    
    // 직접입력 개수 토글
    function toggleCustomQuantity() {
        const balloonQuantitySelect = document.getElementById('balloonQuantity');
        const customQuantity = document.getElementById('customQuantity');
        const customQuantityInput = document.getElementById('customQuantityInput');
        
        if (balloonQuantitySelect.value === 'custom') {
            customQuantity.style.display = 'block';
            if (customQuantityInput) {
                customQuantityInput.setAttribute('required', '');
            }
        } else {
            customQuantity.style.display = 'none';
            if (customQuantityInput) {
                customQuantityInput.removeAttribute('required');
                customQuantityInput.value = '';
            }
        }
    }
    
    // 가격 계산
    function calculatePrice() {
        const balloonTypeSelect = document.getElementById('balloonType');
        const balloonQuantitySelect = document.getElementById('balloonQuantity');
        const customQuantityInput = document.getElementById('customQuantityInput');
        const priceDisplay = document.getElementById('priceDisplay');
        const calculatedPrice = document.querySelector('.calculated-price');
        
        if (!balloonTypeSelect || !balloonQuantitySelect || !priceDisplay || !calculatedPrice) return;
        
        const selectedOption = balloonTypeSelect.options[balloonTypeSelect.selectedIndex];
        const hasQuantity = selectedOption && selectedOption.dataset.hasQuantity === 'true';
        const unitPrice = selectedOption && selectedOption.dataset.unitPrice ? 
            parseInt(selectedOption.dataset.unitPrice) : 0;
        
        if (hasQuantity && unitPrice > 0) {
            let quantity = 0;
            
            if (balloonQuantitySelect.value === 'custom') {
                quantity = parseInt(customQuantityInput.value) || 0;
            } else if (balloonQuantitySelect.value) {
                quantity = parseInt(balloonQuantitySelect.value) || 0;
            }
            
            if (quantity > 0) {
                const totalPrice = unitPrice * quantity;
                const formattedPrice = totalPrice.toLocaleString('ko-KR');
                
                // 할인 적용 (10개 이상일 때 5% 할인)
                if (quantity >= 10) {
                    const discountPrice = Math.round(totalPrice * 0.95);
                    const formattedDiscountPrice = discountPrice.toLocaleString('ko-KR');
                    calculatedPrice.innerHTML = `
                        <span style="text-decoration: line-through; color: #999;">${formattedPrice}원</span>
                        <br><strong>${formattedDiscountPrice}원</strong> (5% 할인 적용)
                    `;
                } else {
                    calculatedPrice.textContent = `${formattedPrice}원`;
                }
                
                priceDisplay.style.display = 'block';
            } else {
                priceDisplay.style.display = 'none';
            }
        } else {
            priceDisplay.style.display = 'none';
        }
    }
    
    // 이벤트 리스너 설정
    function setupEventListeners() {
        // 수령 방법 변경
        deliveryRadios.forEach(radio => {
            radio.addEventListener('change', toggleDeliveryDetails);
        });
        
        // 주문 유형 변경
        if (orderType) {
            orderType.addEventListener('change', function() {
                updateProductOptions();
                toggleLetteringOptions();
            });
        }
        
        // 개수 선택 관련 이벤트 리스너
        const balloonQuantitySelect = document.getElementById('balloonQuantity');
        const customQuantityInput = document.getElementById('customQuantityInput');
        
        if (balloonQuantitySelect) {
            balloonQuantitySelect.addEventListener('change', function() {
                toggleCustomQuantity();
                calculatePrice();
                updateOrderSummary();
            });
        }
        
        if (customQuantityInput) {
            customQuantityInput.addEventListener('input', function() {
                calculatePrice();
                updateOrderSummary();
            });
        }
        
        // 폼 제출
        form.addEventListener('submit', handleSubmit);
        
        // 실시간 주문 요약 업데이트
        const formInputs = form.querySelectorAll('input, select, textarea');
        formInputs.forEach(input => {
            input.addEventListener('change', updateOrderSummary);
            input.addEventListener('input', updateOrderSummary);
        });
        
        // 사용날짜 변경시 출고일 자동 조정
        if (usageDateInput) {
            usageDateInput.addEventListener('change', function() {
                if (this.value && desiredDateInput) {
                    const usageDate = new Date(this.value);
                    const suggestedDate = new Date(usageDate.getTime() - (1 * 24 * 60 * 60 * 1000)); // 1일 전
                    const minDate = new Date();
                    minDate.setDate(minDate.getDate() + 7); // 최소 일주일 후
                    
                    if (suggestedDate >= minDate) {
                        desiredDateInput.value = suggestedDate.toISOString().split('T')[0];
                    }
                }
                updateOrderSummary();
            });
        }
    }
    
    // 수령 방법에 따른 상세 정보 표시/숨김
    function toggleDeliveryDetails() {
        const selectedMethod = document.querySelector('input[name="deliveryMethod"]:checked');
        
        // 모든 상세 정보 숨기기
        pickupDetails.style.display = 'none';
        deliveryDetails.style.display = 'none';
        directDetails.style.display = 'none';
        
        // 필수 필드 초기화
        const pickupLocation = document.getElementById('pickupLocation');
        const deliveryAddress = document.getElementById('deliveryAddress');
        const directAddress = document.getElementById('directAddress');
        
        pickupLocation.removeAttribute('required');
        deliveryAddress.removeAttribute('required');
        directAddress.removeAttribute('required');
        
        if (selectedMethod) {
            switch (selectedMethod.value) {
                case 'pickup':
                    pickupDetails.style.display = 'block';
                    pickupLocation.setAttribute('required', '');
                    break;
                case 'delivery':
                    deliveryDetails.style.display = 'block';
                    deliveryAddress.setAttribute('required', '');
                    break;
                case 'direct':
                    directDetails.style.display = 'block';
                    directAddress.setAttribute('required', '');
                    break;
            }
        }
        
        updateOrderSummary();
    }
    
    // 레터링 옵션 표시/숨김
    function toggleLetteringOptions() {
        if (!orderType || !letteringOptions) return;
        
        const balloonTypeSelect = document.getElementById('balloonType');
        const selectedOption = balloonTypeSelect.options[balloonTypeSelect.selectedIndex];
        const letteringText = document.getElementById('letteringText');
        
        // 레터링 가능한 상품인지 확인
        const hasLettering = selectedOption && selectedOption.dataset.hasLettering === 'true';
        
        if (hasLettering) {
            letteringOptions.style.display = 'block';
            if (letteringText) {
                letteringText.setAttribute('required', '');
            }
        } else {
            letteringOptions.style.display = 'none';
            if (letteringText) {
                letteringText.removeAttribute('required');
                letteringText.value = ''; // 값 리셋
            }
            // 폰트와 색상 선택도 리셋
            const fontType = document.getElementById('fontType');
            const fontColors = document.querySelectorAll('input[name="fontColor"]');
            if (fontType) fontType.value = '';
            fontColors.forEach(radio => radio.checked = false);
        }
        
        updateOrderSummary();
    }
    
    // 실시간 주문 요약 업데이트
    function updateOrderSummary() {
        if (!orderSummary) return;
        
        const formData = collectFormData();
        const summaryContent = orderSummary.querySelector('.summary-content');
        
        let summary = '<div class="summary-items">';
        
        // 기본 정보
        if (formData.customerName) {
            summary += `<p><strong>주문자:</strong> ${formData.customerName}</p>`;
        }
        
        if (formData.orderType) {
            summary += `<p><strong>주문 유형:</strong> ${getOrderTypeText(formData.orderType)}</p>`;
        }
        
        if (formData.balloonType) {
            let balloonText = getBalloonTypeText(formData.balloonType);
            
            // 개수 정보 추가
            const quantity = getSelectedQuantity();
            if (quantity > 0) {
                balloonText += ` × ${quantity}개`;
                
                // 계산된 가격 표시
                const calculatedPrice = document.querySelector('.calculated-price');
                if (calculatedPrice && calculatedPrice.style.display !== 'none') {
                    const priceText = calculatedPrice.textContent || calculatedPrice.innerText;
                    if (priceText) {
                        balloonText += ` = ${priceText}`;
                    }
                }
            }
            
            summary += `<p><strong>상품 정보:</strong> ${balloonText}</p>`;
        }
        
        // 레터링 정보
        if (formData.letteringText) {
            summary += `<p><strong>레터링:</strong> "${formData.letteringText}"</p>`;
            if (formData.fontType) {
                summary += `<p><strong>폰트:</strong> ${getFontTypeText(formData.fontType)}</p>`;
            }
            if (formData.fontColor) {
                summary += `<p><strong>색상:</strong> ${getFontColorText(formData.fontColor)}</p>`;
            }
        }
        
        // 추가 옵션
        const extraOptions = Array.from(document.querySelectorAll('input[name="extraOptions"]:checked'))
            .map(option => getExtraOptionText(option.value));
        if (extraOptions.length > 0) {
            summary += `<p><strong>추가 옵션:</strong> ${extraOptions.join(', ')}</p>`;
        }
        
        // 수령 방법
        if (formData.deliveryMethod) {
            let deliveryText = getDeliveryMethodText(formData.deliveryMethod);
            if (formData.deliveryMethod === 'pickup' && formData.pickupLocation) {
                deliveryText += ` - ${getLocationText(formData.pickupLocation)}`;
            }
            summary += `<p><strong>수령 방법:</strong> ${deliveryText}</p>`;
        }
        
        // 일정
        if (formData.usageDate) {
            summary += `<p><strong>사용/수령일:</strong> ${formatDate(formData.usageDate)}</p>`;
        }
        if (formData.desiredDate) {
            summary += `<p><strong>희망 출고일:</strong> ${formatDate(formData.desiredDate)}</p>`;
        }
        
        // 시간 선택 정보
        const timeInfo = formatDetailedTimePreference(formData);
        if (timeInfo) {
            summary += `<p><strong>픽업 시간:</strong> ${timeInfo}</p>`;
        }
        
        // 예산
        if (formData.budget) {
            summary += `<p><strong>예산 범위:</strong> ${getBudgetText(formData.budget)}</p>`;
        }
        
        summary += '</div>';
        
        if (summary === '<div class="summary-items"></div>') {
            summary = '<p>선택사항을 입력하시면 여기에 주문 요약이 표시됩니다.</p>';
        }
        
        summaryContent.innerHTML = summary;
    }
    
    // 폼 데이터 수집
    function collectFormData() {
        const formData = new FormData(form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            if (data[key]) {
                // 동일한 name의 여러 값이 있는 경우 (체크박스 등)
                if (Array.isArray(data[key])) {
                    data[key].push(value);
                } else {
                    data[key] = [data[key], value];
                }
            } else {
                data[key] = value;
            }
        }
        
        // 체크박스 그룹 처리
        const extraOptions = Array.from(document.querySelectorAll('input[name="extraOptions"]:checked'))
            .map(option => option.value);
        if (extraOptions.length > 0) {
            data.extraOptions = extraOptions;
        }
        
        return data;
    }
    
    // 선택된 개수 가져오기
    function getSelectedQuantity() {
        const balloonQuantitySelect = document.getElementById('balloonQuantity');
        const customQuantityInput = document.getElementById('customQuantityInput');
        
        if (!balloonQuantitySelect) return 0;
        
        if (balloonQuantitySelect.value === 'custom') {
            return parseInt(customQuantityInput.value) || 0;
        } else if (balloonQuantitySelect.value) {
            return parseInt(balloonQuantitySelect.value) || 0;
        }
        
        return 0;
    }
    
    // 카카오톡 메시지 포맷팅
    function formatKakaoMessage(data, orderNumber = null) {
        let message = `🎈 모엔브 새 주문 문의\\n\\n`;
        
        if (orderNumber) {
            message += `📋 주문번호: ${orderNumber}\\n\\n`;
        }
        
        message += `👤 고객 정보\\n`;
        message += `이름: ${data.customerName}\\n`;
        message += `연락처: ${data.customerPhone}\\n`;
        if (data.customerEmail) {
            message += `이메일: ${data.customerEmail}\\n`;
        }
        
        message += `\\n📋 주문 정보\\n`;
        message += `주문 유형: ${getOrderTypeText(data.orderType)}\\n`;
        
        if (data.balloonType) {
            let balloonText = getBalloonTypeText(data.balloonType);
            
            // 개수 정보 추가
            const quantity = getSelectedQuantity();
            if (quantity > 0) {
                balloonText += ` × ${quantity}개`;
                
                // 계산된 가격 표시
                const calculatedPrice = document.querySelector('.calculated-price');
                if (calculatedPrice && calculatedPrice.style.display !== 'none') {
                    const priceText = calculatedPrice.textContent || calculatedPrice.innerText;
                    if (priceText.trim()) {
                        balloonText += ` = ${priceText.replace(/\n/g, ' ').trim()}`;
                    }
                }
            }
            
            message += `풍선 종류: ${balloonText}\\n`;
        }
        
        // 레터링 정보
        if (data.letteringText) {
            message += `\\n✏️ 레터링 정보\\n`;
            message += `문구: "${data.letteringText}"\\n`;
            if (data.fontType) {
                message += `폰트: ${getFontTypeText(data.fontType)}\\n`;
            }
            if (data.fontColor) {
                message += `색상: ${getFontColorText(data.fontColor)}\\n`;
            }
        }
        
        // 추가 옵션
        if (data.extraOptions && data.extraOptions.length > 0) {
            message += `\\n🎁 추가 옵션\\n`;
            data.extraOptions.forEach(option => {
                message += `- ${getExtraOptionText(option)}\\n`;
            });
        }
        
        message += `\\n📝 상세 요청사항\\n${data.orderDetails}\\n`;
        
        if (data.budget) {
            message += `\\n💰 예산: ${getBudgetText(data.budget)}\\n`;
        }
        
        message += `\\n🚚 수령 방법\\n`;
        if (data.deliveryMethod === 'pickup') {
            message += `픽업 (${data.pickupLocation ? getLocationText(data.pickupLocation) : '장소 미선택'})\\n`;
            if (data.pickupTime) {
                message += `픽업 희망시간: ${getPickupTimeText(data.pickupTime)}\\n`;
            }
        } else if (data.deliveryMethod === 'delivery') {
            message += `택배 배송\\n`;
            message += `주소: ${data.deliveryAddress}\\n`;
            if (data.deliveryPhone) {
                message += `받을 분 연락처: ${data.deliveryPhone}\\n`;
            }
        } else if (data.deliveryMethod === 'direct') {
            message += `직접배송\\n`;
            message += `주소: ${data.directAddress}\\n`;
        }
        
        message += `\\n📅 일정\\n`;
        if (data.usageDate) {
            message += `사용/수령일: ${formatDate(data.usageDate)}\\n`;
        }
        message += `희망 출고일: ${formatDate(data.desiredDate)}\\n`;
        
        // 새로운 시간 선택기 처리
        const timeInfo = formatDetailedTimePreference(data);
        if (timeInfo) {
            message += `픽업 시간: ${timeInfo}\\n`;
        }
        
        if (data.additionalNotes) {
            message += `\\n📝 추가 요청사항\\n${data.additionalNotes}\\n`;
        }
        
        message += `\\n✅ 확인사항\\n`;
        message += `- 주문 안내사항 확인 및 동의\\n`;
        message += `- 취소/환불 정책 동의\\n`;
        message += `- 상담 연락 동의\\n`;
        
        return message;
    }
    
    // 텍스트 변환 함수들
    function getOrderTypeText(value) {
        const types = {
            'helium': '헬륨 풍선',
            'air': '공기 풍선',
            'consultation': '상담 후 결정'
        };
        return types[value] || value;
    }
    
    function getBalloonTypeText(value) {
        // 모든 상품에서 찾기
        for (const category in MMOENV_PRODUCTS) {
            const product = MMOENV_PRODUCTS[category].find(p => p.value === value);
            if (product) {
                return product.text;
            }
        }
        return value;
    }
    
    function getFontTypeText(value) {
        const types = {
            '': '기본 폰트',
            'elegant': '고급형 폰트',
            'cute': '귀여운 폰트',
            'bold': '굵은 폰트',
            'script': '필기체 폰트'
        };
        return types[value] || value;
    }
    
    function getFontColorText(value) {
        const colors = {
            'black': '블랙',
            'white': '화이트',
            'gold': '골드',
            'silver': '실버',
            'pink': '핑크',
            'blue': '블루'
        };
        return colors[value] || value;
    }
    
    function getExtraOptionText(value) {
        const options = {
            'surprise-box': '서프라이즈 박스 (+10,000원)',
            'clay-addon': '클레이 추가 (+5,000원)',
            'ribbon-addon': '리본 장식 (+3,000원)',
            'led-addon': 'LED 조명 (+8,000원)'
        };
        return options[value] || value;
    }
    
    function getDeliveryMethodText(value) {
        const methods = {
            'pickup': '픽업 (매장 방문)',
            'delivery': '택배 배송',
            'direct': '직접배송 (동탄/오산)'
        };
        return methods[value] || value;
    }
    
    function getBudgetText(value) {
        const budgets = {
            'under-30': '3만원 이하',
            '30-50': '3-5만원',
            '50-100': '5-10만원',
            '100-200': '10-20만원',
            'over-200': '20만원 이상',
            'discuss': '상담 후 결정'
        };
        return budgets[value] || value;
    }
    
    function getLocationText(value) {
        const locations = {
            'dongtan': '동탄 지점'
        };
        return locations[value] || value;
    }
    
    function getPickupTimeText(value) {
        const times = {
            'morning': '오전 (9시-12시)',
            'afternoon': '오후 (12시-18시)',
            'evening': '저녁 (18시-21시)'
        };
        return times[value] || value;
    }
    
    function getTimePreferenceText(value) {
        const times = {
            'morning': '오전 (9-12시)',
            'afternoon': '오후 (12-18시)',
            'evening': '저녁 (18시 이후)',
            'anytime': '언제든지'
        };
        return times[value] || value;
    }
    
    // 새로운 상세 시간 선택기 처리
    function formatDetailedTimePreference(data) {
        const hour = data.preferredHour;
        const minute = data.preferredMinute;
        
        // 구체적인 시간이 선택된 경우
        if (hour && minute !== undefined && minute !== '') {
            return `${hour}:${minute}`;
        }
        
        // 시간만 선택된 경우
        if (hour) {
            return `${hour}시경`;
        }
        
        // 시간을 선택하지 않은 경우
        return '영업시간 내 연락 후 조율';
    }
    
    function formatDate(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
        const weekday = weekdays[date.getDay()];
        
        return `${year}년 ${month}월 ${day}일 (${weekday})`;
    }
    
    // 카카오톡 채널로 전송
    function sendToKakao(message, orderNumber = null) {
        const kakaoUrl = 'https://pf.kakao.com/_wDixjX';
        
        // 새 창에서 카카오톡 채널 열기
        window.open(kakaoUrl, '_blank');
        
        // 메시지를 클립보드에 복사
        navigator.clipboard.writeText(message.replace(/\\n/g, '\n')).then(() => {
            const successMsg = orderNumber 
                ? `주문번호 ${orderNumber}로 접수되었습니다!\n주문 내용이 클립보드에 복사되었습니다.\n카카오톡 채널에서 붙여넣기하여 전송해주세요.`
                : '주문 내용이 클립보드에 복사되었습니다.\n카카오톡 채널에서 붙여넣기하여 전송해주세요.';
            showSuccessMessage(successMsg);
        }).catch(() => {
            // 클립보드 복사 실패시 대안 제공
            const textarea = document.createElement('textarea');
            textarea.value = message.replace(/\\n/g, '\n');
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            const successMsg = orderNumber 
                ? `주문번호 ${orderNumber}로 접수되었습니다!\n주문 내용이 클립보드에 복사되었습니다.\n카카오톡 채널에서 붙여넣기하여 전송해주세요.`
                : '주문 내용이 클립보드에 복사되었습니다.\n카카오톡 채널에서 붙여넣기하여 전송해주세요.';
            showSuccessMessage(successMsg);
        });
    }
    
    // 성공 메시지 표시
    function showSuccessMessage(message) {
        alert(`✅ 주문 문의가 접수되었습니다!\n\n${message}\n\n📞 즉시 상담이 필요하시면 010-2719-3467 모엔브로 연락주세요.\n\n빠른 시간 내에 연락드리겠습니다! 🎈`);
    }
    
    // 폼 제출 처리
    async function handleSubmit(e) {
        e.preventDefault();
        
        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        
        // 로딩 상태 표시
        submitBtn.disabled = true;
        submitBtn.innerHTML = '전송 중...';
        
        try {
            const data = collectFormData();
            
            // 필수 확인사항 검증
            const confirmInputs = form.querySelectorAll('input[name^="confirm"]:required');
            const allConfirmed = Array.from(confirmInputs).every(input => input.checked);
            
            if (!allConfirmed) {
                throw new Error('모든 필수 확인사항에 동의해주세요.');
            }
            
            // Supabase에 주문 저장 시도
            let orderNumber = null;
            try {
                const dbResult = await submitOrderToDatabase(data);
                if (dbResult.success) {
                    orderNumber = dbResult.orderNumber;
                    console.log(`✅ 데이터베이스 저장 완료: ${orderNumber}`);
                } else {
                    console.log('📝 데이터베이스 저장 실패, 카카오톡으로만 전송');
                }
            } catch (dbError) {
                console.log('📝 데이터베이스 연결 실패, 카카오톡으로만 전송:', dbError);
            }
            
            const message = formatKakaoMessage(data, orderNumber);
            
            // 카카오톡으로 전송
            setTimeout(() => {
                sendToKakao(message, orderNumber);
                
                // 폼 초기화 여부 확인
                setTimeout(() => {
                    const successMsg = orderNumber 
                        ? `주문이 완료되었습니다!\n주문번호: ${orderNumber}\n\n새로운 주문을 위해 폼을 초기화하시겠습니까?`
                        : '주문 문의가 전송되었습니다!\n\n새로운 주문을 위해 폼을 초기화하시겠습니까?';
                        
                    if (confirm(successMsg)) {
                        form.reset();
                        toggleDeliveryDetails();
                        toggleLetteringOptions();
                        updateOrderSummary();
                    }
                    
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                }, 1000);
            }, 500);
            
        } catch (error) {
            console.error('전송 오류:', error);
            alert(`❌ ${error.message}\n\n다시 확인해주시고 문제가 지속되면 직접 연락주세요.\n📞 010-2719-3467 모엔브`);
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    }
});