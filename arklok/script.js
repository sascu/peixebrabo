document.addEventListener('DOMContentLoaded', () => {
    const canvasT = document.getElementById('pad-tecnico');
    const canvasC = document.getElementById('pad-cliente');
    const padT = new SignaturePad(canvasT, { penColor: 'rgb(255, 255, 255)' });
    const padC = new SignaturePad(canvasC, { penColor: 'rgb(255, 255, 255)' });

    window.padTecnico = padT;
    window.padCliente = padC;

    // Processamento de Assinatura
    function getInverted(canvas, targetId) {
        const temp = document.createElement('canvas');
        const ctx = temp.getContext('2d');
        temp.width = canvas.width; 
        temp.height = canvas.height;
        ctx.drawImage(canvas, 0, 0);
        const isLight = document.body.classList.contains('light-mode');
        if (!isLight) {
            ctx.globalCompositeOperation = 'source-in';
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, temp.width, temp.height);
        }
        document.getElementById(targetId).src = temp.toDataURL('image/png');
    }

    padT.addEventListener("endStroke", () => getInverted(canvasT, 'img-tecnico'));
    padC.addEventListener("endStroke", () => getInverted(canvasC, 'img-cliente'));

    // Sincronização Automática da Data e Campos
    const fields = [
        'tecnico', 'parceira', 'chamado', 'data', 'inicio', 'fim', 'km-ini', 'km-fim',
        'razao', 'endereco', 'resp', 'tel', 'email', 'cargo', 'depto',
        'ant-mod', 'ant-pat', 'ant-ser', 'ant-host', 'ant-etiqueta', 'ant-imei',
        'nov-mod', 'nov-pat', 'nov-ser', 'nov-host', 'nov-etiqueta', 'nov-imei',
        'perfil', 'peri-1', 'peri-2', 'sintoma', 'fechamento', 'backup-desc', 'soft-obs', 'cidade'
    ];

    fields.forEach(id => {
        const input = document.getElementById(`in-${id}`);
        const output = document.getElementById(`out-${id}`);
        if(input && output) {
            input.addEventListener('input', () => {
                output.innerText = input.value.toUpperCase();
            });
        }
    });

    // Lógica Especial para Quebrar a Data Automaticamente
    const inputData = document.getElementById('in-data');
    inputData.addEventListener('change', () => {
        const dataValor = inputData.value; // Formato YYYY-MM-DD
        if (dataValor) {
            const partes = dataValor.split('-');
            const ano = partes[0];
            const mesIndice = parseInt(partes[1]) - 1;
            const dia = partes[2];

            const meses = [
                "JANEIRO", "FEVEREIRO", "MARÇO", "ABRIL", "MAIO", "JUNHO",
                "JULHO", "AGOSTO", "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO"
            ];

            document.getElementById('out-dia').innerText = dia;
            document.getElementById('out-mes').innerText = meses[mesIndice];
            document.getElementById('out-ano').innerText = ano.slice(-1); // Pega o último dígito (Ex: 5 de 2025)
            
            // Também formata a data para o cabeçalho do PDF
            document.getElementById('out-data').innerText = `${dia}/${partes[1]}/${ano}`;
        }
    });

    function resize() {
        const ratio = Math.max(window.devicePixelRatio || 1, 1);
        [canvasT, canvasC].forEach(c => {
            c.width = c.offsetWidth * ratio;
            c.height = c.offsetHeight * ratio;
            c.getContext("2d").scale(ratio, ratio);
        });
    }
    window.onresize = resize; resize();
});

// Funções de Sincronização de Selects e Checks
window.syncStatus = (v) => {}; // Placeholder se precisar
window.syncLab = (v) => document.getElementById('out-lab-sn').innerText = v;
window.syncNatureza = (t) => {
    document.getElementById('out-subst').innerText = (t === 'subst' ? 'X' : '');
    document.getElementById('out-upgrade').innerText = (t === 'upgr' ? 'X' : '');
};
window.syncEquip = (t) => {
    ['not', 'dsk', 'imp', 'mob'].forEach(id => {
        const out = document.getElementById(`out-${id}`);
        if(out) out.innerText = (id === t ? 'X' : '');
    });
};
window.syncCheckDoc = (id, chk) => {
    const target = document.getElementById(`out-${id}`);
    if(target) target.innerText = chk ? 'X' : '';
};

// Alternar Tema
window.toggleTheme = function() {
    const body = document.body;
    const icon = document.getElementById('theme-icon');
    body.classList.toggle('light-mode');
    const isLight = body.classList.contains('light-mode');
    if (isLight) {
        icon.innerHTML = '<path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4Z" />';
        window.padTecnico.penColor = 'rgb(0, 0, 0)';
        window.padCliente.penColor = 'rgb(0, 0, 0)';
    } else {
        icon.innerHTML = '<path d="M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,2L14.39,5.42L18.35,4.65L17.58,8.61L21,11L17.58,13.39L18.35,17.35L14.39,16.58L12,20L9.61,16.58L5.65,17.35L6.42,13.39L3,11L6.42,8.61L5.65,4.65L9.61,5.42L12,2Z" />';
        window.padTecnico.penColor = 'rgb(255, 255, 255)';
        window.padCliente.penColor = 'rgb(255, 255, 255)';
    }
};

// Gerar Script WhatsApp conforme novo modelo solicitado
window.gerarScript = function() {
    const getV = (id) => document.getElementById(`in-${id}`).value.toUpperCase();
    const status = document.getElementById('sel-status').value;

    const script = `SCRIPT DE FECHAMENTO
É OBRIGATÓRIO EM TODO AGENDAMENTO TÉCNICO O ENVIO DO SCRIPT PREENCHIDO VIA WHATSAPP, JUNTO COM A RAT ASSINADA.

TÉCNICO: ${getV('tecnico')}
PARCEIRO: ${getV('parceira')}
KM INICIAL: ${getV('km-ini')}
KM FINAL: ${getV('km-fim')}
CLIENTE: ${getV('razao')}
ENDEREÇO: ${getV('endereco')}
CHAMADO: ${getV('chamado')}
DATA DO ATENDIMENTO: ${getV('data')}
INÍCIO DA ATIVIDADE: ${getV('inicio')}
TÉRMINO DA ATIVIDADE: ${getV('fim')}
PROBLEMA IDENTIFICADO: ${getV('sintoma')}
ATIVIDADE REALIZADA: ${getV('fechamento')}
OBS.: NÃO FOI RETIRADO NENHUM EQUIPAMENTO OU PERIFÉRICO DO CLIENTE.
N.º PATRIMÔNIO/SERIAL: ${getV('nov-pat')} / ${getV('nov-ser')}
MODELO DO EQUIPAMENTO: ${getV('nov-mod')}
STATUS DO CHAMADO: ${status}
NOME DE QUEM ACOMPANHOU A ATIVIDADE: ${getV('resp')}`;

    document.getElementById('txtScript').value = script;
    document.getElementById('modalScript').classList.remove('hidden');
};

window.fecharModal = () => document.getElementById('modalScript').classList.add('hidden');
window.copiarScript = () => {
    const txt = document.getElementById('txtScript');
    txt.select();
    navigator.clipboard.writeText(txt.value).then(() => alert("Copiado!"));
};

window.downloadPDF = function () {
    const element = document.getElementById('rat-render');
    const numChamado = document.getElementById('in-chamado').value || '000';
    const btn = document.querySelector('.generate-btn');

    // 1. Salva o estilo original para não estragar sua visualização na 0
    const originalStyle = element.style.cssText;

    // 2. Força o elemento a ter o tamanho exato de um A4 e esconde sobras que criam a 2ª página
    element.style.width = '794px';      // Largura padrão A4 (96dpi)
    element.style.height = '1122px';    // Altura padrão A4 (96dpi)
    element.style.overflow = 'hidden';  // Corta qualquer "respiro" que geraria a página 2
    element.style.margin = '0';
    element.style.padding = '0';

    btn.innerText = "GERANDO PDF...";
    btn.disabled = true;

    const opt = {
        margin: 0,
        filename: `RAT_${numChamado}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
            scale: 2, // Mantém a qualidade alta
            useCORS: true,
            letterRendering: true,
            scrollY: 0,
            scrollX: 0
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        // Comando para ignorar qualquer tentativa de quebra de página
        pagebreak: { mode: 'avoid-all' } 
    };

    // 3. Gera o PDF e, ao finalizar, restaura o estilo original da página
    html2pdf().set(opt).from(element).save().then(() => {
        element.style.cssText = originalStyle; // Volta o layout ao que era antes
        btn.innerText = "EXPORT_PDF_PRO";
        btn.disabled = false;
    }).catch(err => {
        element.style.cssText = originalStyle; // Em caso de erro, também restaura
        console.error(err);
        btn.disabled = false;
    });
};