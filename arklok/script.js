document.addEventListener('DOMContentLoaded', () => {
    const canvasT = document.getElementById('pad-tecnico');
    const canvasC = document.getElementById('pad-cliente');
    const padT = new SignaturePad(canvasT, { penColor: 'rgb(255, 255, 255)' });
    const padC = new SignaturePad(canvasC, { penColor: 'rgb(255, 255, 255)' });

    window.padTecnico = padT;
    window.padCliente = padC;

    function getInverted(canvas, targetId) {
        const temp = document.createElement('canvas');
        const ctx = temp.getContext('2d');
        temp.width = canvas.width; temp.height = canvas.height;
        ctx.drawImage(canvas, 0, 0);
        ctx.globalCompositeOperation = 'difference';
        ctx.fillStyle = 'white';
        ctx.fillRect(0,0,temp.width,temp.height);
        document.getElementById(targetId).src = temp.toDataURL();
    }

    padT.addEventListener("endStroke", () => getInverted(canvasT, 'img-tecnico'));
    padC.addEventListener("endStroke", () => getInverted(canvasC, 'img-cliente'));

    const fields = [
        'tecnico', 'parceira', 'chamado', 'data', 'inicio', 'fim',
        'razao', 'resp', 'tel', 'email', 'lab-sn', 'cargo', 'depto', 'outros-desc',
        'ant-mod', 'ant-pat', 'ant-ser', 'ant-host',
        'nov-mod', 'nov-pat', 'nov-ser', 'nov-host',
        'perfil', 'peri-1', 'peri-2', 'obs', 'sintoma', 'fechamento',
        'cidade', 'data-final'
    ];

    fields.forEach(id => {
        const input = document.getElementById(`in-${id}`);
        const output = document.getElementById(`out-${id}`);
        if(input && output) {
            input.addEventListener('input', () => {
                output.innerText = input.value;
            });
        }
    });

    window.syncCheck = (id, checked) => {
        const target = document.getElementById(`out-${id}`);
        if(target) target.innerText = checked ? 'X' : '';
    };

    window.downloadPDF = function() {
        const element = document.getElementById('rat-render');
        const num = document.getElementById('in-chamado').value || '000';
        const opt = {
            margin: 0,
            filename: `RAT_ARKLOK_${num}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        html2pdf().set(opt).from(element).save();
    };

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