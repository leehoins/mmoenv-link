// 다중 상품 주문 시스템 - 클리어풍선 8000원 수정버전
document.addEventListener('DOMContentLoaded', function() {
    let productCount = 0;
    let products = [];
    
    // DOM 요소들
    const noticeModal = document.getElementById('noticeModal');
    const orderPage = document.getElementById('orderPage');
    const agreeNotice = document.getElementById('agreeNotice');
    const startOrderBtn = document.getElementById('startOrder');
    const closeNoticeBtn = document.getElementById('closeNotice');
    const form = document.getElementById('orderForm');
    const addProductBtn = document.getElementById('addProductBtn');
    const productsContainer = document.getElementById('productsContainer');
    const productsSummary = document.getElementById('productsSummary');
    const orderType = document.getElementById('orderType');
    
    // MMOENV 상품 데이터 (블로그 기준 정확 업데이트)
    const MMOENV_PRODUCTS = {
        helium: [
            { 
                value: 'bubble-lettering-24', 
                text: '24인치 버블인버블 레터링풍선', 
                hasLettering: true, 
                hasQuantity: false, 
                price: 37000, 
                priceText: '37,000원',
                options: '리본 + 무게추 포함, 추가 리본 2개에 1,000원',
                imageUrl: 'https://via.placeholder.com/150x150/ff6b9d/ffffff?text=버블인버블'
            },
            { 
                value: 'heart-lettering-24', 
                text: '24인치 마카롱 레터링 풍선', 
                hasLettering: true, 
                hasQuantity: false, 
                price: 35000, 
                priceText: '35,000원',
                options: '리본 + 무게추 포함',
                imageUrl: 'https://via.placeholder.com/150x150/ffa8cc/ffffff?text=마카롱레터링'
            },
            { 
                value: 'mini-shape-24', 
                text: '24인치 미니쉐입', 
                hasLettering: false, 
                hasQuantity: false, 
                price: 37000, 
                priceText: '37,000원',
                options: '컨페티 + 리본 + 무게추 포함, 이너종류: 베이비/반지',
                imageUrl: 'https://via.placeholder.com/150x150/87ceeb/ffffff?text=미니쉐입'
            },
            { 
                value: 'balloon-bouquet-round', 
                text: '다발풍선(라운드)', 
                hasLettering: false, 
                hasQuantity: true, 
                price: 4000, 
                priceText: '4,000원/개',
                options: '하트 고무풍선 변경시 6,000원/개, 코팅풍선 변경시 8,000원/개',
                special: 'bouquet',
                imageUrl: 'https://via.placeholder.com/150x150/98fb98/ffffff?text=다발풍선'
            },
            { 
                value: 'heart-in-heart-20', 
                text: '20인치 하트인하트', 
                hasLettering: false, 
                hasQuantity: false, 
                price: 33000, 
                priceText: '33,000원',
                options: '리본 + 무게추 포함',
                imageUrl: 'https://via.placeholder.com/150x150/ff69b4/ffffff?text=하트인하트'
            },
            { 
                value: 'number-foil-large', 
                text: '숫자은박(대형)', 
                hasLettering: false, 
                hasQuantity: true, 
                price: 31000, 
                priceText: '31,000원/개 (헬륨)',
                options: '높이 약 90cm, 공기 9,000원/개 (DIY 택배가능)',
                imageUrl: 'https://via.placeholder.com/150x150/ffd700/000000?text=숫자은박'
            },
            { 
                value: 'clear-balloon', 
                text: '클리어 풍선', 
                hasLettering: false, 
                hasQuantity: true, 
                price: 8000, 
                priceText: '8,000원/개',
                options: '택배 불가, 픽업 및 퀵 가능',
                special: 'clear',
                imageUrl: 'https://via.placeholder.com/150x150/f0f8ff/666666?text=클리어풍선'
            },
            { 
                value: 'mini-ombre', 
                text: '미니옹브레', 
                hasLettering: true, 
                hasQuantity: true, 
                price: 6000, 
                priceText: '6,000원/개',
                options: '레터링 추가시 7,500원/개',
                imageUrl: 'https://via.placeholder.com/150x150/dda0dd/ffffff?text=미니옹브레'
            },
            { 
                value: 'circus-balloon', 
                text: '서커스풍선', 
                hasLettering: false, 
                hasQuantity: false, 
                price: 20000, 
                priceText: '20,000원',
                options: '숫자풍선 개당 3,000원 추가',
                imageUrl: 'https://via.placeholder.com/150x150/ff7f50/ffffff?text=서커스풍선'
            }
        ],
        air: [
            { 
                value: 'daisy-flower', 
                text: '데이지 꽃풍선', 
                hasLettering: false, 
                hasQuantity: true, 
                price: 5000, 
                priceText: '5,000원/송이',
                options: '3송이 14,000원, 5송이 23,000원, 7송이까지 택배 가능',
                imageUrl: 'https://via.placeholder.com/150x150/ffb6c1/ffffff?text=데이지꽃풍선'
            },
            { 
                value: 'tulip-flower', 
                text: '튤립 꽃풍선', 
                hasLettering: false, 
                hasQuantity: true, 
                price: 5000, 
                priceText: '5,000원/송이',
                options: '3송이 14,000원, 5송이 23,000원, 7송이까지 택배 가능',
                imageUrl: 'https://via.placeholder.com/150x150/ff1493/ffffff?text=튤립꽃풍선'
            },
            { 
                value: 'balloon-cake-basic', 
                text: '풍선케이크(기본)', 
                hasLettering: false, 
                hasQuantity: false, 
                price: 21000, 
                priceText: '21,000원',
                options: '촛대에 리본1개 포함, 추가2개 추가금 1,000원',
                imageUrl: 'https://via.placeholder.com/150x150/ffd700/000000?text=풍선케이크'
            },
            { 
                value: 'balloon-cake-mini', 
                text: '풍선케이크(미니)', 
                hasLettering: false, 
                hasQuantity: false, 
                price: 14000, 
                priceText: '14,000원',
                options: '촛대에 리본1개 포함, 추가2개 추가금 1,000원',
                imageUrl: 'https://via.placeholder.com/150x150/ff8c69/ffffff?text=미니케이크'
            },
            { 
                value: 'number-foil-air', 
                text: '숫자은박(공기)', 
                hasLettering: false, 
                hasQuantity: true, 
                price: 9000, 
                priceText: '9,000원/개',
                options: '높이 약 90cm, DIY 택배 가능',
                imageUrl: 'https://via.placeholder.com/150x150/c0c0c0/000000?text=숫자은박'
            }
        ]
    };

    // 초기 설정
    initializeForm();

    function initializeForm() {
        setMinDates();
        setupNoticeModal();
        setupEventListeners();
        updateProductOptions(0); // 첫 번째 상품의 옵션 초기화
        setupProductEventListeners(0); // 첫 번째 상품의 이벤트 리스너 설정
    }

    function setupNoticeModal() {
        // 체크박스 상태에 따라 버튼 활성화
        agreeNotice.addEventListener('change', function() {
            startOrderBtn.disabled = !this.checked;
        });
        
        // 주문 시작하기 버튼
        startOrderBtn.addEventListener('click', function() {
            if (agreeNotice.checked) {
                noticeModal.style.display = 'none';
                orderPage.style.display = 'block';
            }
        });
        
        // 모달 닫기
        closeNoticeBtn.addEventListener('click', function() {
            window.location.href = 'index.html';
        });
    }

    function setupEventListeners() {
        // 주문 유형 변경
        orderType.addEventListener('change', function() {
            updateAllProductOptions();
        });

        // 상품 추가 버튼
        addProductBtn.addEventListener('click', addProduct);

        // 수령 방법 변경
        const deliveryRadios = document.querySelectorAll('input[name="deliveryMethod"]');
        deliveryRadios.forEach(radio => {
            radio.addEventListener('change', toggleDeliveryDetails);
        });

        // 폼 제출
        form.addEventListener('submit', handleFormSubmit);
    }

    function addProduct() {
        productCount++;
        const newProductHTML = createProductHTML(productCount);
        
        // 새 상품 섹션 추가
        const newProductDiv = document.createElement('div');
        newProductDiv.innerHTML = newProductHTML;
        const newProductSection = newProductDiv.firstElementChild;
        
        productsContainer.appendChild(newProductSection);
        
        // 새 상품의 이벤트 리스너 설정
        setupProductEventListeners(productCount);
        
        // 상품 옵션 업데이트
        updateProductOptions(productCount);
        
        // 상품 요약 업데이트
        updateProductsSummary();
    }

    function createProductHTML(index) {
        return `
            <div class="product-section" data-product-index="${index}">
                <div class="product-header">
                    <h3>상품 ${index + 1}</h3>
                    <button type="button" class="remove-product-btn" onclick="removeProduct(${index})">×</button>
                </div>
                
                <!-- 상품 선택 -->
                <div class="form-group">
                    <label for="balloonType_${index}">상품 선택 <span class="required">*</span></label>
                    <div class="product-selection-container">
                        <select id="balloonType_${index}" name="balloonType_${index}" required class="balloon-type-select" data-index="${index}">
                            <option value="">먼저 주문 유형을 선택해주세요</option>
                        </select>
                        <div class="product-thumbnail" id="productThumbnail_${index}" style="display: none;">
                            <img id="productImage_${index}" src="" alt="상품 이미지" />
                            <div class="thumbnail-info">
                                <span class="thumbnail-name" id="thumbnailName_${index}"></span>
                                <span class="thumbnail-price" id="thumbnailPrice_${index}"></span>
                            </div>
                        </div>
                    </div>
                    <small class="form-hint">주문 유형에 따라 선택 가능한 상품이 달라집니다</small>
                </div>

                <!-- 개수 선택 옵션 -->
                <div class="quantity-options" id="quantityOptions_${index}" style="display: none;">
                    <div class="form-group">
                        <label for="balloonQuantity_${index}">수량 <span class="required">*</span></label>
                        <div class="quantity-selector">
                            <select id="balloonQuantity_${index}" name="balloonQuantity_${index}" class="balloon-quantity-select" data-index="${index}">
                                <option value="">수량 선택</option>
                                <option value="1">1개</option>
                                <option value="2">2개</option>
                                <option value="3">3개</option>
                                <option value="4">4개</option>
                                <option value="5">5개</option>
                                <option value="6">6개</option>
                                <option value="7">7개</option>
                                <option value="8">8개</option>
                                <option value="9">9개</option>
                                <option value="10">10개</option>
                                <option value="custom">10개 이상 (직접입력)</option>
                            </select>
                        </div>
                        <div class="custom-quantity" id="customQuantity_${index}" style="display: none;">
                            <input type="number" id="customQuantityInput_${index}" name="customQuantityInput_${index}" min="11" max="100" placeholder="개수 입력">
                        </div>
                        <div class="price-display" id="priceDisplay_${index}" style="display: none;">
                            <span class="calculated-price"></span>
                        </div>
                        <small class="form-hint">10개 이상 주문시 할인 혜택이 있습니다</small>
                    </div>
                </div>

                <!-- 다발풍선 특별 안내사항 -->
                <div class="balloon-bouquet-notice" id="balloonBouquetNotice_${index}" style="display: none;">
                    <div class="warning-box">
                        <h4>🚨 다발풍선 중요 안내사항</h4>
                        <ul>
                            <li><strong>고무풍선 특성상 채공시간이 매우 짧습니다!</strong></li>
                            <li>유지용액 넣지 않을경우 최대 <strong>4-5시간 이내</strong></li>
                            <li>유지용액 넣을경우 최대 <strong>12시간 이내</strong></li>
                            <li><strong>당일제작, 당일사용</strong> 하셔야 하며, <strong>택배 불가능</strong> 상품입니다</li>
                            <li>유지용액은 무료로 넣어 드립니다</li>
                            <li>유지용액 넣을경우 투명 풍선의 경우 얼룩처럼 보일 수 있습니다</li>
                            <li>코팅풍선 변경 시에만 택배 가능합니다</li>
                        </ul>
                    </div>
                </div>

                <!-- 클리어풍선 특별 안내사항 -->
                <div class="clear-balloon-notice" id="clearBalloonNotice_${index}" style="display: none;">
                    <div class="warning-box">
                        <h4>💎 클리어풍선 안내사항</h4>
                        <ul>
                            <li><strong>택배 불가, 픽업 및 퀵 가능</strong></li>
                            <li>투명하고 맑지만 대략 최소 <strong>3-7일 정도 유지</strong> 가능합니다</li>
                        </ul>
                    </div>
                </div>

                <!-- 레터링 관련 옵션 -->
                <div class="lettering-options" id="letteringOptions_${index}" style="display: none;">
                    <div class="form-group">
                        <label for="letteringText_${index}">레터링 문구 <span class="required">*</span></label>
                        <textarea 
                            id="letteringText_${index}" 
                            name="letteringText_${index}" 
                            placeholder="풍선에 새길 문구를 정확히 입력해주세요.&#10;예: Happy Birthday, 사랑해, 축하합니다"
                            rows="3"
                        ></textarea>
                        <small class="form-hint">정확한 맞춤법과 띄어쓰기로 입력해주세요</small>
                    </div>

                    <div class="form-group">
                        <label for="fontType_${index}">폰트 선택</label>
                        <select id="fontType_${index}" name="fontType_${index}">
                            <option value="">기본 폰트</option>
                            <option value="elegant">고급형 폰트</option>
                            <option value="cute">귀여운 폰트</option>
                            <option value="bold">굵은 폰트</option>
                            <option value="script">필기체 폰트</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="fontColor_${index}">폰트 색상</label>
                        <div class="color-options">
                            <label class="color-option">
                                <input type="radio" name="fontColor_${index}" value="black">
                                <span class="color-preview" style="background: #000;"></span>
                                블랙
                            </label>
                            <label class="color-option">
                                <input type="radio" name="fontColor_${index}" value="white">
                                <span class="color-preview" style="background: #fff; border: 1px solid #ddd;"></span>
                                화이트
                            </label>
                            <label class="color-option">
                                <input type="radio" name="fontColor_${index}" value="gold">
                                <span class="color-preview" style="background: #ffd700;"></span>
                                골드
                            </label>
                            <label class="color-option">
                                <input type="radio" name="fontColor_${index}" value="silver">
                                <span class="color-preview" style="background: #c0c0c0;"></span>
                                실버
                            </label>
                            <label class="color-option">
                                <input type="radio" name="fontColor_${index}" value="pink">
                                <span class="color-preview" style="background: #ff69b4;"></span>
                                핑크
                            </label>
                            <label class="color-option">
                                <input type="radio" name="fontColor_${index}" value="blue">
                                <span class="color-preview" style="background: #1e90ff;"></span>
                                블루
                            </label>
                        </div>
                    </div>
                </div>

            </div>
        `;
    }

    function setupProductEventListeners(index) {
        // 상품 선택 변경
        const balloonTypeSelect = document.getElementById(`balloonType_${index}`);
        if (balloonTypeSelect) {
            balloonTypeSelect.addEventListener('change', function() {
                toggleProductOptions(index);
                updateProductsSummary();
            });
        }

        // 수량 선택 변경
        const quantitySelect = document.getElementById(`balloonQuantity_${index}`);
        if (quantitySelect) {
            quantitySelect.addEventListener('change', function() {
                handleQuantityChange(index);
                updateProductsSummary();
            });
        }

        // 커스텀 수량 입력
        const customQuantityInput = document.getElementById(`customQuantityInput_${index}`);
        if (customQuantityInput) {
            customQuantityInput.addEventListener('input', function() {
                updateProductsSummary();
            });
        }
    }

    window.removeProduct = function(index) {
        const productSection = document.querySelector(`[data-product-index="${index}"]`);
        if (productSection) {
            productSection.remove();
            updateProductsSummary();
        }
    };

    function updateAllProductOptions() {
        const orderTypeValue = orderType.value;
        
        // 모든 상품의 옵션 업데이트
        document.querySelectorAll('.balloon-type-select').forEach(select => {
            const index = select.dataset.index || 0;
            updateProductOptions(index);
        });
    }

    function updateProductOptions(index) {
        const orderTypeValue = orderType.value;
        const balloonTypeSelect = document.getElementById(`balloonType_${index}`);
        
        if (!balloonTypeSelect) return;
        
        // 기존 옵션 제거
        balloonTypeSelect.innerHTML = '<option value="">상품을 선택해주세요</option>';
        
        if (orderTypeValue && MMOENV_PRODUCTS[orderTypeValue]) {
            MMOENV_PRODUCTS[orderTypeValue].forEach(product => {
                const option = document.createElement('option');
                option.value = product.value;
                option.textContent = `${product.text} (${product.priceText})`;
                balloonTypeSelect.appendChild(option);
            });
        }
    }

    function toggleProductOptions(index) {
        const balloonTypeSelect = document.getElementById(`balloonType_${index}`);
        const quantityOptions = document.getElementById(`quantityOptions_${index}`);
        const letteringOptions = document.getElementById(`letteringOptions_${index}`);
        const balloonBouquetNotice = document.getElementById(`balloonBouquetNotice_${index}`);
        const clearBalloonNotice = document.getElementById(`clearBalloonNotice_${index}`);
        const productThumbnail = document.getElementById(`productThumbnail_${index}`);
        
        if (!balloonTypeSelect) return;
        
        const selectedValue = balloonTypeSelect.value;
        const orderTypeValue = orderType.value;
        
        // 모든 옵션 숨기기
        if (quantityOptions) quantityOptions.style.display = 'none';
        if (letteringOptions) letteringOptions.style.display = 'none';
        if (balloonBouquetNotice) balloonBouquetNotice.style.display = 'none';
        if (clearBalloonNotice) clearBalloonNotice.style.display = 'none';
        if (productThumbnail) productThumbnail.style.display = 'none';
        
        if (selectedValue && orderTypeValue && MMOENV_PRODUCTS[orderTypeValue]) {
            const selectedProduct = MMOENV_PRODUCTS[orderTypeValue].find(p => p.value === selectedValue);
            
            if (selectedProduct) {
                // 상품 섬네일 표시
                showProductThumbnail(index, selectedProduct);
                
                // 수량 옵션 표시
                if (selectedProduct.hasQuantity && quantityOptions) {
                    quantityOptions.style.display = 'block';
                }
                
                // 레터링 옵션 표시
                if (selectedProduct.hasLettering && letteringOptions) {
                    letteringOptions.style.display = 'block';
                }
                
                // 특별 안내사항 표시
                if (selectedProduct.special === 'bouquet' && balloonBouquetNotice) {
                    balloonBouquetNotice.style.display = 'block';
                }
                
                if (selectedProduct.special === 'clear' && clearBalloonNotice) {
                    clearBalloonNotice.style.display = 'block';
                }
            }
        }
    }

    function showProductThumbnail(index, product) {
        const productThumbnail = document.getElementById(`productThumbnail_${index}`);
        const productImage = document.getElementById(`productImage_${index}`);
        const thumbnailName = document.getElementById(`thumbnailName_${index}`);
        const thumbnailPrice = document.getElementById(`thumbnailPrice_${index}`);
        
        if (productThumbnail && productImage && thumbnailName && thumbnailPrice) {
            productImage.src = product.imageUrl;
            productImage.alt = product.text;
            thumbnailName.textContent = product.text;
            thumbnailPrice.textContent = product.priceText;
            productThumbnail.style.display = 'block';
            
            // 이미지 로드 에러 처리
            productImage.onerror = function() {
                this.src = 'https://via.placeholder.com/150x150/cccccc/666666?text=이미지+없음';
            };
        }
    }

    function handleQuantityChange(index) {
        const quantitySelect = document.getElementById(`balloonQuantity_${index}`);
        const customQuantity = document.getElementById(`customQuantity_${index}`);
        
        if (!quantitySelect || !customQuantity) return;
        
        if (quantitySelect.value === 'custom') {
            customQuantity.style.display = 'block';
        } else {
            customQuantity.style.display = 'none';
        }
        
        updatePriceDisplay(index);
    }

    function updatePriceDisplay(index) {
        const balloonTypeSelect = document.getElementById(`balloonType_${index}`);
        const quantitySelect = document.getElementById(`balloonQuantity_${index}`);
        const customQuantityInput = document.getElementById(`customQuantityInput_${index}`);
        const priceDisplay = document.getElementById(`priceDisplay_${index}`);
        
        if (!balloonTypeSelect || !quantitySelect || !priceDisplay) return;
        
        const selectedValue = balloonTypeSelect.value;
        const orderTypeValue = orderType.value;
        
        if (selectedValue && orderTypeValue && MMOENV_PRODUCTS[orderTypeValue]) {
            const selectedProduct = MMOENV_PRODUCTS[orderTypeValue].find(p => p.value === selectedValue);
            
            if (selectedProduct && selectedProduct.hasQuantity) {
                let quantity = parseInt(quantitySelect.value) || 0;
                
                if (quantitySelect.value === 'custom' && customQuantityInput) {
                    quantity = parseInt(customQuantityInput.value) || 0;
                }
                
                if (quantity > 0) {
                    const totalPrice = selectedProduct.price * quantity;
                    const discountPrice = quantity >= 10 ? totalPrice * 0.9 : totalPrice;
                    
                    priceDisplay.style.display = 'block';
                    const priceSpan = priceDisplay.querySelector('.calculated-price');
                    if (priceSpan) {
                        if (quantity >= 10) {
                            priceSpan.innerHTML = `<s>${totalPrice.toLocaleString()}원</s> → ${discountPrice.toLocaleString()}원 (10% 할인)`;
                        } else {
                            priceSpan.textContent = `${totalPrice.toLocaleString()}원`;
                        }
                    }
                } else {
                    priceDisplay.style.display = 'none';
                }
            }
        }
    }

    function updateProductsSummary() {
        const productSections = document.querySelectorAll('.product-section');
        const summaryList = document.getElementById('productsListSummary');
        const totalPriceSpan = document.getElementById('totalPrice');
        
        if (!summaryList || !totalPriceSpan) return;
        
        summaryList.innerHTML = '';
        let totalPrice = 0;
        let hasProducts = false;
        
        productSections.forEach(section => {
            const index = section.dataset.productIndex;
            const productSummary = getProductSummary(index);
            
            if (productSummary) {
                hasProducts = true;
                const summaryItem = document.createElement('div');
                summaryItem.className = 'product-summary-item';
                summaryItem.innerHTML = `
                    <h4>${productSummary.name}</h4>
                    <div class="summary-details">${productSummary.details}</div>
                `;
                summaryList.appendChild(summaryItem);
                totalPrice += productSummary.price;
            }
        });
        
        if (hasProducts) {
            productsSummary.style.display = 'block';
            totalPriceSpan.textContent = `${totalPrice.toLocaleString()}원`;
        } else {
            productsSummary.style.display = 'none';
        }
    }

    function getProductSummary(index) {
        const balloonTypeSelect = document.getElementById(`balloonType_${index}`);
        const quantitySelect = document.getElementById(`balloonQuantity_${index}`);
        const customQuantityInput = document.getElementById(`customQuantityInput_${index}`);
        const letteringText = document.getElementById(`letteringText_${index}`);
        
        if (!balloonTypeSelect || !balloonTypeSelect.value) return null;
        
        const orderTypeValue = orderType.value;
        const selectedValue = balloonTypeSelect.value;
        
        if (!orderTypeValue || !MMOENV_PRODUCTS[orderTypeValue]) return null;
        
        const selectedProduct = MMOENV_PRODUCTS[orderTypeValue].find(p => p.value === selectedValue);
        if (!selectedProduct) return null;
        
        let quantity = 1;
        if (selectedProduct.hasQuantity && quantitySelect) {
            quantity = quantitySelect.value === 'custom' && customQuantityInput 
                ? parseInt(customQuantityInput.value) || 0
                : parseInt(quantitySelect.value) || 0;
        }
        
        if (quantity === 0) return null;
        
        let price = selectedProduct.price;
        if (selectedProduct.hasQuantity) {
            price = selectedProduct.price * quantity;
            if (quantity >= 10) {
                price = price * 0.9; // 10% 할인
            }
        }
        
        let details = selectedProduct.priceText;
        if (selectedProduct.hasQuantity) {
            details += ` × ${quantity}개`;
            if (quantity >= 10) {
                details += ' (10% 할인 적용)';
            }
        }
        
        if (selectedProduct.hasLettering && letteringText && letteringText.value) {
            details += `<br>레터링: "${letteringText.value}"`;
        }
        
        return {
            name: selectedProduct.text,
            details: details,
            price: price
        };
    }

    function setMinDates() {
        const today = new Date();
        const threeDaysLater = new Date(today);
        threeDaysLater.setDate(today.getDate() + 3);
        
        const usageDateInput = document.getElementById('usageDate');
        const desiredDateInput = document.getElementById('desiredDate');
        
        if (usageDateInput) {
            usageDateInput.min = threeDaysLater.toISOString().split('T')[0];
        }
        
        if (desiredDateInput) {
            desiredDateInput.min = today.toISOString().split('T')[0];
        }
    }

    function toggleDeliveryDetails() {
        const deliveryRadios = document.querySelectorAll('input[name="deliveryMethod"]');
        const pickupDetails = document.getElementById('pickupDetails');
        const deliveryDetails = document.getElementById('deliveryDetails');
        const directDetails = document.getElementById('directDetails');
        
        // 모든 상세 옵션 숨기기
        [pickupDetails, deliveryDetails, directDetails].forEach(detail => {
            if (detail) detail.style.display = 'none';
        });
        
        // 선택된 옵션에 따라 상세 옵션 표시
        deliveryRadios.forEach(radio => {
            if (radio.checked) {
                const detailId = radio.value + 'Details';
                const detailElement = document.getElementById(detailId);
                if (detailElement) {
                    detailElement.style.display = 'block';
                }
            }
        });
    }

    function handleFormSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const orderData = {
            customer: {
                name: formData.get('customerName'),
                phone: formData.get('customerPhone')
            },
            products: [],
            delivery: {
                method: formData.get('deliveryMethod'),
                address: formData.get('deliveryAddress') || formData.get('directAddress'),
                phone: formData.get('deliveryPhone')
            },
            schedule: {
                usageDate: formData.get('usageDate'),
                desiredDate: formData.get('desiredDate'),
                pickupTime: formData.get('preferredHour') && formData.get('preferredMinute') 
                    ? `${formData.get('preferredHour')}:${formData.get('preferredMinute')}` 
                    : ''
            },
            notes: formData.get('orderDetails'),
            additionalNotes: formData.get('additionalNotes')
        };

        // 상품 정보 수집
        const productSections = document.querySelectorAll('.product-section');
        productSections.forEach(section => {
            const index = section.dataset.productIndex;
            const productData = getProductData(index, formData);
            if (productData) {
                orderData.products.push(productData);
            }
        });

        console.log('주문 데이터:', orderData);
        
        // 여기서 실제 주문 처리 로직 구현
        alert('주문이 접수되었습니다! 곧 연락드리겠습니다.');
    }

    function getProductData(index, formData) {
        const balloonType = formData.get(`balloonType_${index}`);
        if (!balloonType) return null;

        const orderTypeValue = orderType.value;
        const selectedProduct = MMOENV_PRODUCTS[orderTypeValue]?.find(p => p.value === balloonType);
        
        if (!selectedProduct) return null;

        const productData = {
            type: selectedProduct.text,
            value: balloonType,
            price: selectedProduct.price
        };

        if (selectedProduct.hasQuantity) {
            const quantity = formData.get(`balloonQuantity_${index}`) === 'custom' 
                ? formData.get(`customQuantityInput_${index}`)
                : formData.get(`balloonQuantity_${index}`);
            productData.quantity = parseInt(quantity) || 1;
            productData.totalPrice = selectedProduct.price * productData.quantity;
            if (productData.quantity >= 10) {
                productData.totalPrice = productData.totalPrice * 0.9;
                productData.discount = true;
            }
        }

        if (selectedProduct.hasLettering) {
            productData.lettering = {
                text: formData.get(`letteringText_${index}`),
                font: formData.get(`fontType_${index}`),
                color: formData.get(`fontColor_${index}`)
            };
        }


        return productData;
    }
});