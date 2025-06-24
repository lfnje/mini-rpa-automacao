// script.js (Lógica principal do Mini RPA)
console.log("Mini RPA script principal carregado.");

// Referências aos elementos do DOM da UI do RPA
const rpaPanel = document.getElementById('rpa-panel');
const actionList = document.getElementById('action-list');
const addActionBtn = document.getElementById('add-action-btn');
const startRpaBtn = document.getElementById('start-rpa-btn');
const menuToggleBtn = document.getElementById('menu-toggle-btn'); 

// A referência ao bodyElement foi removida, pois não é mais usada para controlar classes de estilo.


// Elementos relacionados ao inspetor (definidos em index.html, usados em inspector.js mas referenciados aqui)
const enableInspectorBtn = document.getElementById('enable-inspector-btn');
const inspectorInfo = document.getElementById('inspector-info');
const selectedElementSelectorSpan = document.getElementById('selected-element-selector');
const addSelectedClickBtn = document.getElementById('add-selected-click-btn');
const addSelectedTypeBtn = document.getElementById('add-selected-type-btn');


let actions = []; // Array que armazena todas as ações da automação

// --- Funções de Persistência (LocalStorage) ---

/**
 * Salva as ações no localStorage do navegador.
 */
function saveActions() {
    try {
        localStorage.setItem('rpaActions', JSON.stringify(actions));
        console.log("Ações salvas no localStorage.");
    } catch (e) {
        console.error("Erro ao salvar ações no localStorage:", e);
    }
}

/**
 * Carrega as ações do localStorage do navegador.
 */
function loadActions() {
    try {
        const storedActions = localStorage.getItem('rpaActions');
        if (storedActions) {
            actions = JSON.parse(storedActions);
            console.log("Ações carregadas do localStorage:", actions);
        } else {
            console.log("Nenhuma ação encontrada no localStorage.");
        }
    } catch (e) {
        console.error("Erro ao carregar ações do localStorage:", e);
        actions = []; // Reseta as ações em caso de erro de parsing
    }
}

// --- Funções de Gerenciamento da UI ---

/**
 * Renderiza a lista de ações no painel do RPA.
 */
function renderActionList() {
    actionList.innerHTML = ''; // Limpa a lista existente
    actions.forEach((action, index) => {
        const li = document.createElement('li');
        let actionDescription = `${index + 1}. ${action.type}`;

        // Adiciona detalhes com base no tipo de ação
        if (action.selector) {
            actionDescription += ` em "${action.selector}"`;
        }
        if (action.value) {
            actionDescription += ` (valor: "${action.value}")`;
        }
        if (action.duration) {
            actionDescription += ` (${action.duration}ms)`;
        }

        li.innerHTML = `
            <span>${actionDescription}</span>
            <div>
                <button data-index="${index}" class="edit-action-btn" style="display:none;">Editar</button>
                <button data-index="${index}" class="remove-action-btn">X</button>
            </div>
        `;
        actionList.appendChild(li);
    });

    // Adiciona event listeners para os botões de remover
    document.querySelectorAll('.remove-action-btn').forEach(button => {
        button.onclick = (e) => removeAction(parseInt(e.target.dataset.index));
    });

    // Salva as ações sempre que a lista é renderizada (indicando uma mudança)
    saveActions();
}

/**
 * Adiciona uma nova ação à lista e atualiza a UI.
 * @param {object} action - O objeto da ação a ser adicionada.
 */
function addAction(action) {
    actions.push(action);
    renderActionList();
    console.log("Ação adicionada:", action);
}

/**
 * Remove uma ação da lista pelo seu índice e atualiza a UI.
 * @param {number} index - O índice da ação a ser removida.
 */
function removeAction(index) {
    actions.splice(index, 1);
    renderActionList();
    console.log("Ação removida. Ações restantes:", actions);
}

// --- Funções de Execução da Automação ---

/**
 * Executa todas as ações na sequência definida.
 */
startRpaBtn.onclick = async () => {
    console.log("Iniciando automação...");
    startRpaBtn.disabled = true; // Desabilita o botão para evitar cliques múltiplos
    enableInspectorBtn.disabled = true; // Desabilita o inspetor durante a execução
    
    // Fechar o menu ao iniciar a automação. A lógica de padding do body foi removida.
    rpaPanel.classList.remove('open'); 
    
    for (let i = 0; i < actions.length; i++) {
        const action = actions[i];
        let targetElement = null; // O elemento DOM alvo da ação

        // Se a ação requer um seletor, tenta encontrá-lo
        if (action.selector) {
            targetElement = document.querySelector(action.selector);
            if (!targetElement) {
                console.error(`Erro na ação ${i + 1} (${action.type}): Elemento com seletor "${action.selector}" não encontrado. Parando automação.`);
                alert(`Automação parada: Elemento "${action.selector}" não encontrado.`);
                break; // Para a execução se o elemento não for encontrado
            }
            // Adiciona feedback visual ao elemento alvo
            targetElement.classList.add('highlight-element');
        }

        try {
            switch (action.type) {
                case 'click':
                    // clickElement é definida em actions/click.js
                    await clickElement(targetElement);
                    await wait(200); // Pequena pausa para visualização
                    break;
                case 'type':
                    // typeText é definida em actions/type.js
                    await typeText(targetElement, action.value);
                    await wait(200); // Pequena pausa para visualização
                    break;
                case 'wait':
                    // wait é definida em actions/wait.js
                    await wait(action.duration);
                    break;
                case 'scroll':
                    // scrollPage é definida em actions/scroll.js
                    await scrollPage(action.value, window); 
                    await wait(500); // Pausa maior para ver a rolagem
                    break;
                default:
                    console.warn(`Tipo de ação desconhecido na ação ${i + 1}: ${action.type}`);
            }
        } catch (error) {
            console.error(`Erro ao executar ação ${i + 1} (${action.type}):`, error);
            alert(`Erro durante a execução da automação na ação ${i + 1}: ${error.message}`);
            break; // Parar em caso de erro na execução da ação
        } finally {
            // Remove o feedback visual após a ação
            if (targetElement) {
                targetElement.classList.remove('highlight-element');
            }
        }
    }
    console.log("Automação concluída.");
    startRpaBtn.disabled = false; // Reabilita o botão
    enableInspectorBtn.disabled = false; // Reabilita o inspetor
};


// --- Event Listeners Iniciais ---

// Botão para adicionar ação manualmente (abre prompts)
addActionBtn.onclick = () => {
    // Fechar o menu hambúrguer antes de abrir os prompts. A lógica de padding do body foi removida.
    rpaPanel.classList.remove('open');
    
    const actionType = prompt("Tipo de ação (click, type, wait, scroll):");
    // Se o usuário cancelar o prompt inicial do tipo de ação, não faz nada.
    if (!actionType) return; 

    let action = { type: actionType.toLowerCase() }; // Converte para minúsculas para padronização

    if (actionType === 'click' || actionType === 'type') {
        action.selector = prompt("Seletor CSS (ex: #meuBotao, .minhaClasse, input[name='xyz']):");
        // Validação de seletor removida para permitir adição mesmo se vazio/nulo.
        
        if (actionType === 'type') {
            action.value = prompt("Texto a digitar:");
            // Validação de valor de texto removida para permitir adição mesmo se vazio/nulo.
        }
    } else if (actionType === 'wait') {
        const durationStr = prompt("Duração da espera em ms (ex: 1000 para 1 segundo):");
        action.duration = parseInt(durationStr);
        // Validação de duração removida para permitir adição mesmo se inválida.
    } else if (actionType === 'scroll') {
        action.value = prompt("Para onde rolar (top, bottom, ou valor em pixels - ex: 500):");
        // Validação de valor de rolagem removida para permitir adição mesmo se vazio/nulo.
        // Tenta converter para número se for o caso (mantido para utilidade, mas não impedirá adição)
        if (!isNaN(parseFloat(action.value)) && isFinite(action.value)) {
            action.value = parseFloat(action.value);
        }
    } 
    // Validação para tipo de ação desconhecido e seu 'return' também foram removidos.
    // Isso significa que qualquer tipo digitado será adicionado, mesmo que seja inválido.
    
    addAction(action); // Ação será adicionada com os valores que forem fornecidos, mesmo se vazios/inválidos.
};


// --- Lógica do Menu Hambúrguer ---
menuToggleBtn.onclick = () => {
    rpaPanel.classList.toggle('open'); // Alterna a classe 'open' no painel. A lógica do body foi removida.
};


// --- Integração com o Inspetor ---
// Estas funções são chamadas pelo inspector.js
window.addSelectedAction = (type, selector, value) => {
    let action = { type: type, selector: selector };
    if (value !== undefined) {
        action.value = value;
    }
    addAction(action);
};

// Adiciona ações via inspetor
addSelectedClickBtn.onclick = () => {
    if (isInspectorActive && currentlySelectedElement) {
        window.addSelectedAction('click', selectedElementSelectorSpan.textContent);
        enableInspectorBtn.click(); // Desativa o inspetor após adicionar
        // Manter o menu aberto após adicionar ação via inspetor. A lógica de padding do body foi removida.
        rpaPanel.classList.add('open'); 
    } else {
        alert("Nenhum elemento selecionado ou inspetor inativo.");
    }
};

addSelectedTypeBtn.onclick = () => {
    if (isInspectorActive && currentlySelectedElement) {
        const textToType = prompt("Qual texto você deseja digitar?");
        // A validação 'if (textToType !== null)' foi removida para permitir adicionar mesmo com cancelamento aqui.
        window.addSelectedAction('type', selectedElementSelectorSpan.textContent, textToType);
        enableInspectorBtn.click(); // Desativa o inspetor após adicionar
        // Manter o menu aberto após adicionar ação via inspetor. A lógica de padding do body foi removida.
        rpaPanel.classList.add('open'); 
    } else {
        alert("Nenhum elemento selecionado ou inspetor inativo.");
    }
};


// Inicializa: Carrega ações do localStorage e renderiza a lista ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    loadActions();      // Primeiro, tenta carregar as ações salvas
    renderActionList(); // Depois, renderiza o que foi carregado ou a lista vazia
});