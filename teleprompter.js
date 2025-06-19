document.addEventListener('DOMContentLoaded', () => {
    // --- VISTAS E ELEMENTOS PRINCIPAIS ---
    const editorView = document.getElementById('editor-view');
    const prompterView = document.getElementById('prompter-view');
    const scriptInput = document.getElementById('script-input');
    const startBtn = document.getElementById('start-btn');
    const teleprompterText = document.getElementById('teleprompter-text');
    
    // --- ELEMENTOS DOS CONTROLES ---
    const startStopBtn = document.getElementById('start-stop-btn');
    const speedUpBtn = document.getElementById('speed-up-btn');
    const speedDownBtn = document.getElementById('speed-down-btn');
    const speedIndicator = document.getElementById('speed-indicator');
    const mirrorBtn = document.getElementById('mirror-btn');
    const backToEditBtn = document.getElementById('back-to-edit-btn');

    // --- ESTADO DO TELEPROMPTER ---
    let scrollInterval = null;
    let scrollSpeed = 10;

    // --- FUNÇÕES ---

    // Carrega o script do localStorage para o <textarea>
    function loadScript() {
        const savedScript = localStorage.getItem('teleprompterScript');
        if (savedScript) {
            scriptInput.value = savedScript;
        }
    }

    // Prepara e mostra o teleprompter
    function startPrompter() {
        const scriptText = scriptInput.value;
        if (scriptText.trim() === '') {
            alert('Por favor, cole um roteiro antes de iniciar.');
            return;
        }

        // Salva o roteiro no localStorage
        localStorage.setItem('teleprompterScript', scriptText);
        
        // Limpa o texto antigo e insere o novo, quebrando por linhas
        teleprompterText.innerHTML = '';
        const lines = scriptText.split('\n');
        lines.forEach(line => {
            const p = document.createElement('p');
            p.textContent = line || ' '; // Adiciona parágrafo em branco para pausas
            teleprompterText.appendChild(p);
        });
        
        // Troca as telas
        editorView.classList.add('hidden');
        prompterView.classList.remove('hidden');
        window.scrollTo(0, 0); // Garante que a rolagem comece do topo
    }

    // Funções de controle de rolagem (iguais às de antes)
    function startScrolling() {
        if (scrollInterval) return;
        scrollInterval = setInterval(() => { window.scrollBy(0, 1); }, 110 - (scrollSpeed * 10));
    }
    function stopScrolling() {
        clearInterval(scrollInterval);
        scrollInterval = null;
    }
    function updateSpeedIndicator() {
        speedIndicator.textContent = scrollSpeed;
    }

    // --- EVENT LISTENERS ---

    // Botão para iniciar o teleprompter a partir da tela de edição
    startBtn.addEventListener('click', startPrompter);

    // Botão para voltar para a tela de edição
    backToEditBtn.addEventListener('click', () => {
        stopScrolling();
        prompterView.classList.add('hidden');
        editorView.classList.remove('hidden');
    });

    // Controles do teleprompter (start/stop, velocidade, espelho)
    startStopBtn.addEventListener('click', () => {
        if (scrollInterval) {
            stopScrolling();
            startStopBtn.textContent = 'START';
        } else {
            startScrolling();
            startStopBtn.textContent = 'STOP';
        }
    });
    speedUpBtn.addEventListener('click', () => {
        if (scrollSpeed < 20) { scrollSpeed++; updateSpeedIndicator(); if(scrollInterval){ stopScrolling(); startScrolling(); } }
    });
    speedDownBtn.addEventListener('click', () => {
        if (scrollSpeed > 1) { scrollSpeed--; updateSpeedIndicator(); if(scrollInterval){ stopScrolling(); startScrolling(); } }
    });
    mirrorBtn.addEventListener('click', () => {
        teleprompterText.classList.toggle('mirrored');
    });

    // --- INICIALIZAÇÃO ---
    loadScript(); // Carrega o último roteiro salvo ao abrir a página
    updateSpeedIndicator();
});
