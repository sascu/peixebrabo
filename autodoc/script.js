document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicialização das Assinaturas
    const canvasAdmin = document.getElementById('pad-admin');
    const canvasTecnico = document.getElementById('pad-tecnico');

    // Configuração: Fundo Preto e Caneta Branca para facilitar a visão no celular
    const padOptions = { 
        backgroundColor: 'rgb(0, 0, 0)', 
        penColor: 'rgb(255, 255, 255)' 
    };

    const padAdmin = new SignaturePad(canvasAdmin, padOptions);
    const padTecnico = new SignaturePad(canvasTecnico, padOptions);

    window.padAdmin = padAdmin;
    window.padTecnico = padTecnico;

    // Função para inverter as cores da assinatura (Branco no Preto -> Preto no Branco)
    function getInvertedDataURL(canvas) {
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;

        // Desenha a assinatura original
        tempCtx.drawImage(canvas, 0, 0);

        // Inverte as cores
        tempCtx.globalCompositeOperation = 'difference';
        tempCtx.fillStyle = 'white';
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

        return tempCanvas.toDataURL();
    }

    // Atualiza a imagem no relatório automaticamente ao terminar o traço
    [padAdmin, padTecnico].forEach((pad, index) => {
        const targetImgId = index === 0 ? 'img-admin' : 'img-tecnico';
        const canvas = index === 0 ? canvasAdmin : canvasTecnico;

        pad.addEventListener("endStroke", () => {
            const invertedUrl = getInvertedDataURL(canvas);
            document.getElementById(targetImgId).src = invertedUrl;
        });
    });

    // 2. Sincronização em Tempo Real (Inputs para o Documento)
    const inputMappings = [
        'data', 'chamado', 'inicio', 'fim', 'cliente', 'obra', 
        'endereco', 'cidade', 'desloc', 'telefone', 'eng', 
        'escopo', 'v-versao', 'v-down', 'v-up', 'v-quais', 
        'c-serie', 'admin-nome', 'tecnico-nome', 'porteiro'
    ];

    inputMappings.forEach(id => {
        const inputEl = document.getElementById(`in-${id}`);
        const outputEl = document.getElementById(`out-${id}`);
        if (inputEl && outputEl) {
            inputEl.addEventListener('input', () => {
                outputEl.innerText = inputEl.value;
            });
        }
    });

    window.syncCheck = function(id, checked) {
        const outEl = document.getElementById(`out-${id}`);
        if (outEl) outEl.innerText = checked ? '▣' : '□';
    };

    window.syncYN = function(prefix, choice) {
        const outSim = document.getElementById(`${prefix}-s-out`);
        const outNao = document.getElementById(`${prefix}-n-out`);
        if (choice === 's') {
            outSim.innerText = 'X'; outNao.innerText = '';
        } else {
            outSim.innerText = ''; outNao.innerText = 'X';
        }
    };

    // 3. Geração de PDF Otimizada para Mobile
    window.downloadPDF = function() {
        const element = document.getElementById('rat-render');
        const numChamado = document.getElementById('in-chamado').value || '000';
        
        // Bloqueia interações durante o processamento
        const btn = document.querySelector('.generate-btn');
        const originalText = btn.innerText;
        btn.innerText = "PROCESSANDO...";
        btn.disabled = true;

        const opt = {
            margin: 0,
            filename: `RAT_${numChamado}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { 
                scale: 2, 
                useCORS: true, 
                letterRendering: true,
                width: 794, // Largura fixa de um A4 em pixels
                windowWidth: 794 // Força o navegador a renderizar como desktop
            },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).save().then(() => {
            btn.innerText = originalText;
            btn.disabled = false;
        });
    };

    // Ajuste de DPI para os Canvas de Assinatura
    function resizeCanvas() {
        const ratio = Math.max(window.devicePixelRatio || 1, 1);
        [canvasAdmin, canvasTecnico].forEach(canvas => {
            canvas.width = canvas.offsetWidth * ratio;
            canvas.height = canvas.offsetHeight * ratio;
            canvas.getContex