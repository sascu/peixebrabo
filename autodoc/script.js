document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicialização das Assinaturas
    const canvasAdmin = document.getElementById('pad-admin');
    const canvasTecnico = document.getElementById('pad-tecnico');

    // CONFIGURAÇÃO PARA O TÉCNICO ENXERGAR: Fundo Preto e Caneta Branca
    const padOptions = { 
        backgroundColor: 'rgb(0, 0, 0)', 
        penColor: 'rgb(255, 255, 255)' 
    };

    const padAdmin = new SignaturePad(canvasAdmin, padOptions);
    const padTecnico = new SignaturePad(canvasTecnico, padOptions);

    window.padAdmin = padAdmin;
    window.padTecnico = padTecnico;

    // Função Mágica para inverter as cores da imagem (Preto/Branco -> Branco/Preto)
    function getInvertedDataURL(canvas) {
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;

        // Desenha a assinatura original
        tempCtx.drawImage(canvas, 0, 0);

        // Inverte as cores (O que é branco vira preto, o que é preto vira branco)
        tempCtx.globalCompositeOperation = 'difference';
        tempCtx.fillStyle = 'white';
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

        return tempCanvas.toDataURL();
    }

    // Atualiza a imagem no relatório invertendo as cores
    [padAdmin, padTecnico].forEach((pad, index) => {
        const targetImgId = index === 0 ? 'img-admin' : 'img-tecnico';
        const canvas = index === 0 ? canvasAdmin : canvasTecnico;

        pad.addEventListener("endStroke", () => {
            // Pegamos a assinatura (branca/preta) e convertemos para (preta/branca)
            const invertedUrl = getInvertedDataURL(canvas);
            document.getElementById(targetImgId).src = invertedUrl;
        });
    });

    // 2. Sincronização em Tempo Real (Inputs)
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

    // 4. Geração de PDF
    window.downloadPDF = function() {
        const element = document.getElementById('rat-render');
        const numChamado = document.getElementById('in-chamado').value || '000';
        const originalWidth = element.style.width;
        element.style.width = "800px"; 

        const opt = {
            margin: 0,
            filename: `RAT_${numChamado}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 3, useCORS: true, letterRendering: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).save().then(() => {
            element.style.width = originalWidth;
        });
    };

    function resizeCanvas() {
        const ratio = Math.max(window.devicePixelRatio || 1, 1);
        [canvasAdmin, canvasTecnico].forEach(canvas => {
            canvas.width = canvas.offsetWidth * ratio;
            canvas.height = canvas.offsetHeight * ratio;
            canvas.getContext("2d").scale(ratio, ratio);
        });
        padAdmin.clear();
        padTecnico.clear();
    }

    window.onresize = resizeCanvas;
    resizeCanvas();
});