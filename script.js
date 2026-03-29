document.querySelectorAll('input, textarea').forEach(input => {
    input.addEventListener('input', () => {
        const id = input.id.replace('in-', 'out-');
        const out = document.getElementById(id);
        if (out) {
            if (input.type === 'date' && input.value) {
                out.innerText = input.value.split('-').reverse().join('/');
            } else {
                out.innerText = input.value;
            }
        }
    });
});

function syncYN(baseId, type) {
    const outSim = document.getElementById(baseId + '-s-out');
    const outNao = document.getElementById(baseId + '-n-out');
    if (outSim && outNao) {
        outSim.innerText = '';
        outNao.innerText = '';
        if (type === 's') outSim.innerText = 'X';
        if (type === 'n') outNao.innerText = 'X';
    }
}

function syncCheck(type, isChecked) {
    const out = document.getElementById('out-' + type);
    if (out) {
        out.innerText = isChecked ? 'X' : '□';
    }
}

function setupSig(id) {
    const canvas = document.getElementById(id);
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    canvas.getContext("2d").scale(ratio, ratio);
    return new SignaturePad(canvas, { 
        backgroundColor: 'rgba(255, 255, 255, 0)',
        penColor: 'black'
    });
}

const padTecnico = setupSig('pad-tecnico');
const padAdmin = setupSig('pad-admin');

function downloadPDF() {
    if (!padAdmin.isEmpty()) document.getElementById('img-admin').src = padAdmin.toDataURL();
    if (!padTecnico.isEmpty()) document.getElementById('img-tecnico').src = padTecnico.toDataURL();

    const element = document.getElementById('rat-render');
    const chamado = document.getElementById('in-chamado').value || 'S_N';
    const opt = {
        margin: 0,
        filename: 'RAT_AutoDoc_' + chamado + '.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 3, useCORS: true, letterRendering: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
}