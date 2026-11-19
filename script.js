// ========================================
// CLASSE ALUNO
// ========================================

class Aluno {
    constructor(nome, idade, curso, notaFinal) {
        this.nome = nome;
        this.idade = idade;
        this.curso = curso;
        this.notaFinal = notaFinal;
    }

    isAprovado() {
        return this.notaFinal >= 7;
    }

    toString() {
        return `${this.nome} | Idade: ${this.idade} | Curso: ${this.curso} | Nota: ${formatarNumero(this.notaFinal, 1)}`;
    }
}

// ========================================
// DADOS EM MEMÓRIA
// ========================================

const alunos = [];
const cursos = ["JavaScript", "Python", "Java"];

let indiceEdicao = -1;
let relatorioAtual = null;

// ========================================
// ELEMENTOS DO HTML
// ========================================

const formulario = document.getElementById("formulario-aluno");

const campoNome = document.getElementById("nome");
const campoIdade = document.getElementById("idade");
const campoCurso = document.getElementById("curso");
const campoNota = document.getElementById("notaFinal");

const botaoSalvar = document.getElementById("botao-salvar");
const botaoCancelar = document.getElementById("botao-cancelar");
const tituloFormulario = document.getElementById("titulo-formulario");

const tabelaAlunos = document.getElementById("tabela-alunos");
const buscaAluno = document.getElementById("busca-aluno");
const filtroCurso = document.getElementById("filtro-curso");
const contadorResultados = document.getElementById("contador-resultados");

const totalAlunos = document.getElementById("total-alunos");
const totalAprovados = document.getElementById("total-aprovados");
const mediaTurma = document.getElementById("media-turma");

const mensagemSistema = document.getElementById("mensagem-sistema");
const resultadoRelatorio = document.getElementById("resultado-relatorio");

const botoesRelatorios = {
    "btn-aprovados": "aprovados",
    "btn-media-notas": "media-notas",
    "btn-media-idades": "media-idades",
    "btn-nomes": "nomes",
    "btn-cursos": "cursos"
};

// ========================================
// FUNÇÕES AUXILIARES
// ========================================

function formatarNumero(valor, casas = 2) {
    return valor.toLocaleString("pt-BR", {
        minimumFractionDigits: casas,
        maximumFractionDigits: casas
    });
}

// Permite buscar "joao" e encontrar "João".
const normalizarTexto = (texto) => {
    return texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
};

// Mostra uma mensagem usando um alerta do Bootstrap.
function mostrarMensagem(texto, tipo = "success") {
    const alerta = document.createElement("div");

    alerta.className =
        `alert alert-${tipo} d-flex align-items-center justify-content-between gap-3`;

    const mensagem = document.createElement("span");
    mensagem.textContent = texto;

    const fechar = document.createElement("button");
    fechar.type = "button";
    fechar.className = "btn-close flex-shrink-0";
    fechar.setAttribute("aria-label", "Fechar mensagem");

    fechar.addEventListener("click", function () {
        mensagemSistema.replaceChildren();
        campoNome.focus();
    });

    alerta.append(mensagem, fechar);
    mensagemSistema.replaceChildren(alerta);
}

function limparFiltros() {
    buscaAluno.value = "";
    filtroCurso.value = "";
}

function limparFormulario() {
    formulario.reset();

    campoNome.setCustomValidity("");
    campoIdade.setCustomValidity("");
    campoCurso.setCustomValidity("");
    campoNota.setCustomValidity("");

    indiceEdicao = -1;

    tituloFormulario.textContent = "Cadastrar aluno";
    botaoSalvar.textContent = "Cadastrar";
    botaoCancelar.hidden = true;
}

// ========================================
// VALIDAÇÃO
// ========================================

function validarFormulario() {
    const nome = campoNome.value.trim();
    const idade = Number(campoIdade.value);
    const nota = Number(campoNota.value);

    campoNome.setCustomValidity(
        nome === "" ? "Digite o nome do aluno." : ""
    );

    campoIdade.setCustomValidity(
        campoIdade.value === "" ||
        !Number.isInteger(idade) ||
        idade < 1
            ? "Informe uma idade inteira maior que zero."
            : ""
    );

    campoCurso.setCustomValidity(
        !cursos.includes(campoCurso.value)
            ? "Selecione um curso válido."
            : ""
    );

    campoNota.setCustomValidity(
        campoNota.value === "" ||
        !Number.isFinite(nota) ||
        nota < 0 ||
        nota > 10
            ? "Informe uma nota entre 0 e 10."
            : ""
    );

    return formulario.reportValidity();
}

// Remove o erro personalizado quando o usuário corrige um campo.
[campoNome, campoIdade, campoCurso, campoNota].forEach((campo) => {
    campo.addEventListener("input", function () {
        campo.setCustomValidity("");
    });

    campo.addEventListener("change", function () {
        campo.setCustomValidity("");
    });
});

// ========================================
// CARDS DE RESUMO
// ========================================

function atualizarResumo() {
    totalAlunos.textContent = alunos.length;

    const aprovados = alunos.filter(
        (aluno) => aluno.isAprovado()
    );

    totalAprovados.textContent = aprovados.length;

    if (alunos.length === 0) {
        mediaTurma.textContent = "—";
        return;
    }

    const soma = alunos.reduce(
        (total, aluno) => total + aluno.notaFinal,
        0
    );

    mediaTurma.textContent = formatarNumero(
        soma / alunos.length
    );
}

// ========================================
// TABELA, BUSCA E FILTRO
// ========================================

function renderizarAlunos() {
    tabelaAlunos.replaceChildren();

    const termo = normalizarTexto(buscaAluno.value);
    const cursoSelecionado = filtroCurso.value;

    // Guarda o índice original para editar e excluir corretamente,
    // mesmo quando a tabela está filtrada.
    const resultados = alunos
        .map((aluno, indice) => ({ aluno, indice }))
        .filter(({ aluno }) => {
            const correspondeNome =
                normalizarTexto(aluno.nome).includes(termo);

            const correspondeCurso =
                cursoSelecionado === "" ||
                aluno.curso === cursoSelecionado;

            return correspondeNome && correspondeCurso;
        });

    if (resultados.length === 0) {
        const linha = document.createElement("tr");
        const celula = document.createElement("td");

        celula.colSpan = 5;
        celula.className = "text-center text-body-secondary py-5";

        celula.textContent = alunos.length === 0
            ? "Nenhum aluno cadastrado. Comece pelo formulário."
            : "Nenhum aluno encontrado. Altere a busca ou o filtro.";

        linha.appendChild(celula);
        tabelaAlunos.appendChild(linha);
    }

    resultados.forEach(({ aluno, indice }) => {
        const linha = document.createElement("tr");

        const dados = [
            aluno.nome,
            aluno.idade,
            aluno.curso,
            formatarNumero(aluno.notaFinal, 1)
        ];

        dados.forEach((valor, posicao) => {
            const celula = document.createElement("td");
            celula.textContent = valor;

            if (posicao === 0) {
                celula.className = "fw-semibold text-break";
            }

            linha.appendChild(celula);
        });

        const celulaAcoes = document.createElement("td");
        celulaAcoes.className = "text-nowrap";

        const editar = document.createElement("button");
        editar.type = "button";
        editar.className = "btn btn-sm btn-outline-dark";
        editar.textContent = "Editar";
        editar.setAttribute("aria-label", `Editar ${aluno.nome}`);

        editar.addEventListener("click", function () {
            editarAluno(indice);
        });

        const excluir = document.createElement("button");
        excluir.type = "button";
        excluir.className = "btn btn-sm btn-outline-danger ms-2";
        excluir.textContent = "Excluir";
        excluir.setAttribute("aria-label", `Excluir ${aluno.nome}`);

        excluir.addEventListener("click", function () {
            excluirAluno(indice);
        });

        celulaAcoes.append(editar, excluir);
        linha.appendChild(celulaAcoes);

        tabelaAlunos.appendChild(linha);
    });

    contadorResultados.textContent =
        `Exibindo ${resultados.length} de ${alunos.length} alunos.`;
}

function atualizarTela() {
    renderizarAlunos();
    atualizarResumo();

    if (relatorioAtual !== null) {
        exibirRelatorio(relatorioAtual);
    }
}

buscaAluno.addEventListener("input", function () {
    renderizarAlunos();
});

filtroCurso.addEventListener("change", function () {
    renderizarAlunos();
});

// ========================================
// CADASTRAR OU SALVAR EDIÇÃO
// ========================================

formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    if (!validarFormulario()) {
        return;
    }

    const aluno = new Aluno(
        campoNome.value.trim(),
        Number(campoIdade.value),
        campoCurso.value,
        Number(campoNota.value)
    );

    const estaEditando = indiceEdicao !== -1;

    if (estaEditando) {
        alunos[indiceEdicao] = aluno;
    } else {
        alunos.push(aluno);
    }

    limparFormulario();

    // Garante que o aluno salvo apareça na tabela.
    limparFiltros();
    atualizarTela();

    mostrarMensagem(
        estaEditando
            ? `Dados de ${aluno.nome} atualizados com sucesso.`
            : `${aluno.nome} cadastrado com sucesso.`
    );

    campoNome.focus();
});

// ========================================
// EDITAR ALUNO
// ========================================

function editarAluno(indice) {
    const aluno = alunos[indice];

    if (!aluno) {
        return;
    }

    limparFormulario();
    indiceEdicao = indice;

    campoNome.value = aluno.nome;
    campoIdade.value = aluno.idade;
    campoCurso.value = aluno.curso;
    campoNota.value = aluno.notaFinal;

    tituloFormulario.textContent = "Editar aluno";
    botaoSalvar.textContent = "Salvar alterações";
    botaoCancelar.hidden = false;

    mostrarMensagem(
        `Editando ${aluno.nome}. Altere os campos e salve, ou cancele a edição.`,
        "info"
    );

    campoNome.focus();
}

botaoCancelar.addEventListener("click", function () {
    limparFormulario();

    mostrarMensagem(
        "Edição cancelada. Os dados foram mantidos.",
        "info"
    );

    campoNome.focus();
});

// ========================================
// EXCLUIR ALUNO
// ========================================

function excluirAluno(indice) {
    const aluno = alunos[indice];

    if (!aluno) {
        return;
    }

    const confirmou = window.confirm(
        `Excluir o cadastro de ${aluno.nome}?\nEssa ação não pode ser desfeita.`
    );

    if (!confirmou) {
        return;
    }

    alunos.splice(indice, 1);

    if (indiceEdicao === indice) {
        limparFormulario();
    } else if (indiceEdicao > indice) {
        // Ajusta a posição do aluno que está sendo editado.
        indiceEdicao--;
    }

    atualizarTela();

    mostrarMensagem(
        `Cadastro de ${aluno.nome} excluído.`,
        "info"
    );

    // O botão excluído saiu da tela; reposiciona o foco.
    buscaAluno.focus();
}

// ========================================
// RELATÓRIOS
// Sempre consideram todos os alunos cadastrados.
// ========================================

function exibirRelatorio(tipo) {
    relatorioAtual = tipo;

    // Destaca o botão do relatório selecionado.
    Object.entries(botoesRelatorios).forEach(([id, tipoBotao]) => {
        const botao = document.getElementById(id);
        const selecionado = tipoBotao === tipo;

        botao.classList.toggle("active", selecionado);
        botao.setAttribute("aria-pressed", String(selecionado));
    });

    if (alunos.length === 0) {
        resultadoRelatorio.textContent =
            "Cadastre pelo menos um aluno para gerar relatórios.";
        return;
    }

    let texto = "";

    switch (tipo) {
        case "aprovados": {
            const aprovados = alunos.filter(
                (aluno) => aluno.isAprovado()
            );

            texto = aprovados.length > 0
                ? `ALUNOS APROVADOS — ${aprovados.length}\n\n` +
                  aprovados
                      .map((aluno) => aluno.toString())
                      .join("\n")
                : "Nenhum aluno aprovado. A nota mínima é 7.";

            break;
        }

        case "media-notas": {
            const soma = alunos.reduce(
                (total, aluno) => total + aluno.notaFinal,
                0
            );

            const media = soma / alunos.length;

            texto =
                "MÉDIA DAS NOTAS\n\n" +
                `${formatarNumero(media)} de 10\n` +
                `Calculada com ${alunos.length} aluno(s).`;

            break;
        }

        case "media-idades": {
            const soma = alunos.reduce(
                (total, aluno) => total + aluno.idade,
                0
            );

            const media = soma / alunos.length;

            texto =
                "MÉDIA DAS IDADES\n\n" +
                `${formatarNumero(media)} anos\n` +
                `Calculada com ${alunos.length} aluno(s).`;

            break;
        }

        case "nomes": {
            const nomes = alunos
                .map((aluno) => aluno.nome)
                .sort((a, b) =>
                    a.localeCompare(b, "pt-BR", {
                        sensitivity: "base"
                    })
                );

            texto =
                "NOMES EM ORDEM ALFABÉTICA\n\n" +
                nomes
                    .map((nome, indice) => `${indice + 1}. ${nome}`)
                    .join("\n");

            break;
        }

        case "cursos": {
            const quantidades = alunos.reduce(
                (contagem, aluno) => {
                    contagem[aluno.curso]++;
                    return contagem;
                },
                {
                    JavaScript: 0,
                    Python: 0,
                    Java: 0
                }
            );

            texto =
                "QUANTIDADE DE ALUNOS POR CURSO\n\n" +
                Object.entries(quantidades)
                    .map(
                        ([curso, quantidade]) =>
                            `${curso}: ${quantidade} aluno(s)`
                    )
                    .join("\n");

            break;
        }
    }

    resultadoRelatorio.textContent = texto;
}

// ========================================
// EVENTOS DOS BOTÕES DE RELATÓRIO
// ========================================

Object.entries(botoesRelatorios).forEach(([id, tipo]) => {
    const botao = document.getElementById(id);

    botao.setAttribute("aria-pressed", "false");

    botao.addEventListener("click", function () {
        exibirRelatorio(tipo);
    });
});

// ========================================
// INICIALIZAÇÃO
// ========================================

atualizarTela();