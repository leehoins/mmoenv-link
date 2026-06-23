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
                imageUrl: 'https://postfiles.pstatic.net/MjAyNjA2MDlfMTk2/MDAxNzgwOTgyMDEwOTYw.11C5e6zfiXVmwdPaJVRtDU_1Ei9I1RpAothB6omtJxwg.DarqQVPbxpASdALAl2mGZlW2fbvrGNgintqZey4ayzwg.JPEG/SE-bcd6b9d4-cfb6-4ba1-8c59-bb4581d75f70.jpg'
            },
            { 
                value: 'heart-lettering-24', 
                text: '24인치 마카롱 레터링 풍선', 
                hasLettering: true, 
                hasQuantity: false, 
                price: 35000, 
                priceText: '35,000원',
                options: '리본 + 무게추 포함',
                imageUrl: 'https://postfiles.pstatic.net/MjAyNjA2MDlfMTc3/MDAxNzgwOTgxMzAwMjI2.1iBuIAdH7cTPjwKiZ3U6-Ht5hNjUl5YzRe8BgQUwYJgg.P6xQr2qceh0qgWRrBpvpDXep3iRGp4-zRZ7GsREhZG0g.JPEG/SE-b767c894-43f1-49f7-b86c-28c53cd4b7fe.jpg'
            },
            { 
                value: 'mini-shape-24',
                text: '24인치 미니쉐입',
                hasLettering: true,
                hasQuantity: false, 
                price: 37000, 
                priceText: '37,000원',
                options: '컨페티 + 리본 + 무게추 포함, 이너종류: 베이비/반지',
                imageUrl: 'https://postfiles.pstatic.net/MjAyNjA2MDlfMjQw/MDAxNzgwOTgzNTYxOTQ5.tPi3-yD77GpWjiS5u-aIAD8CrbPxJFxgz0JBMppV9AIg.AuBoKDWj_8Ltgx7mgQ1OdiZqr4n0CNMLhe4G9aSeQ70g.JPEG/SE-b8e86e0c-25d4-43ee-992a-2510e52331c1.jpg'
            },
            { 
                value: 'balloon-bouquet-round',
                text: '다발 풍선(라운드)',
                hasLettering: true,
                hasQuantity: true, 
                price: 4000, 
                priceText: '4,000원/개',
                options: '하트 고무 풍선 변경 시 6,000원/개, 코팅 풍선 변경 시 8,000원/개',
                hideQuantityHint: true,
                imageUrl: 'https://postfiles.pstatic.net/MjAyNjA2MjJfNzEg/MDAxNzgyMDkxMTk5Mzg3.5F0Gweg_QW8Kw_CrbWyYkc6WQC424uF98I24fq1j-kQg.YnanvQI9qyRY4vNgrGa2t6UtQqr2yDkzdKiUM7vk7i8g.JPEG/SE-41f2c173-d75e-4ea2-af4d-153ff4c23984.jpg'
            },
            { 
                value: 'heart-in-heart-20',
                text: '20인치 하트인하트',
                hasLettering: true,
                hasQuantity: false, 
                price: 33000, 
                priceText: '33,000원',
                options: '리본 + 무게추 포함',
                imageUrl: 'https://postfiles.pstatic.net/MjAyNjA2MTRfMTky/MDAxNzgxNDE3ODU2MDAx.SY5vjaDXUnr6tKZKzh-5fGz8t_pmXyhFfHJUxyI82Acg.jkpS3mbNSd4uxdROSUxycpgXoP8meO6WDQ3vj2kslFcg.JPEG/E51587FE-A00D-451A-B6C9-80189C00A38E.JPG'
            },
            { 
                value: 'number-foil-large',
                text: '숫자은박(대형)',
                hasLettering: true,
                hasQuantity: true, 
                price: 31000, 
                priceText: '31,000원/개 (헬륨)',
                options: '높이 약 90cm, 공기 9,000원/개 (DIY 택배가능)',
                imageUrl: 'https://postfiles.pstatic.net/MjAyNjA2MDlfMjU4/MDAxNzgwOTg0NjMxMTc0.U3EJ0A3W-sObE2suLG8nwvKCNpaBt4yoeOC0fj6j_fEg.tGYI9KwuUW_BhKHP43aWtJ0fv89abZnY5v5iiXVjf1Ig.JPEG/SE-9c2ebb78-e15f-45b9-aea5-202f59ef5371.jpg'
            },
            { 
                value: 'clear-balloon',
                text: '클리어 풍선',
                hasLettering: true,
                hasQuantity: true, 
                price: 8000, 
                priceText: '8,000원/개',
                options: '택배 불가, 픽업 및 퀵 가능',
                special: 'clear',
                imageUrl: 'https://postfiles.pstatic.net/MjAyNjA2MTRfMTg3/MDAxNzgxNDE3OTE0NjM1.BqzT9b39V24Efr1GG7HHMqHnUjJXMpK2G6HRfsIGTGcg.Wb_xj6hA_HfJB9PgSEnQudPR1CmCgnXPcUilCvSgGIQg.JPEG/SE-f463a61b-9c15-417d-b58d-2d10339f72e7.jpg'
            },
            { 
                value: 'mini-ombre',
                text: '미니옹브레',
                hasLettering: true,
                hasQuantity: true,
                price: 6000,
                priceText: '6,000원/개',
                options: '레터링 추가시 7,500원/개',
                imageUrl: 'https://postfiles.pstatic.net/MjAyNjA2MjJfMjM4/MDAxNzgyMDkzNTE0MDAz.439vUKubs7IPV-cTDxPmT3hT4ssHZRo71kPkfD_fc4Eg.ApzoJmbQBTpKcy-IZ8DkldBYvvTh1g2JCgoI-ZS7EgUg.PNG/SE-85772596-6763-4635-b64c-7ced47c4499d.png'
            },
            {
                value: 'circus-balloon',
                text: '서커스풍선',
                hasLettering: true,
                hasQuantity: false,
                price: 20000,
                priceText: '20,000원',
                options: '숫자풍선 개당 3,000원 추가',
                imageUrl: 'https://postfiles.pstatic.net/MjAyNjA2MjJfMTgw/MDAxNzgyMDkzNDkwODYy.ICjpHTP86WVhP8eiOoQ6QK9dP9ZACgQVqcXhv6QtiWcg.fdt24GrlTtr7zO_aW9dLKQDHiukRf081nhRZ4ZOJoqIg.JPEG/SE-98b7af5a-830c-47b4-90bc-a39511fe51c2.jpg'
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
                hideQuantityHint: true,
                imageUrl: 'https://postfiles.pstatic.net/MjAyNjA2MDlfMjA5/MDAxNzgwOTg3MjI3MTcz.9pKnBnRz_B8QlhYzDGUwPWEKCc_vidGJrYBQxmI5qAkg.XHPd7oKjOQDCLDsVn71MWuHP9fnalQ0WzuA4uTb2pY4g.JPEG/IMG_9731.JPG'
            },
            {
                value: 'tulip-flower',
                text: '튤립 꽃풍선',
                hasLettering: false,
                hasQuantity: true,
                price: 5000,
                priceText: '5,000원/송이',
                options: '3송이 14,000원, 5송이 23,000원, 7송이까지 택배 가능',
                hideQuantityHint: true,
                imageUrl: 'https://postfiles.pstatic.net/MjAyNjA2MDlfMjE4/MDAxNzgwOTg3MjgyOTAz.D6WCByBlq56k4MNQ4YOH9vaBsyy0EILIg_WaH5PaW9cg.aOHhsXh_2ZOs8sYjuE3y0f586l6RU6Gbweio0P0Y1dQg.JPEG/SE-2913a741-17f4-4291-96c3-d08f258d2ba3.jpg'
            },
            {
                value: 'balloon-cake-basic',
                text: '풍선케이크(기본)',
                hasLettering: false,
                hasQuantity: false,
                price: 21000,
                priceText: '21,000원',
                options: '촛대에 리본1개 포함, 추가2개 추가금 1,000원',
                imageUrl: 'https://postfiles.pstatic.net/MjAyNjA2MDlfMTUx/MDAxNzgwOTgzMTc5MDE4.JqHScV-AJypD9HP5uTEpoQbVLgx7gbOsID3Q9f7bUFog.EHn2_xsIqLAVtL9U_j0wH8-1SWGvcIfAH44qz5XGdHog.JPEG/SE-e19c8ba8-9ec0-40ad-82bc-08300042aa76.jpg'
            },
            {
                value: 'balloon-cake-mini',
                text: '풍선케이크(미니)',
                hasLettering: false,
                hasQuantity: false,
                price: 14000,
                priceText: '14,000원',
                options: '촛대에 리본1개 포함, 추가2개 추가금 1,000원',
                imageUrl: 'https://postfiles.pstatic.net/MjAyNjA2MDlfMjAg/MDAxNzgwOTgzMjEzNjM5.LwXFuNkaCPmxUO8w6gOvoUoYn2hCUlEXrYLbfiBbsiIg.m__200fJ9PSobJtHrD8vsLG1l5Y8U521MpE3L3vE_3Ig.JPEG/SE-2eb3d341-bbd1-48ad-ba97-1e8767f162b7.jpg'
            },
            {
                value: 'number-foil-air',
                text: '숫자은박(공기)',
                hasLettering: false,
                hasQuantity: true,
                price: 9000,
                priceText: '9,000원/개',
                options: '높이 약 90cm, DIY 택배 가능',
                hideQuantityHint: true,
                imageUrl: 'https://postfiles.pstatic.net/MjAyNjA2MDlfMjU4/MDAxNzgwOTg0NjMxMTc0.U3EJ0A3W-sObE2suLG8nwvKCNpaBt4yoeOC0fj6j_fEg.tGYI9KwuUW_BhKHP43aWtJ0fv89abZnY5v5iiXVjf1Ig.JPEG/SE-9c2ebb78-e15f-45b9-aea5-202f59ef5371.jpg'
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
        if (typeof initOrderManager === 'function') {
            initOrderManager();
        }
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
            window.location.href = '/';
        });
    }

    function setupEventListeners() {
        // 주문 유형 변경
        orderType.addEventListener('change', function() {
            updateAllProductOptions();
            updateProductsSummary();
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

        // 카카오 전송 안내 모달
        document.getElementById('closeKakaoModal').addEventListener('click', closeKakaoSendModal);
        document.getElementById('resetFormAfterKakao').addEventListener('click', function() {
            closeKakaoSendModal();
            form.reset();
            toggleDeliveryDetails();
            refreshAllProductDropdowns();
            updateProductsSummary();
        });

        document.addEventListener('click', function(event) {
            if (!event.target.closest('.product-select')) {
                closeAllProductDropdowns();
            }
        });

        window.addEventListener('resize', closeAllProductDropdowns);
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

    const MIN_LETTERING_LINES = 3;
    const MAX_LETTERING_LINES = 6;

    function letteringLineRowHTML(index, lineNumber) {
        return `
            <div class="lettering-line-row" data-index="${index}" data-line="${lineNumber}">
                <span class="lettering-line-badge">${lineNumber}줄</span>
                <input
                    type="text"
                    class="lettering-line-input"
                    data-index="${index}"
                    data-line="${lineNumber}"
                    ${lineNumber === 1 ? `id="letteringText_${index}" name="letteringText_${index}" required` : ''}
                    placeholder="${lineNumber}줄에 들어갈 문구"
                >
            </div>
        `;
    }

    function letteringLinesHTML(index, count) {
        let html = '';
        for (let i = 1; i <= count; i++) {
            html += letteringLineRowHTML(index, i);
        }
        return html;
    }

    function addLetteringLine(index) {
        const container = document.getElementById(`letteringLines_${index}`);
        if (!container) return;

        const currentCount = container.querySelectorAll('.lettering-line-row').length;
        if (currentCount >= MAX_LETTERING_LINES) return;

        const nextLine = currentCount + 1;
        const wrapper = document.createElement('div');
        wrapper.innerHTML = letteringLineRowHTML(index, nextLine).trim();
        const newRow = wrapper.firstElementChild;
        container.appendChild(newRow);
        newRow.querySelector('input').focus();

        const addBtn = document.querySelector(`.add-lettering-line-btn[data-index="${index}"]`);
        if (addBtn && nextLine >= MAX_LETTERING_LINES) {
            addBtn.disabled = true;
            addBtn.textContent = `최대 ${MAX_LETTERING_LINES}줄까지 입력 가능합니다`;
        }
    }

    function collectLetteringText(index) {
        const inputs = document.querySelectorAll(`.lettering-line-input[data-index="${index}"]`);
        return Array.from(inputs)
            .map(input => input.value.trim())
            .filter(value => value.length > 0)
            .join('\n');
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
                            <option value="">먼저 주문 유형을 선택해 주세요</option>
                        </select>
                        <div class="product-thumbnail" id="productThumbnail_${index}" style="display: none;">
                            <img id="productImage_${index}" src="" alt="상품 이미지" referrerpolicy="no-referrer" />
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
                        <small class="form-hint" id="quantityHint_${index}">10개 이상 주문 시 할인 혜택이 있습니다</small>
                    </div>
                </div>

                <!-- 클리어풍선 특별 안내사항 -->
                <div class="clear-balloon-notice" id="clearBalloonNotice_${index}" style="display: none;">
                    <div class="warning-box">
                        <h4>💎 클리어풍선 안내사항</h4>
                        <ul>
                            <li><strong>택배 불가, 픽업 및 퀵 가능</strong></li>
                        </ul>
                    </div>
                </div>

                <!-- 레터링 관련 옵션 -->
                <div class="lettering-options" id="letteringOptions_${index}" style="display: none;">
                    <div class="form-group">
                        <label>레터링 문구 <span class="required">*</span></label>
                        <div class="lettering-lines" id="letteringLines_${index}">
                            ${letteringLinesHTML(index, MIN_LETTERING_LINES)}
                        </div>
                        <button type="button" class="add-lettering-line-btn" data-index="${index}">+ 줄 추가</button>
                        <small class="form-hint">정확한 맞춤법과 띄어쓰기, 대소문자를 구분하여 입력해 주세요 (최대 ${MAX_LETTERING_LINES}줄). 폰트와 색상은 상담을 통해 결정됩니다</small>
                    </div>
                </div>

            </div>
        `;
    }

    function setupProductEventListeners(index) {
        // 상품 선택 변경
        const balloonTypeSelect = document.getElementById(`balloonType_${index}`);
        if (balloonTypeSelect) {
            setupProductDropdown(index);
            balloonTypeSelect.addEventListener('change', function() {
                syncProductDropdown(index);
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

        // 레터링 줄 추가 버튼
        const addLetteringLineBtn = document.querySelector(`.add-lettering-line-btn[data-index="${index}"]`);
        if (addLetteringLineBtn) {
            addLetteringLineBtn.addEventListener('click', function() {
                addLetteringLine(index);
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
        balloonTypeSelect.innerHTML = '<option value="">상품을 선택해 주세요</option>';
        
        if (orderTypeValue && MMOENV_PRODUCTS[orderTypeValue]) {
            MMOENV_PRODUCTS[orderTypeValue].forEach(product => {
                const option = document.createElement('option');
                option.value = product.value;
                option.textContent = `${product.text} (${product.priceText})`;
                balloonTypeSelect.appendChild(option);
            });
        }

        setupProductDropdown(index);
        syncProductDropdown(index);
        toggleProductOptions(index);
    }

    function setupProductDropdown(index) {
        const balloonTypeSelect = document.getElementById(`balloonType_${index}`);
        if (!balloonTypeSelect) return;

        let productSelect = balloonTypeSelect.closest('.product-select');
        if (!productSelect) {
            productSelect = document.createElement('div');
            productSelect.className = 'product-select';
            productSelect.dataset.productSelectIndex = index;
            balloonTypeSelect.parentNode.insertBefore(productSelect, balloonTypeSelect);
            productSelect.appendChild(balloonTypeSelect);

            const trigger = document.createElement('button');
            trigger.type = 'button';
            trigger.className = 'product-select-trigger';
            trigger.id = `productSelectTrigger_${index}`;
            trigger.setAttribute('aria-haspopup', 'listbox');
            trigger.setAttribute('aria-expanded', 'false');
            trigger.setAttribute('aria-controls', `productSelectMenu_${index}`);
            trigger.innerHTML = '<span class="product-select-label">상품을 선택해 주세요</span>';

            const menu = document.createElement('div');
            menu.className = 'product-select-menu';
            menu.id = `productSelectMenu_${index}`;
            menu.setAttribute('role', 'listbox');
            menu.setAttribute('aria-labelledby', trigger.id);

            productSelect.appendChild(trigger);
            productSelect.appendChild(menu);
        }

        if (productSelect.dataset.dropdownReady === 'true') {
            renderProductDropdown(index);
            return;
        }

        balloonTypeSelect.classList.add('product-native-select');
        balloonTypeSelect.tabIndex = -1;
        balloonTypeSelect.setAttribute('aria-hidden', 'true');

        const trigger = productSelect.querySelector('.product-select-trigger');
        const menu = productSelect.querySelector('.product-select-menu');

        trigger.addEventListener('click', function() {
            const isOpen = productSelect.classList.contains('is-open');
            closeAllProductDropdowns();
            if (!isOpen) {
                openProductDropdown(index);
            }
        });

        trigger.addEventListener('keydown', function(event) {
            if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openProductDropdown(index);
                focusProductOption(menu, balloonTypeSelect.value);
            }
        });

        menu.addEventListener('click', function(event) {
            const optionButton = event.target.closest('.product-select-option');
            if (!optionButton || optionButton.disabled) return;
            chooseProductDropdownOption(index, optionButton.dataset.value);
        });

        menu.addEventListener('keydown', function(event) {
            const optionButton = event.target.closest('.product-select-option');
            if (!optionButton) return;

            if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                event.preventDefault();
                const direction = event.key === 'ArrowDown' ? 1 : -1;
                focusAdjacentProductOption(menu, optionButton, direction);
            }

            if (event.key === 'Escape') {
                event.preventDefault();
                closeAllProductDropdowns();
                trigger.focus();
            }
        });

        balloonTypeSelect.addEventListener('invalid', function() {
            productSelect.classList.add('is-invalid');
            trigger.focus();
        });

        productSelect.dataset.dropdownReady = 'true';
        renderProductDropdown(index);
    }

    function renderProductDropdown(index) {
        const balloonTypeSelect = document.getElementById(`balloonType_${index}`);
        const productSelect = balloonTypeSelect && balloonTypeSelect.closest('.product-select');
        const menu = productSelect && productSelect.querySelector('.product-select-menu');
        if (!balloonTypeSelect || !productSelect || !menu) return;

        const options = Array.from(balloonTypeSelect.options);
        menu.innerHTML = '';

        options.forEach((option, optionIndex) => {
            const optionButton = document.createElement('button');
            optionButton.type = 'button';
            optionButton.className = 'product-select-option';
            optionButton.dataset.value = option.value;
            optionButton.textContent = option.textContent;
            optionButton.setAttribute('role', 'option');
            optionButton.setAttribute('aria-selected', option.selected ? 'true' : 'false');
            optionButton.tabIndex = -1;

            if (option.disabled || (optionIndex === 0 && !option.value && options.length === 1)) {
                optionButton.disabled = true;
            }

            if (option.selected) {
                optionButton.classList.add('is-selected');
            }

            menu.appendChild(optionButton);
        });

        syncProductDropdown(index);
    }

    function syncProductDropdown(index) {
        const balloonTypeSelect = document.getElementById(`balloonType_${index}`);
        const productSelect = balloonTypeSelect && balloonTypeSelect.closest('.product-select');
        if (!balloonTypeSelect || !productSelect) return;

        const triggerLabel = productSelect.querySelector('.product-select-label');
        const selectedOption = balloonTypeSelect.options[balloonTypeSelect.selectedIndex];
        const fallbackOption = balloonTypeSelect.options[0];
        const labelText = selectedOption ? selectedOption.textContent : (fallbackOption ? fallbackOption.textContent : '상품을 선택해 주세요');

        if (triggerLabel) {
            triggerLabel.textContent = labelText;
        }

        productSelect.classList.toggle('has-value', Boolean(balloonTypeSelect.value));
        productSelect.classList.remove('is-invalid');

        productSelect.querySelectorAll('.product-select-option').forEach(optionButton => {
            const isSelected = optionButton.dataset.value === balloonTypeSelect.value;
            optionButton.classList.toggle('is-selected', isSelected);
            optionButton.setAttribute('aria-selected', isSelected ? 'true' : 'false');
        });
    }

    function openProductDropdown(index) {
        const balloonTypeSelect = document.getElementById(`balloonType_${index}`);
        const productSelect = balloonTypeSelect && balloonTypeSelect.closest('.product-select');
        const trigger = productSelect && productSelect.querySelector('.product-select-trigger');
        if (!balloonTypeSelect || !productSelect || !trigger) return;

        productSelect.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
        positionProductDropdown(productSelect);
    }

    function closeAllProductDropdowns() {
        document.querySelectorAll('.product-select.is-open').forEach(productSelect => {
            productSelect.classList.remove('is-open', 'is-upward');
            const trigger = productSelect.querySelector('.product-select-trigger');
            if (trigger) {
                trigger.setAttribute('aria-expanded', 'false');
            }
        });
    }

    function chooseProductDropdownOption(index, value) {
        const balloonTypeSelect = document.getElementById(`balloonType_${index}`);
        const productSelect = balloonTypeSelect && balloonTypeSelect.closest('.product-select');
        const trigger = productSelect && productSelect.querySelector('.product-select-trigger');
        if (!balloonTypeSelect) return;

        balloonTypeSelect.value = value;
        balloonTypeSelect.dispatchEvent(new Event('change', { bubbles: true }));
        closeAllProductDropdowns();

        if (trigger) {
            trigger.focus();
        }
    }

    function positionProductDropdown(productSelect) {
        const menu = productSelect.querySelector('.product-select-menu');
        if (!menu) return;

        productSelect.classList.remove('is-upward');
        const selectRect = productSelect.getBoundingClientRect();
        const menuHeight = Math.min(menu.scrollHeight, 360);
        const spaceBelow = window.innerHeight - selectRect.bottom;
        const spaceAbove = selectRect.top;

        if (spaceBelow < menuHeight && spaceAbove > spaceBelow) {
            productSelect.classList.add('is-upward');
        }
    }

    function focusProductOption(menu, selectedValue) {
        const selectedOption = menu.querySelector(`.product-select-option[data-value="${CSS.escape(selectedValue)}"]:not(:disabled)`);
        const firstOption = menu.querySelector('.product-select-option:not(:disabled)');
        const targetOption = selectedOption || firstOption;
        if (targetOption) {
            targetOption.focus();
        }
    }

    function focusAdjacentProductOption(menu, currentOption, direction) {
        const options = Array.from(menu.querySelectorAll('.product-select-option:not(:disabled)'));
        const currentIndex = options.indexOf(currentOption);
        if (currentIndex === -1) return;

        const nextIndex = (currentIndex + direction + options.length) % options.length;
        options[nextIndex].focus();
    }

    function refreshAllProductDropdowns() {
        document.querySelectorAll('.balloon-type-select').forEach(select => {
            const index = select.dataset.index || 0;
            syncProductDropdown(index);
            toggleProductOptions(index);
        });
    }

    function toggleProductOptions(index) {
        const balloonTypeSelect = document.getElementById(`balloonType_${index}`);
        const quantityOptions = document.getElementById(`quantityOptions_${index}`);
        const quantityHint = document.getElementById(`quantityHint_${index}`);
        const letteringOptions = document.getElementById(`letteringOptions_${index}`);
        const clearBalloonNotice = document.getElementById(`clearBalloonNotice_${index}`);
        const productThumbnail = document.getElementById(`productThumbnail_${index}`);

        if (!balloonTypeSelect) return;

        const selectedValue = balloonTypeSelect.value;
        const orderTypeValue = orderType.value;

        // 모든 옵션 숨기기
        if (quantityOptions) quantityOptions.style.display = 'none';
        if (letteringOptions) letteringOptions.style.display = 'none';
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
                    if (quantityHint) {
                        quantityHint.style.display = selectedProduct.hideQuantityHint ? 'none' : 'block';
                    }
                }

                // 레터링 옵션 표시
                if (selectedProduct.hasLettering && letteringOptions) {
                    letteringOptions.style.display = 'block';
                }

                // 특별 안내사항 표시
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
            const noImagePlaceholder = 'data:image/svg+xml;utf8,' + encodeURIComponent(
                '<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150"><rect width="150" height="150" fill="#cccccc"/><text x="50%" y="50%" font-size="14" fill="#666666" text-anchor="middle" dominant-baseline="middle">이미지 없음</text></svg>'
            );
            // 이미지 로드 에러 처리 (src 대입 전에 등록해야 즉시 실패도 잡힘)
            productImage.onerror = function() {
                this.onerror = null;
                this.src = noImagePlaceholder;
            };
            productImage.src = product.imageUrl || noImagePlaceholder;
            productImage.alt = product.text;
            thumbnailName.textContent = product.text;
            thumbnailPrice.textContent = product.priceText;
            productThumbnail.style.display = 'block';
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

        updateOrderSummary();
    }

    // 제출 버튼 위 "📋 주문 요약" 박스 갱신
    function updateOrderSummary() {
        const summaryContent = document.querySelector('#orderSummary .summary-content');
        if (!summaryContent) return;

        const productSections = document.querySelectorAll('.product-section');
        const items = [];
        let totalPrice = 0;
        productSections.forEach(section => {
            const index = section.dataset.productIndex;
            const summary = getProductSummary(index);
            if (summary) {
                items.push(summary);
                totalPrice += summary.price;
            }
        });

        if (items.length === 0) {
            summaryContent.innerHTML = '<p>선택사항을 모두 입력하시면 여기에 주문 요약이 표시됩니다.</p>';
            return;
        }

        const itemsHtml = items.map(item => `
            <div class="summary-order-item">
                <span>${item.name}</span>
                <span>${Math.round(item.price).toLocaleString()}원</span>
            </div>
        `).join('');

        summaryContent.innerHTML = `
            ${itemsHtml}
            <div class="summary-order-total">
                <strong>총 합계</strong>
                <strong>${Math.round(totalPrice).toLocaleString()}원</strong>
            </div>
        `;
    }

    function getProductSummary(index) {
        const balloonTypeSelect = document.getElementById(`balloonType_${index}`);
        const quantitySelect = document.getElementById(`balloonQuantity_${index}`);
        const customQuantityInput = document.getElementById(`customQuantityInput_${index}`);

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
        
        if (selectedProduct.hasLettering) {
            const letteringText = collectLetteringText(index);
            if (letteringText) {
                details += `<br>레터링: "${letteringText.replace(/\n/g, ' / ')}"`;
            }
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

        if (usageDateInput) {
            usageDateInput.min = threeDaysLater.toISOString().split('T')[0];
        }
    }

    function toggleDeliveryDetails() {
        const deliveryRadios = document.querySelectorAll('input[name="deliveryMethod"]');
        const pickupDetails = document.getElementById('pickupDetails');
        const deliveryDetails = document.getElementById('deliveryDetails');
        const directDetails = document.getElementById('directDetails');
        const selectedMethod = document.querySelector('input[name="deliveryMethod"]:checked')?.value;
        
        // 모든 상세 옵션 숨기기
        [pickupDetails, deliveryDetails, directDetails].forEach(detail => {
            if (detail) detail.style.display = 'none';
        });

        if (selectedMethod !== 'pickup') {
            const preferredHour = document.getElementById('preferredHour');
            const preferredMinute = document.getElementById('preferredMinute');
            if (preferredHour) preferredHour.value = '';
            if (preferredMinute) preferredMinute.value = '';
        }
        
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

        const submitBtn = form.querySelector('.submit-btn');
        const originalBtnText = submitBtn.innerHTML;

        try {
            const formData = new FormData(form);
            const orderData = {
                customer: {
                    name: formData.get('customerName'),
                    phone: formData.get('customerPhone')
                },
                products: [],
                delivery: {
                    method: formData.get('deliveryMethod'),
                    pickupLocation: formData.get('pickupLocation'),
                    address: formData.get('deliveryAddress') || formData.get('directAddress'),
                    phone: formData.get('deliveryPhone')
                },
                schedule: {
                    usageDate: formData.get('usageDate'),
                    // 희망 출고일 입력란은 폼에서 제거됨. DB의 desired_date가
                    // NOT NULL이라 실제 사용일 값을 그대로 채워 넣음
                    desiredDate: formData.get('usageDate'),
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

            const message = formatKakaoMessage(orderData, null);
            showKakaoSendModal(message, submitBtn, originalBtnText);

            // Supabase 저장은 카카오 전송 흐름을 막지 않도록 별도로 진행 (실패해도 무관)
            submitOrderToDatabase(buildDbPayload(orderData, formData))
                .then(dbResult => {
                    if (dbResult.success) {
                        console.log(`✅ 데이터베이스 저장 완료: ${dbResult.orderNumber}`);
                    } else {
                        console.log('📝 데이터베이스 저장 실패:', dbResult.error || dbResult.reason);
                    }
                })
                .catch(dbError => console.log('📝 데이터베이스 연결 실패:', dbError));
        } catch (error) {
            console.error('주문 제출 중 오류:', error);
            alert('주문 제출 중 오류가 발생했습니다. 다시 시도해주세요.');
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    }

    // 다중 상품 주문 데이터를 단일상품 기준 DB 스키마에 맞게 변환
    function buildDbPayload(orderData, formData) {
        const productSummary = orderData.products
            .map(p => p.quantity ? `${p.type} x${p.quantity}` : p.type)
            .join(', ');
        const letteringSummary = orderData.products
            .filter(p => p.lettering && p.lettering.text)
            .map(p => `[${p.type}] ${p.lettering.text}`)
            .join('\n');
        const productDetailsText = orderData.products
            .map((p, i) => {
                let line = `${i + 1}. ${p.type}`;
                if (p.quantity) line += ` x${p.quantity}`;
                if (p.totalPrice) line += ` = ${Math.round(p.totalPrice).toLocaleString()}원`;
                return line;
            })
            .join('\n');

        return {
            customerName: orderData.customer.name,
            customerPhone: orderData.customer.phone,
            orderType: orderType.value,
            balloonType: productSummary.slice(0, 100),
            letteringText: letteringSummary || null,
            extraOptions: orderData.products,
            orderDetails: `[주문 상품]\n${productDetailsText}\n\n[상세 요청사항]\n${orderData.notes || ''}`,
            deliveryMethod: orderData.delivery.method,
            pickupLocation: formData.get('pickupLocation') || null,
            pickupTime: orderData.delivery.method === 'pickup' ? orderData.schedule.pickupTime || null : null,
            deliveryAddress: formData.get('deliveryAddress') || null,
            deliveryPhone: formData.get('deliveryPhone') || null,
            directAddress: formData.get('directAddress') || null,
            usageDate: orderData.schedule.usageDate,
            desiredDate: orderData.schedule.desiredDate,
            timePreference: orderData.schedule.pickupTime || null,
            additionalNotes: orderData.additionalNotes || null
        };
    }

    // 카카오톡 메시지 포맷팅
    function formatKakaoMessage(orderData, orderNumber) {
        let message = `🎈 모엔브 새 주문 문의\n\n`;

        if (orderNumber) {
            message += `📋 주문번호: ${orderNumber}\n\n`;
        }

        message += `👤 고객 정보\n`;
        message += `이름: ${orderData.customer.name}\n`;
        message += `연락처: ${orderData.customer.phone}\n`;

        message += `\n📋 주문 유형: ${getOrderTypeText(orderType.value)}\n`;

        message += `\n🎈 주문 상품\n`;
        orderData.products.forEach((p, i) => {
            let line = `${i + 1}. ${p.type}`;
            if (p.quantity) line += ` × ${p.quantity}개`;
            if (p.totalPrice) {
                line += ` = ${Math.round(p.totalPrice).toLocaleString()}원${p.discount ? ' (10% 할인 적용)' : ''}`;
            } else {
                line += ` (${p.price.toLocaleString()}원)`;
            }
            message += line + '\n';
            if (p.lettering && p.lettering.text) {
                message += `   ✏️ 레터링: "${p.lettering.text}"\n`;
            }
        });

        message += `\n📝 상세 요청사항\n${orderData.notes || '(없음)'}\n`;

        if (orderData.additionalNotes) {
            message += `\n📝 추가 요청사항\n${orderData.additionalNotes}\n`;
        }

        message += `\n🚚 수령 방법\n`;
        if (orderData.delivery.method === 'pickup') {
            message += `픽업 (${orderData.delivery.pickupLocation ? getLocationText(orderData.delivery.pickupLocation) : '장소 미선택'})\n`;
            message += `픽업 희망시간: ${orderData.schedule.pickupTime || '영업시간 내 연락 후 조율'}\n`;
        } else if (orderData.delivery.method === 'delivery') {
            message += `택배 배송\n주소: ${orderData.delivery.address}\n`;
            if (orderData.delivery.phone) {
                message += `받을 분 연락처: ${orderData.delivery.phone}\n`;
            }
        } else if (orderData.delivery.method === 'direct') {
            message += `직접 배송\n주소: ${orderData.delivery.address}\n`;
        }

        message += `\n📅 일정\n`;
        if (orderData.schedule.usageDate) {
            message += `사용/수령일: ${formatOrderDate(orderData.schedule.usageDate)}\n`;
        }

        message += `\n✅ 확인사항\n- 주문 안내사항 확인 및 동의\n- 취소/환불 정책 동의\n- 상담 연락 동의\n`;

        return message;
    }

    function formatOrderDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
        return `${date.getFullYear()}년 ${String(date.getMonth() + 1).padStart(2, '0')}월 ${String(date.getDate()).padStart(2, '0')}일 (${weekdays[date.getDay()]})`;
    }

    function getOrderTypeText(value) {
        const types = { helium: '헬륨 풍선', air: '공기 풍선', consultation: '상담 후 결정' };
        return types[value] || value;
    }

    function getLocationText(value) {
        const locations = { dongtan: '동탄 본점', 'dongtan-moenv': '동탄 본점', 'dongtan-main': '동탄 본점' };
        return locations[value] || value;
    }

    function getPickupTimeText(value) {
        const times = { morning: '오전 (9시-12시)', afternoon: '오후 (12시-18시)', evening: '저녁 (18시-21시)' };
        return times[value] || value;
    }

    // window.open으로 카카오 채팅창을 자동으로 띄우는 방식은 브라우저/인앱
    // 웹뷰마다 동작이 들쭉날쭉해서(빈 화면만 뜨거나 팝업이 막히는 경우가 있음)
    // 안내 모달 안의 실제 <a href target="_blank"> 링크를 직접 클릭하게 한다.
    // 클립보드 복사는 되면 좋은 보조 기능일 뿐, 텍스트는 항상 textarea에도
    // 그대로 보여줘서 클립보드가 안 되더라도 직접 선택해 복사할 수 있게 한다.
    function showKakaoSendModal(message, submitBtn, originalBtnText) {
        const modal = document.getElementById('kakaoSendModal');
        const textarea = document.getElementById('kakaoMessageText');
        const statusEl = document.getElementById('kakaoCopyStatus');

        textarea.value = message;
        statusEl.textContent = '';
        modal.style.display = 'flex';

        textarea.focus();
        textarea.select();

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(message)
                .then(() => { statusEl.textContent = '📋 주문 내용이 클립보드에 복사되었습니다. 붙여넣기(Ctrl/Cmd+V)만 하면 됩니다.'; })
                .catch(() => { statusEl.textContent = '아래 내용을 직접 선택해 복사(Ctrl/Cmd+C)한 뒤 전송해 주세요.'; });
        } else {
            statusEl.textContent = '아래 내용을 직접 선택해 복사(Ctrl/Cmd+C)한 뒤 전송해 주세요.';
        }

        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
    }

    function closeKakaoSendModal() {
        document.getElementById('kakaoSendModal').style.display = 'none';
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
                text: collectLetteringText(index)
            };
        }


        return productData;
    }
});
