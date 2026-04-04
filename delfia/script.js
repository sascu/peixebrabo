document.addEventListener('DOMContentLoaded', () => {
    // 1. INICIALIZAÇÃO ASSINATURAS
    const canvasCli = document.getElementById('pad-cliente');
    const canvasPre = document.getElementById('pad-prestador');
    
    window.padCliente = new SignaturePad(canvasCli, { penColor: 'rgb(255, 255, 255)' });
    window.padPrestador = new SignaturePad(canvasPre, { penColor: 'rgb(255, 255, 255)' });

    function resizeCanvas() {
        const ratio = Math.max(window.devicePixelRatio || 1, 1);
        [canvasCli, canvasPre].forEach(canvas => {
            canvas.width = canvas.offsetWidth * ratio;
            canvas.height = canvas.offsetHeight * ratio;
            canvas.getContext("2d").scale(ratio, ratio);
        });
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // 2. LOGICA DE SINCRONIZAÇÃO (Sempre exporta preto para o PDF)
    function syncSignature(pad, targetImgId) {
        if (pad.isEmpty()) return;
        const canvas = pad.canvas;
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        tempCtx.drawImage(canvas, 0, 0);
        tempCtx.globalCompositeOperation = 'source-in';
        tempCtx.fillStyle = 'black';
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
        document.getElementById(targetImgId).src = tempCanvas.toDataURL('image/png');
    }

    padCliente.addEventListener("endStroke", () => syncSignature(padCliente, 'img-cli'));
    padPrestador.addEventListener("endStroke", () => syncSignature(padPrestador, 'img-pre'));

    // 3. SINCRONIZAÇÃO DE CAMPOS
    const fields = ['cliente', 'data', 'chamado', 'agencia', 'endereco', 'cidade', 'telefone', 'solicitante', 'resumo', 'inicio', 'fim', 'suporte', 'senha', 'cli-nome', 'cli-rg', 'cli-tel', 'pre-nome', 'pre-rg', 'pre-tel'];
    fields.forEach(id => {
        const input = document.getElementById(`in-${id}`);
        const output = document.getElementById(`out-${id}`);
        if(input && output) input.addEventListener('input', () => output.innerText = input.value);
    });
});

// 4. ALTERNAR TEMA
function toggleTheme() {
    const body = document.body;
    const icon = document.getElementById('theme-icon');
    body.classList.toggle('light-mode');
    const isLight = body.classList.contains('light-mode');
    
    if (isLight) {
        icon.classList.replace('fill-yellow-500', 'fill-zinc-400');
        window.padCliente.penColor = 'rgb(0, 0, 0)';
        window.padPrestador.penColor = 'rgb(0, 0, 0)';
    } else {
        icon.classList.replace('fill-zinc-400', 'fill-yellow-500');
        window.padCliente.penColor = 'rgb(255, 255, 255)';
        window.padPrestador.penColor = 'rgb(255, 255, 255)';
    }
}

// 5. LIMPAR ASSINATURA
function clearSignature(pad, imgId) {
    pad.clear();
    document.getElementById(imgId).src = "";
}

function setAtendimento(tipo, btn) {
    document.querySelectorAll('.btn-select').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('out-tipo-atendimento').innerHTML = tipo === 'Instalação' ? 
        "(X) INSTALAÇÃO &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ( ) MANUTENÇÃO" : 
        "( ) INSTALAÇÃO &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; (X) MANUTENÇÃO";
}

function updateTable(type, row, col, val) {
    const tableId = type === 'eq' ? 'pdf-table-eq' : 'pdf-table-mat';
    const cell = document.getElementById(tableId).rows[row + 2].cells[col];
    if(cell) cell.innerText = val;
}

// 6. DOWNLOAD PDF (Correção de 2 páginas e Scroll Bug)
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