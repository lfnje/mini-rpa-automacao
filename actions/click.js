// actions/click.js
/**
 * Simula um clique em um elemento.
 * @param {HTMLElement} element - O elemento DOM a ser clicado.
 * @returns {Promise<void>} Uma Promise que resolve após o clique.
 */
async function clickElement(element) {
    return new Promise((resolve) => {
        if (element) {
            console.log(`[RPA Action] Clicando em:`, element);
            element.click(); // Dispara o evento de clique nativo
            resolve();
        } else {
            console.warn("[RPA Action] Elemento não fornecido para clickElement. Ignorando ação.");
            resolve(); // Resolve mesmo se o elemento não for encontrado para não bloquear a automação.
                      // O script.js já trata a falta do elemento antes de chamar esta função.
        }
    });
}