// inspector.js (Lógica para o modo "inspetor" de seleção de elementos)
console.log("Inspector script carregado.");

// Variáveis de estado do inspetor
let isInspectorActive = false;
let currentlySelectedElement = null; // O elemento que foi CLICADO pelo inspetor

// Referências a elementos do DOM (já definidas em script.js, mas acessíveis globalmente)
// enableInspectorBtn é referenciado aqui para seu próprio listener
// inspectorInfo, selectedElementSelectorSpan, addSelectedClickBtn, addSelectedTypeBtn
// são usados para atualizar a UI do inspetor.

// Botão para ativar/desativar o inspetor
enableInspectorBtn.onclick = () => {
    isInspectorActive = !isInspectorActive;
    enableInspectorBtn.textContent = isInspectorActive ? "Desativar Inspetor" : "Ativar Inspetor";
    inspectorInfo.style.display = isInspectorActive ? 'block' : 'none';

    if (isInspectorActive) {
        // Adiciona listeners para hover (feedback visual)
        document.addEventListener('mouseover', handleMouseOver);
        document.addEventListener('mouseout', handleMouseOut);
        // Adiciona listener para clique (seleção do elemento).
        // Usamos 'true' para o capture phase para que o nosso listener capture o clique
        // antes que qualquer outro listener no elemento alvo o faça.
        document.addEventListener('click', handleElementSelection, true);
        console.log("Inspetor Ativo");
    } else {
        // Remove todos os listeners quando o inspetor é desativado
        document.removeEventListener('mouseover', handleMouseOver);
        document.removeEventListener('mouseout', handleMouseOut);
        document.removeEventListener('click', handleElementSelection, true);
        console.log("Inspetor Desativado");
        // Limpa o destaque se houver um elemento selecionado
        if (currentlySelectedElement) {
            currentlySelectedElement.classList.remove('selected-element-outline');
            currentlySelectedElement = null; // Reseta o elemento selecionado
        }
        selectedElementSelectorSpan.textContent = ''; // Limpa o seletor exibido
    }
};

/**
 * Lida com o evento mouseover para adicionar destaque visual temporário.
 * @param {Event} event - O evento do mouse.
 */
function handleMouseOver(event) {
    // Evita destacar o próprio painel RPA ou elementos dentro dele
    if (event.target === rpaPanel || rpaPanel.contains(event.target)) {
        return;
    }
    // Adiciona a classe de destaque temporário
    event.target.classList.add('highlight-element');
}

/**
 * Lida com o evento mouseout para remover destaque visual temporário.
 * @param {Event} event - O evento do mouse.
 */
function handleMouseOut(event) {
    // Evita remover destaque do próprio painel RPA
    if (event.target === rpaPanel || rpaPanel.contains(event.target)) {
        return;
    }
    // Remove a classe de destaque temporário
    event.target.classList.remove('highlight-element');
}

/**
 * Lida com o evento de clique para selecionar um elemento e gerar seu seletor.
 * @param {Event} event - O evento do mouse.
 */
function handleElementSelection(event) {
    // Evita selecionar o próprio painel RPA ou elementos dentro dele
    if (event.target === rpaPanel || rpaPanel.contains(event.target)) {
        return;
    }
    
    event.preventDefault();     // Impede a ação padrão do clique (ex: navegar em links)
    event.stopPropagation();    // Impede que o clique se propague para outros listeners

    // Remove o destaque do elemento previamente selecionado (se houver)
    if (currentlySelectedElement) {
        currentlySelectedElement.classList.remove('selected-element-outline');
    }

    // Define o novo elemento selecionado
    currentlySelectedElement = event.target;
    // Adiciona o destaque visual de seleção
    currentlySelectedElement.classList.add('selected-element-outline');

    // Gera e exibe o seletor CSS do elemento selecionado
    const selector = generateCssSelector(currentlySelectedElement);
    selectedElementSelectorSpan.textContent = selector;
    console.log("Elemento selecionado:", currentlySelectedElement, "Seletor:", selector);
}

/**
 * Gera um seletor CSS robusto para um elemento DOM.
 * Tenta priorizar ID, depois atributos únicos, depois classes, e por fim tag com nth-child.
 * @param {HTMLElement} el - O elemento DOM.
 * @returns {string} O seletor CSS gerado.
 */
function generateCssSelector(el) {
    // 1. Tentar por ID (mais confiável)
    if (el.id) {
        return `#${el.id}`;
    }

    // 2. Tentar por atributos únicos comuns (data-*, name, type, role)
    // Isso é especialmente útil para elementos de formulário ou componentes.
    const uniqueAttributes = ['data-test-id', 'name', 'type', 'role', 'aria-label', 'placeholder'];
    for (const attr of uniqueAttributes) {
        if (el.hasAttribute(attr) && el.getAttribute(attr)) {
            // Evita seletores genéricos como input[type="text"] se houver outras opções
            // ou se o tipo for "button" e houver muitos botões.
            // Para simplicidade, vamos permitir, mas em um RPA real, seria mais granular.
            return `${el.tagName.toLowerCase()}[${attr}="${el.getAttribute(attr)}"]`;
        }
    }

    // 3. Tentar por classes (se houver classes específicas)
    if (el.className) {
        const classes = el.className.split(' ').filter(c => c && c !== 'highlight-element' && c !== 'selected-element-outline');
        if (classes.length > 0) {
            // Tenta um seletor com tag e todas as classes
            const classSelector = `${el.tagName.toLowerCase()}.${classes.join('.')}`;
            // Verifica se este seletor é único (ou pelo menos razoavelmente único)
            if (document.querySelectorAll(classSelector).length === 1) {
                return classSelector;
            }
            // Se não for único, ainda podemos usá-lo como parte de um seletor mais longo
        }
    }

    // 4. Último recurso: tag com nth-child (menos robusto, mas funciona)
    let selector = el.tagName.toLowerCase();
    const parent = el.parentNode;
    if (parent) {
        const siblings = Array.from(parent.children);
        const sameTagSiblings = siblings.filter(s => s.tagName === el.tagName);
        if (sameTagSiblings.length > 1) {
            const index = siblings.indexOf(el) + 1; // nth-child é baseado em 1
            selector += `:nth-child(${index})`;
        }
    }
    
    // 5. Seletor de pai para aumentar a especificidade (para elementos sem ID/classes únicas)
    // Tenta construir um caminho CSS até um pai que tenha um ID ou uma classe única.
    if (parent && !parent.id && !parent.className) { // Se o pai não tem ID/Classe óbvia
        let path = [selector];
        let current = el;
        while (current.parentNode && current.parentNode !== document.body && current.parentNode !== document.documentElement) {
            current = current.parentNode;
            let parentSelector = current.tagName.toLowerCase();
            if (current.id) {
                parentSelector = `#${current.id}`;
            } else if (current.className) {
                const parentClasses = current.className.split(' ').filter(c => c).join('.');
                if (parentClasses) parentSelector += `.${parentClasses}`;
            }
            path.unshift(parentSelector); // Adiciona no início
            if (current.id || document.querySelectorAll(path.join(' > ')).length === 1) {
                break; // Parar se encontrarmos um pai com ID ou se o caminho já for único
            }
        }
        return path.join(' > ');
    }

    return selector;
}