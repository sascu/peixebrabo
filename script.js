/**
 * NÚCLEO DE DADOS - PEIXE BRABO
 */
const DATA = {
    // Transformei em uma lista (array) para aceitar vários sistemas online
    online: [
        {
            nome: "RAT AUTODOC",
            sub: "GERADOR DE DOCUMENTAÇÃO AVANÇADO",
            link: "autodoc/main.html",
            data: "29/03/2026",
            status: "SISTEMA ONLINE"
        },
        {
            nome: "RAT ARKLOK",
            sub: "SISTEMA DE GESTÃO ARKLOK",
            link: "arklok/main.html",
            data: "24/05/2024", // Data de hoje
            status: "SISTEMA ONLINE"
        }
    ],

    offline: [
        { id: "S/N" },
        { id: "S/N" },
        { id: "S/N" }
    ]
};

function renderApp() {
    const root = document.getElementById('app-root');
    
    let content = `<div class="section-label">Acesso de Elite</div>`;

    // Agora percorremos a lista de sistemas online para criar os cards
    DATA.online.forEach(item => {
        content += `
            <a href="${item.link}" class="main-card">
                <div class="card-info">
                    <span class="card-title">${item.nome}</span>
                    <span style="font-size:0.6rem; color:#666; display:block; margin-bottom:10px;">${item.sub}</span>
                    <span class="card-date">DATA DE LANÇAMENTO: ${item.data}</span>
                </div>
                <div class="badge-online">${item.status}</div>
            </a>
        `;
    });

    content += `
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