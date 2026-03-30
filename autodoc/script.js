document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicialização das Assinaturas
    const canvasAdmin = document.getElementById('pad-admin');
    const canvasTecnico = document.getElementById('pad-tecnico');

    const padAdmin = new SignaturePad(canvasAdmin, { backgroundColor: 'rgb(255, 255, 255)' });
    const padTecnico = new SignaturePad(canvasTecnico, { backgroundColor: 'rgb(255, 255, 255)' });

    window.padAdmin = padAdmin;
    window.padTecnico = padTecnico;

    [padAdmin, padTecnico].forEach((pad, index) => {
        const targetImgId = index === 0 ? 'img-admin' : 'img-tecnico';
        pad.addEventListener("endStroke", () => {
            const dataUrl = pad.toDataURL();
            document.getElementById(targetImgId).src = dataUrl;
        });
    });

    // 2. Sincronização em Tempo Real
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

    // 3. Funções Globais
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

    // 4. GERAÇÃO DE PDF OTIMIZADA PARA MOBILE
    window.downloadPDF = function() {
        const element = document.getElementById('rat-render');
        const numChamado = document.getElementById('in-chamado').value || '000';

        // --- TRUQUE PARA MOBILE ---
        // Forçamos a largura do elemento para 800px (tamanho ideal A4) 
        // antes de gerar, para evitar que o celular "esprema" o layout.
        const originalWidth = element.style.width;
        element.style.width = "800px"; 

        const opt = {
            margin: 0,
            filename: `RAT_${numChamado}.pdf`, // Nome alterado conforme solicitado
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { 
                scale: 2, // Scale 2 é suficiente para boa qualidade sem travar o celular
                useCORS: true,
                letterRendering: true,
                scrollY: 0, // Evita cortes se a página estiver com scroll
                scrollX: 0
            },
            jsPDF: { 
                unit: 'mm', 
                format: 'a4', 
                orientation: 'portrait' 
            }
        };

        // Gerar PDF
        html2pdf().set(opt).from(element).save().then(() => {
            // Volta ao normal após gerar o PDF
            element.style.width = originalWidth;
        });
    };

    // Ajuste de tamanho dos canvas
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