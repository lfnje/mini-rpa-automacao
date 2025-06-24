// actions/wait.js
/**
 * Aguarda por uma duração especificada em milissegundos.
 * Esta função retorna uma Promise que resolve após o tempo de espera.
 *
 * @param {number} duration - Duração da espera em milissegundos.
 * @returns {Promise<void>} Uma Promise que resolve após a duração especificada.
 */
async function wait(duration) {
    console.log(`[RPA Action] Aguardando ${duration}ms...`); // Log para o console informando a espera
    return new Promise(resolve => setTimeout(resolve, duration)); // Cria uma Promise que resolve após 'duration' milissegundos
}