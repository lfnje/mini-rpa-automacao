# Mini RPA - Automação de Interface (Challenge)

Este projeto é um "Mini RPA" (Robotic Process Automation) construído com HTML, CSS e JavaScript puros. Ele foi desenvolvido como parte de um desafio para explorar os fundamentos da automação de interface web diretamente no navegador.O objetivo é criar uma ferramenta simples que permite registrar e executar uma sequência de ações (como cliques, digitação, esperas e rolagem) em elementos de uma página web, simulando a interação de um usuário.

## 🚀 Funcionalidades Atuais

* **Painel de RPA Interativo:** Um painel lateral (sidebar) acessível via um botão de hambúrguer, onde as ações são listadas e gerenciadas.
* **Adição Manual de Ações:** Permite ao usuário adicionar ações de forma manual através de prompts de texto:
    * `click`: Simula um clique em um elemento via seletor CSS.
    * `type`: Digita um texto em um campo de input via seletor CSS.
    * `wait`: Pausa a execução por um determinado tempo em milissegundos.
    * `scroll`: Rola a página para uma posição específica (`top`, `bottom` ou valor em pixels).
* **Inspetor de Elementos:** Uma ferramenta que permite ao usuário clicar em qualquer elemento da página para obter seu seletor CSS e adicioná-lo automaticamente a uma ação de `click` ou `type`.
* **Execução da Automação:** Um botão para iniciar a sequência de ações registradas.
    * Feedback visual de elementos em execução (destaque).
    * Tratamento de erros básicos (elemento não encontrado).
* **Gerenciamento de Ações:**
    * Visualização clara das ações na lista.
    * Remoção de ações individuais.
* **Persistência de Dados:** As ações registradas são salvas e carregadas automaticamente do `localStorage` do navegador, mantendo as automações mesmo após fechar a aba.
* **Responsividade Básica:** O layout se adapta um pouco a diferentes tamanhos de tela.

## 💻 Tecnologias Utilizadas

* **HTML5:** Estrutura da página e da interface do RPA.
* **CSS3:** Estilização do painel, botões, inspetor e feedback visual.
    * Utiliza Flexbox para o layout do painel.
    * Transições para uma experiência de usuário mais fluida.
* **JavaScript (ES6+):** Lógica central do RPA, manipulação do DOM, gerenciamento de eventos, execução da automação, persistência e funcionalidade do inspetor.
    * Uso de `async/await` para controle de fluxo das ações.

## ⚙️ Como Usar

Para testar e utilizar o Mini RPA:

1.  **Clone o Repositório:**
    ```bash
    git clone [https://github.com/lfnje/mini-rpa-automacao.git](https://github.com/lfnje/mini-rpa-automacao.git)
    ```
2.  **Navegue até a Pasta do Projeto:**
    ```bash
    cd mini-rpa-automacao
    ```
3.  **Abra o `index.html`:** Simplesmente abra o arquivo `index.html` no seu navegador web preferido (Chrome, Firefox, Edge, etc.). Você pode arrastar o arquivo para a janela do navegador ou clicar duas vezes nele.

### Interagindo com o RPA:

* **Abrir/Fechar Painel:** Clique no ícone de hambúrguer (☰) no canto superior direito para abrir ou fechar o painel lateral do RPA.
* **Adicionar Ação Manual:** Clique no botão "Adicionar Ação Manual" e siga os prompts para definir o tipo de ação (click, type, wait, scroll) e seus parâmetros.
* **Usar o Inspetor:**
    1.  Clique no botão "Ativar Inspetor".
    2.  Passe o mouse sobre os elementos na página para vê-los destacados.
    3.  Clique em um elemento para "selecioná-lo". O seletor CSS será exibido no painel do RPA.
    4.  Com um elemento selecionado, você pode usar os botões "Adicionar Click Selecionado" ou "Adicionar Type Selecionado" para adicionar automaticamente a ação com o seletor daquele elemento. Para "Type", um prompt adicional pedirá o texto a digitar.
    5.  O inspetor é automaticamente desativado após adicionar uma ação.
* **Remover Ação:** Clique no botão `X` ao lado de qualquer ação na lista para removê-la.
* **Iniciar Automação:** Clique no botão "Iniciar Automação" para que o RPA execute todas as ações em sequência.
    * Observe o destaque visual nos elementos durante a execução.
    * Alertas aparecerão se um elemento não for encontrado durante a automação.

## 🛠️ Estrutura de Base



## Próximos Passos e Possíveis Melhorias

Este é um projeto inicial e pode ser expandido de várias maneiras:

* **Edição de Ações:** Adicionar funcionalidade para editar ações existentes na lista.
* **Arrastar e Soltar:** Permitir reordenar ações na lista usando drag-and-drop.
* **Exportar/Importar Automação:** Opções para salvar e carregar automações como arquivos JSON.
* **Mais Tipos de Ação:** Adicionar ações como `screenshot`, `assert` (verificar se um elemento existe ou tem certo texto), `loop` (repetir um bloco de ações), `screenshot`, etc.
* **UI Mais Robustra:** Substituir `prompt()` por modais HTML mais amigáveis e com validação visual.
* **Relatórios de Execução:** Mostrar um log detalhado do que aconteceu durante a automação.
* **Integração com Ferramentas de Desenvolvimento:** Se tornar uma extensão de navegador para interagir com qualquer página.

---

## 📜 Licença

Este projeto possui todos os direitos reservados, sendo proibida a reprodução, modificação ou distribuição de seu código e conteúdo sem a prévia autorização por escrito de Luiz Filipe Nogueira. Para qualquer uso ou esclarecimento, por favor, entre em contato. Consulte o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## ✉️ Colaboração e Contato

Contribuições são bem-vindas! Se você tiver ideias para melhorias ou encontrar bugs, sinta-se à vontade para abrir uma issue, enviar um Pull Request, ou entrar em contato em algumas das redes abaixo:

* **LinkedIn:** [linkedin.com/in/luizfilipenogueira](https://www.linkedin.com/in/luizfilipenogueira/)
* **Email:** [lfnjecorporativo@gmail.com](mailto:lfnjecorporativo@gmail.com)
* **Instagram:** [instagram.com/_lfnje/](https://www.instagram.com/_lfnje/)

---

<p align="center">
  <em>“A tecnologia não só resolve problemas, como também cria oportunidades.”</em><br>
  <strong>Luiz Filipe Nogueira</strong>
</p>
