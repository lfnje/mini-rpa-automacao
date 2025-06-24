// actions/type.js
/**
 * Simula a digitação de texto em um campo de input ou textarea.
 * @param {HTMLInputElement|HTMLTextAreaElement} element - O campo de input/textarea.
 * @param {string} text - O texto a ser digitado.
 * @returns {Promise<void>} Uma Promise que resolve após a digitação.
 */
async function typeText(element, text) {
    return new Promise((resolve) => {
        // Verifica se o elemento é um input ou textarea
        if (element && (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA')) {
            console.log(`[RPA Action] Digitando "${text}" em:`, element);
            element.value = text; // Define o valor do campo

            // Dispara eventos 'input' e 'change' para simular a interação do usuário.
            // Isso é importante para frameworks que reagem a esses eventos.
            element.dispatchEvent(new Event('input', { bubbles: true }));
            element.dispatchEvent(new Event('change', { bubbles: true }));
            resolve();
        } else {
            console.warn("[RPA Action] Elemento não é um input/textarea ou não fornecido para typeText. Ignorando ação.");
            resolve();
        }
    });
}