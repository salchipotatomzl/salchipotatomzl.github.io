document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTOS DEL DOM ---
    const body = document.body;
    const preloader = document.getElementById('preloader');
    const videoBackground = document.getElementById('video-background');
    const homeSection = document.getElementById('home');
    const scannerTitle = document.getElementById('scanner-title');
    const sonarContainer = document.getElementById('sonar-container');
    const interactionZone = document.getElementById('interaction-zone');
    const hungerButtons = document.querySelectorAll('.hunger-btn');
    const comboDisplaySection = document.getElementById('combo-display');
    const comboDetailsContainer = document.getElementById('combo-details-container');
    const backToScannerBtn = document.getElementById('back-to-scanner-btn');
    const missionDataModal = document.getElementById('mission-data-modal');
    const closeModalFormBtn = document.getElementById('close-modal-form-btn');
    const orderForm = document.getElementById('order-form');
    const missionComboName = document.getElementById('mission-combo-name');
    const welcomeBackMessage = document.getElementById('welcome-back-message');
    const shockwaveContainer = document.getElementById('shockwave-container');
    const progressModal = document.getElementById('progress-modal');
    const progressIcon = document.getElementById('progress-icon');
    const progressText = document.getElementById('progress-text');
    const progressBarInner = document.getElementById('progress-bar-inner');

    let selectedCombo = {};

    const combos = {
        1: { name: "El Egoísta", price: "22.000", img: "img/Combo.jpg", details: ["Salchipapa personal con todo", "Queso gratinado", "Gaseosa personal"] },
        2: { name: "Dúo Dinamita", price: "38.000", img: "img/Combo.jpg", details: ["Salchipapa para dos con doble proteína", "Trozos de chicharrón", "Queso extra y salsas de la casa", "2 Gaseosas personales"] },
        3: { name: "El Devastador", price: "45.000", img: "img/combo-devastador.jpg", details: ["Base gigante de papas (francesa y criolla)", "Costilla al barril y chicharrón", "Queso gratinado, guacamole y pico de gallo", "Gaseosa 1.5L"] }
    };

    const sonarBlips = ['🌭', '🍔', '🍟', '🌮', '🍕'];
    let sonarInterval;

    // --- INICIALIZACIÓN ---
    function init() {
        window.addEventListener('load', () => {
            preloader.style.opacity = '0';
            setTimeout(() => { preloader.style.display = 'none'; }, 500);
            
            showSection('home');
            startSonarAnimation();

            setTimeout(() => {
                stopSonarAnimation();
                scannerTitle.style.display = 'none';
                sonarContainer.style.display = 'none';
                interactionZone.style.display = 'block';
            }, 6000); // Duración del radar aumentada a 7 segundos
        });
    }

    // --- LÓGICA DE NAVEGACIÓN (CORREGIDA Y ROBUSTA) ---
    function showSection(sectionId) {
        document.querySelectorAll('main > section').forEach(section => {
            section.style.display = (section.id === sectionId) ? 'block' : 'none';
        });
        videoBackground.classList.toggle('hidden', sectionId !== 'home');
        body.classList.toggle('combo-view-active', sectionId === 'combo-display');
    }

    hungerButtons.forEach(button => {
        button.addEventListener('click', () => {
            const level = button.dataset.level;
            vibrate();
            showCombo(level);
        });
    });

    backToScannerBtn.addEventListener('click', () => {
        vibrate();
        showSection('home');
        scannerTitle.style.display = 'block';
        sonarContainer.style.display = 'block';
        interactionZone.style.display = 'none';
        startSonarAnimation();
        setTimeout(() => {
            stopSonarAnimation();
            scannerTitle.style.display = 'none';
            sonarContainer.style.display = 'none';
            interactionZone.style.display = 'block';
        }, 7000); // Duración del radar aumentada
    });

    function showCombo(level) {
        selectedCombo = combos[level];
        const listItems = selectedCombo.details.map((item, index) => 
            `<li style="animation-delay: ${index * 0.15}s">${item}</li>`
        ).join('');

        const comboHTML = `
            <div class="combo-image">
                <img src="${selectedCombo.img}" alt="${selectedCombo.name}">
            </div>
            <div class="combo-info">
                <h2>${selectedCombo.name}</h2>
                <p class="price">$${selectedCombo.price} COP</p>
                <ul>${listItems}</ul>
                <div class="review-card">
                    <div class="review-header">
                        <span class="review-source">Google Reviews</span>
                        <span class="stars">4.8 ⭐⭐⭐⭐⭐</span>
                    </div>
                    <div class="review-body">
                        <p>"De los mejor calificados un combo. ¡Brutal!"</p>
                        <span>- Cliente Verificado</span>
                    </div>
                </div>
                <button class="main-cta-btn" id="prepare-launch-btn">¡LO QUIERO AHORA!</button>
            </div>
        `;
        comboDetailsContainer.innerHTML = comboHTML;

        showSection('combo-display');

        document.getElementById('prepare-launch-btn').addEventListener('click', () => {
            vibrate();
            checkForUserData();
            missionComboName.textContent = selectedCombo.name;
            missionDataModal.style.display = 'flex';
        });
    }

    // --- LÓGICA DEL FORMULARIO INTELIGENTE ---
    closeModalFormBtn.addEventListener('click', () => missionDataModal.style.display = 'none');

    function checkForUserData() {
        const savedName = localStorage.getItem('salchipotato_agent_name');
        if (savedName) {
            document.getElementById('nombre-agente').value = savedName;
            document.getElementById('zona-impacto').value = localStorage.getItem('salchipotato_agent_address') || '';
            welcomeBackMessage.innerHTML = `¡Hola de nuevo, <strong>${savedName}</strong>! Tus datos están listos.`;
            welcomeBackMessage.style.display = 'block';
        } else {
            welcomeBackMessage.style.display = 'none';
        }
    }

    orderForm.addEventListener('submit', (e) => {
        e.preventDefault();
        vibrate(150);
        missionDataModal.style.display = 'none';
        
        // Iniciar la secuencia de la barra de progreso
        startProgressSequence(e.clientX, e.clientY);
    });

    // --- SECUENCIA DE BARRA DE PROGRESO Y LANZAMIENTO ---
    function startProgressSequence(clickX, clickY) {
        progressModal.style.display = 'flex';
        createShockwave(clickX, clickY); // Mover la explosión aquí
        
        const nombreAgente = document.getElementById('nombre-agente').value;
        const zonaImpacto = document.getElementById('zona-impacto').value;
        localStorage.setItem('salchipotato_agent_name', nombreAgente);
        localStorage.setItem('salchipotato_agent_address', zonaImpacto);

        // Etapa 1
        setTimeout(() => {
            progressIcon.innerHTML = '🍟';
            progressText.textContent = 'CARGANDO PEDIDO...';
            progressBarInner.style.width = '33%';
        }, 100);

        // Etapa 2
        setTimeout(() => {
            progressIcon.innerHTML = '🎯';
            progressText.textContent = 'SOLICITANDO ORDEN DEL ANTOJO...';
            progressBarInner.style.width = '66%';
        }, 2000);

        // Etapa 3
        setTimeout(() => {
            progressIcon.innerHTML = '📡';
            progressText.textContent = 'ESTABLECIENDO COMUNICACIÓN CON SALCHIPOTATO...';
            progressBarInner.style.width = '100%';
        }, 4000);

        // Lanzamiento final
        setTimeout(() => {
            launchWhatsApp(nombreAgente, zonaImpacto);
        }, 5500);
    }

    function launchWhatsApp(nombre, direccion) {
        const comboName = selectedCombo.name;
        const text = `¡Protocolo Hambre Cero Activado!\n\n💣 *COMBO:* ${comboName}\n👤 *NOMBRE:* ${nombre}\n📍 *DIRECCION:* ${direccion}\n\n¡Espero mi arsenal para aniquilar el hambre!`;
        const whatsappUrl = `https://wa.me/573233362016?text=${encodeURIComponent(text)}`;
        window.open(whatsappUrl, '_blank');
        setTimeout(() => window.location.reload(), 1000);
    }

    // --- EFECTOS VISUALES Y HÁPTICOS ---
    function startSonarAnimation() { /* ... (código sin cambios) ... */ }
    function stopSonarAnimation() { /* ... (código sin cambios) ... */ }
    function vibrate(duration = 50) { if (navigator.vibrate) navigator.vibrate(duration); }

    function createShockwave(x, y) {
        const shockwave = document.createElement('div');
        shockwave.className = 'shockwave';
        shockwave.style.left = `${x}px`;
        shockwave.style.top = `${y}px`;
        shockwaveContainer.appendChild(shockwave);
        setTimeout(() => shockwave.remove(), 750);
    }

    // Iniciar la aplicación
    init();
});
