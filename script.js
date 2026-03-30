/**
 * NÚCLEO DE DADOS - PEIXE BRABO
 */
const DATA = {
    principal: {
        nome: "RAT AUTODOC",
        sub: "GERADOR DE DOCUMENTAÇÃO AVANÇADO",
        link: "autodoc/main.html",
        data: "29/03/2026",
        status: "SISTEMA ONLINE"
    },
    offline: [
        { id: "S/N" },
        { id: "S/N" },
        { id: "S/N" },
        { id: "S/N" }
    ]
};

function renderApp() {
    const root = document.getElementById('app-root');
    
    // Construindo o HTML
    let content = `
        <div class="section-label">Acesso de Elite</div>
        <a href="${DATA.principal.link}" class="main-card">
            <div class="card-info">
                <span class="card-title">${DATA.principal.nome}</span>
                <span style="font-size:0.6rem; color:#666; display:block; margin-bottom:10px;">${DATA.principal.sub}</span>
                <span class="card-date">DATA DE LANÇAMENTO: ${DATA.principal.data}</span>
            </div>
            <div class="badge-online">${DATA.principal.status}</div>
        </a>

        <div class="section-label">Módulos em Desenvolvimento</div>
        <div class="list-wrapper">
    `;

    DATA.offline.forEach(item => {
        content += `
            <div class="rat-item">
                <span class="name-sn">${item.id}</span>
                <span class="status-off">OFFLINE INDISPONÍVEL</span>
            </div>
        `;
    });

    content += `</div>`;
    
    // Injetando no HTML
    root.innerHTML = content;
}

// Inicia o sistema
document.addEventListener('DOMContentLoaded', renderApp);