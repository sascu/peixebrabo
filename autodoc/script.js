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
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            tempCanvas.width = canvas.width;
            tempCanvas.height = canvas.height;

            // Se estiver no modo escuro, a caneta é branca. Precisamos converter para preto.
            const isLight = document.body.classList.contains('light-mode');

            tempCtx.drawImage(canvas, 0, 0);

            if (!isLight) {
                // Inverte Branco para Preto para o PDF
                tempCtx.globalCompositeOperation = 'source-in';
                tempCtx.fillStyle = 'black';
                tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
            }

            document.getElementById(targetImgId).src = tempCanvas.toDataURL();
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
    window.downloadPDF = function () {
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

window.toggleTheme = function () {
    const body = document.body;
    const icon = document.getElementById('theme-icon');
    body.classList.toggle('light-mode');
    const isLight = body.classList.contains('light-mode');

    if (isLight) {
        icon.innerHTML = '<path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4Z" /><path d="M12,12L12,2A10,10 0 0,0 2,12L12,12Z" />';
        icon.classList.replace('fill-yellow-500', 'fill-zinc-400');
        window.padTecnico.penColor = 'rgb(0, 0, 0)';
        window.padCliente.penColor = 'rgb(0, 0, 0)';
    } else {
        icon.innerHTML = '<path d="M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,2L14.39,5.42L18.35,4.65L17.58,8.61L21,11L17.58,13.39L18.35,17.35L14.39,16.58L12,20L9.61,16.58L5.65,17.35L6.42,13.39L3,11L6.42,8.61L5.65,4.65L9.61,5.42L12,2Z" />';
        icon.classList.replace('fill-zinc-400', 'fill-yellow-500');
        window.padTecnico.penColor = 'rgb(255, 255, 255)';
        window.padCliente.penColor = 'rgb(255, 255, 255)';
    }
};

// Nova lógica de processamento de imagem (Lida com os dois modos)
function getInverted(canvas, targetId) {
    const temp = document.createElement('canvas');
    const ctx = temp.getContext('2d');
    temp.width = canvas.width;
    temp.height = canvas.height;
    ctx.drawImage(canvas, 0, 0);

    const isLight = document.body.classList.contains('light-mode');

    // Se estiver no MODO DARK, a assinatura é branca, precisamos inverter para PRETO para o PDF
    if (!isLight) {
        ctx.globalCompositeOperation = 'source-in';
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, temp.width, temp.height);
    }
    // Se estiver no MODO LIGHT, a assinatura já é preta, só exportamos transparente

    document.getElementById(targetId).src = temp.toDataURL('image/png');
}