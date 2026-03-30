// Configurações do Repositório
const USER = 'sascu';
const REPO = 'peixebrabo';
const FOLDER = 'autodoc'; // Agora ele foca nesta pasta
const API_URL = `https://api.github.com/repos/${USER}/${REPO}/contents/${FOLDER}`;

async function loadRepositoryFiles() {
    const grid = document.getElementById('rat-grid');
    
    try {
        const response = await fetch(API_URL);
        
        if (!response.ok) throw new Error("Pasta não encontrada");
        
        const files = await response.json();

        // Limpa o loading
        grid.innerHTML = '';

        // Filtra arquivos que são .html e ignora o arquivo principal ratautodoc.html (já que ele é o destaque central)
        const rats = files.filter(file => 
            file.name.endsWith('.html') && 
            file.name.toLowerCase() !== 'ratautodoc.html'
        );

        if (rats.length === 0) {
            grid.innerHTML = '<p style="color: #444;">Nenhum arquivo adicional em /autodoc/.</p>';
            return;
        }

        rats.forEach(file => {
            const name = file.name.replace('.html', '').toUpperCase();
            
            const item = document.createElement('a');
            // O link aponta para dentro da pasta autodoc
            item.href = `${FOLDER}/${file.name}`;
            item.className = 'card rat-item';
            item.innerHTML = `
                <div style="color: #ff0000; font-size: 1.5rem; margin-bottom: 10px;">☣</div>
                <div style="font-weight: bold; letter-spacing: 1px;">${name}</div>
                <div style="font-size: 0.7rem; color: #555; margin-top: 5px;">Module File</div>
            `;
            grid.appendChild(item);
        });

    } catch (error) {
        console.error("Erro ao carregar repositório:", error);
        grid.innerHTML = '<p style="color: #666;">Aguardando módulos serem adicionados na pasta /autodoc/...</p>';
    }
}

document.addEventListener('DOMContentLoaded', loadRepositoryFiles);