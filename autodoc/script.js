document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicialização das Assinaturas (Signature Pad)
    const canvasAdmin = document.getElementById('pad-admin');
    const canvasTecnico = document.getElementById('pad-tecnico');

    const padAdmin = new SignaturePad(canvasAdmin, { backgroundColor: 'rgb(255, 255, 255)' });
    const padTecnico = new SignaturePad(canvasTecnico, { backgroundColor: 'rgb(255, 255, 255)' });

    window.padAdmin = padAdmin;
    window.padTecnico = padTecnico;

    // Função para atualizar a imagem da assinatura no preview em tempo real
    [padAdmin, padTecnico].forEach((pad, index) => {
        const targetImgId = index === 0 ? 'img-admin' : 'img-tecnico';
        pad.addEventListener("endStroke", () => {
            const dataUrl = pad.toDataURL();
            document.getElementById(targetImgId).src = dataUrl;
        });
    });

    // 2. Sincronização em Tempo Real (Inputs de Texto)
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

    // 3. Funções Globais de Sincronização (Chamadas pelo HTML)

    // Sincroniza Checkboxes (3G, 4G, WIFI)
    window.syncCheck = function(id, checked) {
        const outEl = document.getElementById(`out-${id}`);
        if (outEl) {
            outEl.innerText = checked ? '▣' : '□';
        }
    };

    // Sincroniza Botões Sim/Não
    window.syncYN = function(prefix, choice) {
        const outSim = document.getElementById(`${prefix}-s-out`);
        const outNao = document.getElementById(`${prefix}-n-out`);

        if (choice === 's') {
            outSim.innerText = 'X';
            outNao.innerText = '';
        } else {
            outSim.innerText = '';
            outNao.innerText = 'X';
        }
    };

    // 4. Geração de PDF (Configurado para A4)
    window.downloadPDF = function() {
        const element = document.getElementById('rat-render');
        const nomeCliente = document.getElementById('in-cliente').value || 'Relatorio';
        const numChamado = document.getElementById('in-chamado').value || '000';

        // Configurações do PDF
        const opt = {
            margin: 0,
            filename: `RAT_${nomeCliente}_${numChamado}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { 
                scale: 3, // Aumenta a qualidade
                useCORS: true,
                letterRendering: true
            },
            jsPDF: { 
                unit: 'mm', 
                format: 'a4', 
                orientation: 'portrait' 
            }
        };

        // Gerar PDF
        html2pdf().set(opt).from(element).save();
    };

    // Ajuste de tamanho dos canvas de assinatura
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