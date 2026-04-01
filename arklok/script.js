document.addEventListener('DOMContentLoaded', () => {
    const canvasT = document.getElementById('pad-tecnico');
    const canvasC = document.getElementById('pad-cliente');
    const padT = new SignaturePad(canvasT, { penColor: 'rgb(255, 255, 255)' });
    const padC = new SignaturePad(canvasC, { penColor: 'rgb(255, 255, 255)' });

    window.padTecnico = padT;
    window.padCliente = padC;

    // Processamento de Assinatura (Preto Transparente)
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

    // Sincronização de Campos
    const fields = [
        'tecnico', 'parceira', 'chamado', 'data', 'inicio', 'fim', 'km-ini', 'km-fim',
        'razao', 'endereco', 'resp', 'tel', 'email', 'cargo', 'depto',
        'ant-mod', 'ant-pat', 'ant-ser', 'ant-host', 'ant-etiqueta', 'ant-imei',
        'nov-mod', 'nov-pat', 'nov-ser', 'nov-host', 'nov-etiqueta', 'nov-imei',
        'perfil', 'peri-1', 'peri-2', 'sintoma', 'fechamento', 'backup-desc', 'soft-obs',
        'cidade', 'dia', 'mes', 'ano'
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

    // Redimensionar Pads
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

// Funções de Sincronização Especial
window.syncStatus = (v) => document.getElementById('out-status').innerText = v;
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

// Alternar Tema (Sol/Lua)
window.toggleTheme = function() {
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

// Gerar Script WhatsApp
window.gerarScript = function() {
    const getV = (id) => document.getElementById(`in-${id}`).value.toUpperCase();
    const script = `*SCRIPT DE FECHAMENTO*
----------------------------------------
*TÉCNICO:* ${getV('tecnico')}
*PARCEIRO:* ${getV('parceira')}
*KM INICIAL:* ${getV('km-ini')} | *KM FINAL:* ${getV('km-fim')}
*CLIENTE:* ${getV('razao')}
*ENDEREÇO:* ${getV('endereco')}
*CHAMADO:* ${getV('chamado')}
*DATA:* ${getV('data')}
*HORÁRIO:* ${getV('inicio')} - ${getV('fim')}
*STATUS:* ${document.getElementById('sel-status').value}
*PROBLEMA:* ${getV('sintoma')}
*ATIVIDADE:* ${getV('fechamento')}
*ACOMPANHANTE:* ${getV('resp')}`;

    document.getElementById('txtScript').value = script;
    document.getElementById('modalScript').classList.remove('hidden');
};

window.fecharModal = () => document.getElementById('modalScript').classList.add('hidden');
window.copiarScript = () => {
    const txt = document.getElementById('txtScript');
    txt.select();
    navigator.clipboard.writeText(txt.value).then(() => alert("Copiado!"));
};

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

    