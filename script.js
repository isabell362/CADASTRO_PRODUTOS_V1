
// =====================================================
// FASE 1: MODELAGEM DOS DADOS (Classe Base)
// =====================================================

// A classe funciona como um "molde" para criar produtos.
class Produto {
    constructor(nome, preco, quantidade) {

        // Propriedades do produto
        this.nome = nome;
        this.preco = parseFloat(preco);
        this.quantidade = parseInt(quantidade);
    }

    // Método que calcula o subtotal do produto
    calcularSubtotal() {
        return this.preco * this.quantidade;
    }
}


// =====================================================
// FASE 2: GERENCIAMENTO DE ESTADO (Memória)
// =====================================================

// Array que guarda todos os produtos cadastrados
const listaDeProdutos = [];


// =====================================================
// FASE 3: ESCUTA DE EVENTOS DO DOM
// =====================================================

// Seleciona o formulário pelo ID
const formulario = document.getElementById("produto-form");


// Quando o formulário for enviado
formulario.addEventListener("submit", function (event) {

    // Impede a página de recarregar
    event.preventDefault();


    // -------------------------------------------------
    // 1. Captura os valores dos campos
    // -------------------------------------------------

    const nomeInput = document.getElementById("nome").value;

    const precoInput = document.getElementById("preco").value;

    const quantidadeInput = document.getElementById("quantidade").value;


    // -------------------------------------------------
    // 2. Verifica se os campos estão preenchidos
    // -------------------------------------------------

    if (
        nomeInput.trim() === "" ||
        precoInput === "" ||
        quantidadeInput === ""
    ) {
        alert("Preencha todos os campos!");
        return;
    }


    // -------------------------------------------------
    // 3. Cria um novo produto
    // -------------------------------------------------

    const novoProduto = new Produto(
        nomeInput,
        precoInput,
        quantidadeInput
    );


    // -------------------------------------------------
    // 4. Adiciona o produto ao Array
    // -------------------------------------------------

    listaDeProdutos.push(novoProduto);


    // -------------------------------------------------
    // 5. Atualiza a tabela
    // -------------------------------------------------

    renderizarTabela();


    // -------------------------------------------------
    // 6. Atualiza o total do estoque
    // -------------------------------------------------

    atualizarTotal();


    // -------------------------------------------------
    // 7. Limpa os campos do formulário
    // -------------------------------------------------

    formulario.reset();
});


// =====================================================
// FASE 4: RENDERIZAÇÃO DA INTERFACE (DOM)
// =====================================================

// Função responsável por desenhar a tabela
function renderizarTabela() {

    // Seleciona o corpo da tabela
    const tabelaBody = document.querySelector(
        "#tabela-produtos tbody"
    );


    // Limpa a tabela antes de desenhar novamente
    tabelaBody.innerHTML = "";


    // Percorre todos os produtos
    listaDeProdutos.forEach((produto, indice) => {

        // Cria uma nova linha
        const linha = document.createElement("tr");


        // Coloca os dados dentro da linha
        linha.innerHTML = `
            <td>${produto.nome}</td>

            <td>
                R$ ${produto.preco.toFixed(2)}
            </td>

            <td>
                ${produto.quantidade}
            </td>

            <td>
                R$ ${produto.calcularSubtotal().toFixed(2)}
            </td>

            <td>
                <button
                    type="button"
                    class="btn-remover"
                    data-indice="${indice}"
                >
                    Excluir
                </button>
            </td>
        `;


        // Coloca a linha dentro da tabela
        tabelaBody.appendChild(linha);
    });
}


