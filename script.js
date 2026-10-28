// =====================================================
// FASE 1: CLASSE PRODUTO
// =====================================================

class Produto {
    #preco;
    #quantidade;

    constructor(nome, preco, quantidade) {
        nome = String(nome).trim();

        if (!nome) {
            throw new Error("O nome do produto não pode ficar em branco.");
        }

        this.nome = nome;
        this.preco = preco;
        this.quantidade = quantidade;
    }

    get preco() {
        return this.#preco;
    }

    set preco(novoPreco) {
        novoPreco = Number(novoPreco);

        if (!Number.isFinite(novoPreco) || novoPreco <= 0) {
            throw new Error("O preço deve ser um número válido maior que zero.");
        }

        this.#preco = novoPreco;
    }

    get quantidade() {
        return this.#quantidade;
    }

    set quantidade(novaQuantidade) {
        novaQuantidade = Number(novaQuantidade);

        if (!Number.isInteger(novaQuantidade) || novaQuantidade <= 0) {
            throw new Error("A quantidade deve ser um número inteiro maior que zero.");
        }

        this.#quantidade = novaQuantidade;
    }

    calcularSubtotal() {
        return this.preco * this.quantidade;
    }
}

// =====================================================
// FASE 2: GERENCIAMENTO DOS PRODUTOS
// =====================================================

const listaDeProdutos = [];
const CHAVE_STORAGE = "sistema_estoque_produtos";

// null = cadastro novo; número = índice do produto em edição
let indiceEdicao = null;

// =====================================================
// FASE 3: ELEMENTOS DO HTML
// =====================================================

const formProduto = document.getElementById("produto-form");
const btnLimparTudo = document.getElementById("limpar-tabela");
const totalEstoqueEl = document.getElementById("total-estoque");
const nomeInput = document.getElementById("nome");
const precoInput = document.getElementById("preco");
const quantidadeInput = document.getElementById("quantidade");

const btnEnviar = formProduto
    ? formProduto.querySelector('button[type="submit"], input[type="submit"]')
    : null;

if (!formProduto || !nomeInput || !precoInput || !quantidadeInput) {
    console.error("Confira no HTML os IDs do formulário e dos campos.");
}

const textoBotaoOriginal = btnEnviar
    ? (btnEnviar.tagName === "INPUT" ? btnEnviar.value : btnEnviar.textContent)
    : "Cadastrar Produto";

function alterarTextoBotao(texto) {
    if (!btnEnviar) return;

    if (btnEnviar.tagName === "INPUT") {
        btnEnviar.value = texto;
    } else {
        btnEnviar.textContent = texto;
    }
}

// =====================================================
// FASE 4: SALVAR NO LOCALSTORAGE
// =====================================================

function salvarNoLocalStorage() {
    const dadosParaSalvar = listaDeProdutos.map(produto => ({
        nome: produto.nome,
        preco: produto.preco,
        quantidade: produto.quantidade
    }));

    localStorage.setItem(
        CHAVE_STORAGE,
        JSON.stringify(dadosParaSalvar)
    );
}

// =====================================================
// FASE 5: CARREGAR DO LOCALSTORAGE
// =====================================================

function carregarDoLocalStorage() {
    const dadosSalvos = localStorage.getItem(CHAVE_STORAGE);

    if (!dadosSalvos) return;

    try {
        const produtosSalvos = JSON.parse(dadosSalvos);

        if (!Array.isArray(produtosSalvos)) {
            throw new Error("Os dados salvos não estão no formato esperado.");
        }

        produtosSalvos.forEach(dados => {
            try {
                listaDeProdutos.push(
                    new Produto(
                        dados.nome,
                        dados.preco,
                        dados.quantidade
                    )
                );
            } catch (erro) {
                console.warn(
                    "Um produto salvo inválido foi ignorado:",
                    erro.message
                );
            }
        });
    } catch (erro) {
        console.error("Erro ao carregar os produtos:", erro);
    }
}

// =====================================================
// FASE 6: VALIDAR E ENVIAR O FORMULÁRIO
// =====================================================

if (formProduto) {
    formProduto.addEventListener("submit", function(event) {
        event.preventDefault();

        const nome = nomeInput.value.trim();
        const preco = Number(precoInput.value);
        const quantidade = Number(quantidadeInput.value);

        // CLÁUSULAS DE GUARDA

        if (nome === "") {
            alert("Digite o nome do produto.");
            nomeInput.focus();
            return;
        }

        if (
            precoInput.value.trim() === "" ||
            !Number.isFinite(preco) ||
            preco <= 0
        ) {
            alert("Digite um preço válido maior que zero.");
            precoInput.focus();
            return;
        }

        if (
            quantidadeInput.value.trim() === "" ||
            !Number.isInteger(quantidade) ||
            quantidade <= 0
        ) {
            alert("Digite uma quantidade inteira maior que zero.");
            quantidadeInput.focus();
            return;
        }

        try {
            const novoProduto = new Produto(
                nome,
                preco,
                quantidade
            );

            if (indiceEdicao === null) {
                // CADASTRAR: adiciona um produto novo
                listaDeProdutos.push(novoProduto);
            } else {
                // ATUALIZAR: substitui o produto existente
                listaDeProdutos[indiceEdicao] = novoProduto;
            }

            salvarNoLocalStorage();
            atualizarInterface();

            // VOLTAR AO MODO DE INCLUSÃO
            indiceEdicao = null;
            formProduto.reset();
            alterarTextoBotao(textoBotaoOriginal);

        } catch (erro) {
            alert(erro.message);
        }
    });
}

// =====================================================
// FASE 7: PREPARAR EDIÇÃO
// =====================================================

function prepararEdicao(index) {
    if (
        !Number.isInteger(index) ||
        index < 0 ||
        index >= listaDeProdutos.length
    ) {
        alert("Não foi possível encontrar esse produto.");
        return;
    }

    const produto = listaDeProdutos[index];

    // Preenche os campos com os dados existentes
    nomeInput.value = produto.nome;
    precoInput.value = produto.preco;
    quantidadeInput.value = produto.quantidade;

    // Ativa o modo de edição
    indiceEdicao = index;

    // Altera o texto do botão
    alterarTextoBotao("Salvar Alterações");

    nomeInput.focus();
}

// =====================================================
// FASE 8: REMOVER UM PRODUTO
// =====================================================

function removerProduto(index) {
    if (
        !Number.isInteger(index) ||
        index < 0 ||
        index >= listaDeProdutos.length
    ) {
        return;
    }

    listaDeProdutos.splice(index, 1);

    // Cancela ou ajusta a edição, se necessário
    if (indiceEdicao === index) {
        indiceEdicao = null;
        formProduto.reset();
        alterarTextoBotao(textoBotaoOriginal);
    } else if (indiceEdicao !== null && index < indiceEdicao) {
        indiceEdicao--;
    }

    salvarNoLocalStorage();
    atualizarInterface();
}

// =====================================================
// FASE 9: LIMPAR TODOS OS PRODUTOS
// =====================================================

if (btnLimparTudo) {
    btnLimparTudo.addEventListener("click", function() {
        listaDeProdutos.length = 0;
        indiceEdicao = null;

        localStorage.removeItem(CHAVE_STORAGE);

        if (formProduto) {
            formProduto.reset();
        }

        alterarTextoBotao(textoBotaoOriginal);
        atualizarInterface();
    });
}

// =====================================================
// FASE 10: CALCULAR TOTAL DO ESTOQUE
// =====================================================

function atualizarTotalEstoque() {
    const valorTotal = listaDeProdutos.reduce(
        (acumulador, produto) => {
            return acumulador + produto.calcularSubtotal();
        },
        0
    );

    const valorFormatado = valorTotal.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    if (totalEstoqueEl) {
        totalEstoqueEl.textContent =
            `Total em Estoque: ${valorFormatado}`;
    }
}

// =====================================================
// FASE 11: RENDERIZAR A TABELA
// =====================================================

function renderizarTabela() {
    const tabelaBody = document.querySelector(
        "#tabela-produtos tbody"
    );

    if (!tabelaBody) {
        console.error(
            'Não foi encontrado o corpo da tabela "#tabela-produtos tbody".'
        );
        return;
    }

    tabelaBody.innerHTML = "";

    listaDeProdutos.forEach((produto, index) => {
        const linha = document.createElement("tr");

        const celulaNome = document.createElement("td");
        celulaNome.textContent = produto.nome;

        const celulaPreco = document.createElement("td");
        celulaPreco.textContent = produto.preco.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });

        const celulaQuantidade = document.createElement("td");
        celulaQuantidade.textContent = produto.quantidade;

        const celulaSubtotal = document.createElement("td");
        celulaSubtotal.textContent =
            produto.calcularSubtotal().toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL"
            });

        const celulaAcoes = document.createElement("td");

        // BOTÃO EDITAR
        const btnEditar = document.createElement("button");
        btnEditar.type = "button";
        btnEditar.className = "btn-editar";
        btnEditar.textContent = "Editar";

        btnEditar.addEventListener("click", function() {
            prepararEdicao(index);
        });

        // BOTÃO REMOVER
        const btnRemover = document.createElement("button");
        btnRemover.type = "button";
        btnRemover.className = "btn-remover";
        btnRemover.textContent = "Remover";

        btnRemover.addEventListener("click", function() {
            removerProduto(index);
        });

        celulaAcoes.append(btnEditar, btnRemover);

        linha.append(
            celulaNome,
            celulaPreco,
            celulaQuantidade,
            celulaSubtotal,
            celulaAcoes
        );

        tabelaBody.appendChild(linha);
    });
}

// =====================================================
// FASE 12: ATUALIZAR INTERFACE E INICIAR O SISTEMA
// =====================================================

function atualizarInterface() {
    renderizarTabela();
    atualizarTotalEstoque();
}

carregarDoLocalStorage();
atualizarInterface();