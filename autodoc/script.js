document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicialização das Assinaturas
    const canvasAdmin = document.getElementById('pad-admin');
    const canvasTecnico = document.getElementById('pad-tecnico');

    const padOptions = { backgroundColor: 'rgb(0, 0, 0)', penColor: 'rgb(255, 255, 255)' };
    const padAdmin = new SignaturePad(canvasAdmin, padOptions);
    const padTecnico = new SignaturePad(canvasTecnico, padOptions);

    window.padAdmin = padAdmin;
    window.padTecnico = padTecnico;

    // Função para inverter cores da assinatura (Branco -> Preto)
    function getInvertedDataURL(canvas) {
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        tempCtx.drawImage(canvas, 0, 0);
        tempCtx.globalCompositeOperation = 'difference';
        tempCtx.fillStyle = 'white';
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
        return tempCanvas.toDataURL();
    }

    [padAdmin, padTecnico].forEach((pad, index) => {
        const targetImgId = index === 0 ? 'img-admin' : 'img-tecnico';
        const canvas = index === 0 ? canvasAdmin : canvasTecnico;
        pad.addEventListener("endStroke", () => {
            document.getElementById(targetImgId).src = getInvertedDataURL(canvas);
        });
    });

    // 2. Sincronização de Campos
    const inputMappings = ['data', 'chamado', 'inicio', 'fim', 'cliente', 'obra', 'endereco', 'cidade', 'desloc', 'telefone', 'eng', 'escopo', 'v-versao', 'v-down', 'v-up', 'v-quais', 'c-serie', 'admin-nome', 'tecnico-nome', 'porteiro'];
    inputMappings.forEach(id => {
        const inputEl = document.getElementById(`in-${id}`);
        const outputEl = document.getElementById(`out-${id}`);
        if (inputEl && outputEl) {
            inputEl.addEventListener('input', () => { outputEl.innerText = inputEl.value; });
        }
    });

    window.syncCheck = (id, checked) => { document.getElementById(`out-${id}`).innerText = checked ? '▣' : '□'; };
    window.syncYN = (prefix, choice) => {
        document.getElementById(`${prefix}-s-out`).innerText = choice === 's' ? 'X' : '';
        document.getElementById(`${prefix}-n-out`).innerText = choice === 'n' ? 'X' : '';
    };

    // 3. GERAÇÃO DE PDF - TÉCNICA DE ISOLAMENTO DE ELEMENTO
    window.downloadPDF = function() {
        const element = document.getElementById('rat-render');
        const numChamado = document.getElementById('in-chamado').value || '000';
        const btn = document.querySelector('.generate-btn');
        
        btn.innerText = "GERANDO PDF...";
        btn.disabled = true;

        // Opções do PDF
        const opt = {
            margin: 0,
            filename: `RAT_${numChamado}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { 
                scale: 2, 
                useCORS: true, 
                letterRendering: true,
                width: 794, // Largura exata de um A4 em 96dpi
                scrollX: 0,
                scrollY: 0
            },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        // Clonamos o elemento e forçamos estilos de "limpeza" para evitar interferência do site
        html2pdf().set(opt).from(element).toPdf().get('pdf').save().then(() => {
            btn.innerText = "EXPORT_PDF_PRO";
            btn.disabled = false;
        });
    };

    // Ajuste de DPI do Canvas
    function resizeCanvas() {
        const ratio = Math.max(window.devicePixelRatio || 1, 1);
        [canvasAdmin, canvasTecnico].forEach(canvas => {
            canvas.width = canvas.offsetWidth * ratio;
            canvas.height = canvas.offsetHeight * ratio;
            canvas.getContext("2d").scale(ratio, ratio);
        });
    }
    window.onresize = resizeCanvas;
    resizeCanvas();
});