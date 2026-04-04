/**
 * CORE PEIXE BRABO - FABRICIO DEV
 */

const DATA = {
    online: [
        {
            nome: "RAT AUTODOC",
            sub: "GERADOR DE RAT E SCIPT ARKLOK",
            link: "autodoc/main.html",
            status: "SISTEMA ATIVO"
        },
        {
            nome: "RAT ARKLOK",
            sub: "GERADOR DE RAT AUTODOC",
            link: "arklok/main.html",
            status: "SISTEMA ATIVO"
        },
        {
            nome: "RAT DELFIA",
            sub: "GERADOR DE RAT DELFIA",
            link: "delfia/main.html",
            status: "SISTEMA ATIVO"
        }
    ],
    offline: ["SECURE_SHELL_01", "ENCRYPTED_DATA", "NULL_VOID"]
};

// Gerador de Emojis Flutuantes
function createBackground() {
    const container = document.getElementById('emoji-container');
    const emojis = ['🐟', '🧊', '❄️', '🧊'];
    const count = 15;

    for (let i = 0; i < count; i++) {
        const span = document.createElement('span');
        span.className = 'floating-emoji';
        span.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        
        // Posição e animação aleatória
        span.style.left = Math.random() * 100 + 'vw';
        span.style.animationDuration = (Math.random() * 10 + 10) + 's';
        span.style.animationDelay = (Math.random() * 5) + 's';
        
        container.appendChild(span);
    }
}

function renderApp() {
    const root = document.getElementById('app-root');
    let content = `<div class="section-label">Módulos de Acesso</div>`;

    DATA.online.forEach(item => {
        content += `
            <a href="${item.link}" class="main-card">
                <span class="card-title">${item.nome}</span>
                <span class="card-sub">${item.sub}</span>
                <div class="badge-online">
                    <span class="pulse" style="width:6px; height:6px; margin-right:8px; background:#00ff64;"></span>
                    ${item.status}
                </div>
            </a>
        `;
    });

    content += `<div class="section-label" style="margin-top:40px">Em Desenvolvimento</div><div class="list-wrapper">`;

    DATA.offline.forEach(id => {
        content += `
            <div class="rat-item">
                <span class="name-sn">${id}</span>
                <span style="font-size:0.5rem; font-weight:800; color:var(--text-dim)">OFFLINE</span>
            </div>
        `;
    });

    content += `</div>`;
    root.innerHTML = content;
}

// Alternar Tema
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    document.querySelector('.mode-label').textContent = isLight ? "LAB MODE" : "CYBER MODE";
    localStorage.setItem('peixe-theme', isLight ? 'light' : 'dark');
});

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('peixe-theme') === 'light') {
        document.body.classList.add('light-mode');
        document.querySelector('.mode-label').textContent = "LAB MODE";
    }
    createBackground();
    renderApp();
});