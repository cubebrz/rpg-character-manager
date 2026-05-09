class RPGCharacterManager {
    constructor() {
        this.characters = JSON.parse(localStorage.getItem('rpgCharacters')) || [];
        this.editingId = null;
        this.init();
        this.loadCharacters();
        this.preloadSampleCharacters();
    }

    init() {
        // Event Listeners
        document.getElementById('addCharacter').addEventListener('click', () => this.showForm());
        document.getElementById('closeForm').addEventListener('click', () => this.hideForm());
        document.getElementById('cancelEdit').addEventListener('click', () => this.hideForm());
        document.getElementById('characterFormData').addEventListener('submit', (e) => this.saveCharacter(e));
        
        // Image upload
        document.getElementById('imageUpload').addEventListener('change', (e) => this.handleImageUpload(e));
        document.getElementById('removeImage').addEventListener('click', () => this.removeImage());
        
        // Import/Export
        document.getElementById('exportBtn').addEventListener('click', () => this.exportData());
        document.getElementById('importBtn').addEventListener('click', () => this.importFile.click());
        document.getElementById('importFile').addEventListener('change', (e) => this.importData(e));
    }

    preloadSampleCharacters() {
        if (this.characters.length === 0) {
            this.characters = [
                {
                    id: 'nyx',
                    nome: 'VX-53 // Nyx',
                    genero: 'Indefinido',
                    idade: '70-80 anos (17 aparência)',
                    altura: '1m slime / 1,75m humanoide',
                    aniversario: '2024-07-13',
                    ocupacao: 'Estudante Genivieve Academy / Experimento',
                    raca: 'Slime',
                    classe: 'Cientista',
                    subclasse: 'Assassino',
                    classeSocial: 'Classe anômala',
                    terraNatal: 'Planeta secundário - laboratórios abandonados',
                    mochila: 'Frascos químicos, Lâmina curta, Caderno selado, Fragmentos de criaturas',
                    lore: 'VX-53//NYX é uma entidade artificial que, após adquirir consciência própria, passou a se infiltrar na sociedade enquanto busca compreender sua existência.',
                    pontoFraco: 'Fogo / ataques no núcleo',
                    image: 'https://via.placeholder.com/300x400/8b5cf6/ffffff?text=NYX'
                },
                {
                    id: 'spike',
                    nome: 'Spike',
                    genero: 'Macho',
                    idade: '17 anos',
                    altura: '5m altura / 15m comprimento',
                    aniversario: '2024-02-13',
                    ocupacao: 'Transporte aquático',
                    raca: 'Dinossauro',
                    classe: 'Guerreiro',
                    subclasse: 'Campeão',
                    classeSocial: 'Cavaleiro',
                    terraNatal: 'Arquipélago de Azurian',
                    mochila: 'Espada',
                    lore: 'Em andamento...',
                    pontoFraco: 'Seres não físicos',
                    image: 'https://via.placeholder.com/300x400/059669/ffffff?text=SPIKE'
                },
                {
                    id: 'morfeus',
                    nome: 'Morfeus',
                    genero: 'Masculino',
                    idade: '100 anos (17 aparência)',
                    altura: '1,95m',
                    aniversario: '2024-10-31',
                    ocupacao: 'Príncipe Regente / Comandante Elite',
                    raca: 'Demônio (Sangue Real)',
                    classe: 'Guerreiro',
                    subclasse: 'Trapaceiro Arcano',
                    classeSocial: 'Príncipe',
                    terraNatal: 'Terra das Sombras',
                    mochila: '',
                    lore: '',
                    pontoFraco: '',
                    image: 'https://via.placeholder.com/300x400/7c3aed/ffffff?text=MORFEUS'
                }
            ];
            this.saveToStorage();
            this.loadCharacters();
        }
    }

    showForm(character = null) {
        this.editingId = character ? character.id : null;
        document.getElementById('formTitle').textContent = this.editingId ? 'Editar Personagem' : 'Novo Personagem';
        
        if (character) {
            this.populateForm(character);
        } else {
            this.clearForm();
        }
        
        document.getElementById('characterForm').classList.remove('hidden');
        document.getElementById('nome').focus();
    }

    hideForm() {
        document.getElementById('characterForm').classList.add('hidden');
        this.clearForm();
        this.editingId = null;
    }

    populateForm(character) {
        Object.keys(character).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                element.value = character[key] || '';
            }
        });
        
        document.getElementById('characterImage').src = character.image || 'https://via.placeholder.com/300x400/4a5568/ffffff?text=Imagem';
        document.getElementById('removeImage').classList.remove('hidden');
    }

    clearForm() {
        document.getElementById('characterFormData').reset();
        document.getElementById('characterImage').src = 'https://via.placeholder.com/300x400/4a5568/ffffff?text=Imagem';
        document.getElementById('removeImage').classList.add('hidden');
    }

    async saveCharacter(e) {
        e.preventDefault();
        
        const characterData = {
            id: this.editingId || `char_${Date.now()}`,
            nome: document.getElementById('nome').value,
            genero: document.getElementById('genero').value,
            idade: document.getElementById('idade').value,
            altura: document.getElementById('altura').value,
            aniversario: document.getElementById('aniversario').value,
            ocupacao: document.getElementById('ocupacao').value,
            raca: document.getElementById('raca').value,
            classe: document.getElementById('classe').value,
            subclasse: document.getElementById('subclasse').value,
            classeSocial: document.getElementById('classeSocial').value,
            terraNatal: document.getElementById('terraNatal').value,
            mochila: document.getElementById('mochila').value,
            lore: document.getElementById('lore').value,
            pontoFraco: document.getElementById('pontoFraco').value,
            image: document.getElementById('characterImage').src
        };

        if (this.editingId) {
            const index = this.characters.findIndex(c => c.id === this.editingId);
            this.characters[index] = characterData;
        } else {
            this.characters.push(characterData);
        }

        this.saveToStorage();
        this.loadCharacters();
        this.hideForm();
    }

    handleImageUpload(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                document.getElementById('characterImage').src = e.target.result;
                document.getElementById('removeImage').classList.remove('hidden');
            };
            reader.readAsDataURL(file);
        }
    }

    removeImage() {
        document.getElementById('characterImage').src = 'https://via.placeholder.com/300x400/4a5568/ffffff?text=Imagem';
        document.getElementById('imageUpload').value = '';
        document.getElementById('removeImage').classList.add('hidden');
    }

    loadCharacters() {
        const grid = document.getElementById('charactersGrid');
        
        if (this.characters.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-users"></i>
                    <h3>Nenhum personagem cadastrado</h3>
                    <p>Clique em "Novo Personagem" para começar</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = this.characters.map(character => `
            <div class="character-card" data-id="${character.id}">
                <div class="character-image">
                    ${character.image && character.image !== 'https://via.placeholder.com/300x400/4a5568/ffffff?text=Imagem' 
                        ? `<img src="${character.image}" alt="${character.nome}" class="character-image">`
                        : '<div class="character-image-placeholder"><i class="fas fa-user"></i></div>'
                    }
                </div>
                <div class="card-header">
                    <div class="character-name">${character.nome}</div>
                    <div class="character-race-class">
                        <span class="character-badge">${character.raca}</span>
                        <span class="character-badge">${character.classe}</span>
                        ${character.subclasse ? `<span class="character-badge">${character.subclasse}</span>` : ''}
                    </div>
                </div>
                <div class="card-body">
                    <div class="character-stats">
                        <div class="stat-item">
                            <div class="stat-label">Idade</div>
                            <div class="stat-value">${character.idade || '-'}</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-label">Altura</div>
                            <div class="stat-value">${character.altura || '-'}</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-label">Classe Social</div>
                            <div class="stat-value">${character.classeSocial || '-'}</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-label">Terra Natal</div>
                            <div class="stat-value">${character.terraNatal ? character.terraNatal.split(' ')[0] : '-'}</div>
                        </div>
                    </div>
                    ${character.pontoFraco ? `
                        <div style="margin-top: 10px; padding: 10px; background: rgba(255, 107, 107, 0.1); border-radius: 8px; font-size: 0.85rem;">
                            <strong>⚠️ Ponto Fraco:</strong> ${character.pontoFraco}
                        </div>
                    ` : ''}
                </div>
                <div class="card-footer">
                    <button class="btn-edit" onclick="rpgManager.editCharacter('${character.id}')">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn-delete" onclick="rpgManager.deleteCharacter('${character.id}')">
                        <i class="fas fa-trash"></i> Deletar
                    </button>
                </div>
            </div>
        `).join('');

        // Add click to view details
        document.querySelectorAll('.character-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.btn-edit, .btn-delete, .card-footer')) {
                    const id = card.dataset.id;
                    const character = this.characters.find(c => c.id === id);
                    this.showCharacterDetails(character);
                }
            });
        });
    }

    editCharacter(id) {
        const character = this.characters.find(c => c.id === id);
        this.showForm(character);
    }

    deleteCharacter(id) {
        if (confirm('Tem certeza que deseja deletar este personagem?')) {
            this.characters = this.characters.filter(c => c.id !== id);
            this.saveToStorage();
            this.loadCharacters();
        }
    }

    showCharacterDetails(character) {
        const details = `
            <h3>${character.nome}</h3>
            <p><strong>Raça:</strong> ${character.raca}</p>
            <p><strong>Classe:</strong> ${character.classe} ${character.subclasse ? `(${character.subclasse})` : ''}</p>
            <p><strong>Gênero:</strong> ${character.genero}</p>
            <p><strong>Idade:</strong> ${character.idade}</p>
            <p><strong>Altura:</strong> ${character.altura}</p>
            <p><strong>Ocupação:</strong> ${character.ocupacao}</p>
            <p><strong>Terra Natal:</strong> ${character.terraNatal}</p>
            ${character.mochila ? `<p><strong>Mochila:</strong> ${character.mochila}</p>` : ''}
            ${character.lore ? `<p><strong>Lore:</strong> ${character.lore}</p>` : ''}
            ${character.pontoFraco ? `<p style="color: #ff6b6b;"><strong>Ponto Fraco:</strong> ${character.pontoFraco}</p>` : ''}
        `;
        alert(details); // Poderia ser um modal mais bonito
    }

    saveToStorage() {
        localStorage.setItem('rpgCharacters', JSON.stringify(this.characters));
    }

    exportData() {
        const dataStr = JSON.stringify(this.characters, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `fichas-rpg-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    }

    importData(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const importedCharacters = JSON.parse(e.target.result);
                    if (confirm(`Importar ${importedCharacters.length} personagens? Isso substituirá os atuais.`)) {
                        this.characters = importedCharacters;
                        this.saveToStorage();
                        this.loadCharacters();
                        e.target.value = '';
                    }
                } catch (error) {
                    alert('Erro ao importar arquivo JSON!');
                }
            };
            reader.readAsText(file);
        }
    }
}

// Initialize
const rpgManager = new RPGCharacterManager();