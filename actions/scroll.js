// actions/scroll.js
/**
 * Rola a janela ou um elemento para uma posição específica.
 * @param {string|number} position - 'top', 'bottom', ou um valor numérico em pixels.
 * @param {HTMLElement} [element=window] - Opcional: O elemento a ser rolado. Padrão é a janela.
 * @returns {Promise<void>} Uma Promise que resolve após um pequeno atraso para a rolagem ser visível.
 */
async function scrollPage(position, element = window) {
    console.log(`[RPA Action] Rolando ${element === window ? 'página' : 'elemento'} para: ${position}`);
    
    let scrollOptions = {
        behavior: 'smooth' // Rola suavemente
    };

    if (typeof position === 'string') {
        if (position === 'top') {
            scrollOptions.top = 0;
        } else if (position === 'bottom') {
            // Para rolar para o final do documento
            scrollOptions.top = element === window ? document.body.scrollHeight : element.scrollHeight;
        } else {
            console.warn("[RPA Action] Posição de rolagem de string inválida. Use 'top' ou 'bottom'.");
            return Promise.resolve();
        }
    } else if (typeof position === 'number') {
        scrollOptions.top = position;
    } else {
        console.warn("[RPA Action] Posição de rolagem inválida. Use 'top', 'bottom' ou um número em px.");
        return Promise.resolve();
    }

    // Executa a rolagem
    if (element === window) {
        window.scrollTo(scrollOptions);
    } else {
        element.scrollTo(scrollOptions);
    }

    // Retorna uma Promise que resolve após um curto período para a rolagem ser concluída
    return new Promise(resolve => setTimeout(resolve, 600)); // Dê um tempo para a rolagem suave
}