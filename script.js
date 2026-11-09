// CLASSE ALUNO
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
        return `${this.nome} | Idade: ${this.idade} | Curso: ${this.curso} | Nota: ${this.notaFinal}`;
    }
}

// DADOS EM MEMÓRIA
const alunos = [];
let indiceEdicao = -1;
let relatorioAtual = null;

// ELEMENTOS DO HTML
const formulario = document.getElementById("formulario-aluno");
const campoNome = document.getElementById("nome");
const campoIdade = document.getElementById("idade");
const campoCurso = document.getElementById("curso");
const campoNota = document.getElementById("notaFinal");
const tabelaAlunos = document.getElementById("tabela-alunos");
const botaoSalvar = document.getElementById("botao-salvar");
const resultadoRelatorio = document.getElementById("resultado-relatorio");

// LIMPAR FORMULÁRIO
function limparFormulario() {
    formulario.reset();
    indiceEdicao = -1;
    botaoSalvar.textContent = "Cadastrar";
    campoNome.focus();
}

// MOSTRAR ALUNOS NA TABELA
function renderizarAlunos() {
    tabelaAlunos.textContent = "";

    alunos.forEach((aluno, indice) => {
        const linha = document.createElement("tr");

        const dados = [
            aluno.nome,
            aluno.idade,
            aluno.curso,
            aluno.notaFinal
        ];

        dados.forEach((valor) => {
            const celula = document.createElement("td");
            celula.textContent = valor;
            linha.appendChild(celula);
        });

        const celulaAcoes = document.createElement("td");

        const botaoEditar = document.createElement("button");
        botaoEditar.type = "button";
        botaoEditar.textContent = "Editar";

        botaoEditar.addEventListener("click", function () {
            editarAluno(indice);
        });

        const botaoExcluir = document.createElement("button");
        botaoExcluir.type = "button";
        botaoExcluir.textContent = "Excluir";

        botaoExcluir.addEventListener("click", function () {
            excluirAluno(indice);
        });

        celulaAcoes.appendChild(botaoEditar);
        celulaAcoes.appendChild(botaoExcluir);
        linha.appendChild(celulaAcoes);

        tabelaAlunos.appendChild(linha);
    });

    // Atualiza o relatório aberto quando os dados mudam.
    if (relatorioAtual !== null) {
        exibirRelatorio(relatorioAtual);
    }
}

// EDITAR ALUNO
function editarAluno(indice) {
    const aluno = alunos[indice];

    campoNome.value = aluno.nome;
    campoIdade.value = aluno.idade;
    campoCurso.value = aluno.curso;
    campoNota.value = aluno.notaFinal;

    indiceEdicao = indice;
    botaoSalvar.textContent = "Salvar alterações";
    campoNome.focus();

    console.log("Editando aluno:", aluno.nome);
}

// EXCLUIR ALUNO
function excluirAluno(indice) {
    alunos.splice(indice, 1);

    if (indice === indiceEdicao) {
        // Encerra a edição se o aluno editado foi excluído.
        limparFormulario();
    } else if (indice < indiceEdicao) {
        // Ajusta a posição do aluno que está em edição.
        indiceEdicao--;
    }

    renderizarAlunos();
    console.log("Aluno excluído com sucesso!");
}

// CADASTRAR OU SALVAR EDIÇÃO
formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const nome = campoNome.value.trim();
    const idade = Number(campoIdade.value);
    const curso = campoCurso.value;
    const notaFinal = Number(campoNota.value);

    if (nome === "") {
        alert("Digite o nome do aluno.");
        campoNome.focus();
        return;
    }

    if (
        campoIdade.value === "" ||
        !Number.isInteger(idade) ||
        idade < 1
    ) {
        alert("Digite uma idade inteira maior que zero.");
        campoIdade.focus();
        return;
    }

    if (!["JavaScript", "Python", "Java"].includes(curso)) {
        alert("Selecione um curso válido.");
        campoCurso.focus();
        return;
    }

    if (
        campoNota.value === "" ||
        !Number.isFinite(notaFinal) ||
        notaFinal < 0 ||
        notaFinal > 10
    ) {
        alert("Digite uma nota entre 0 e 10.");
        campoNota.focus();
        return;
    }

    const aluno = new Aluno(nome, idade, curso, notaFinal);

    if (indiceEdicao === -1) {
        alunos.push(aluno);
        console.log("Aluno cadastrado com sucesso!");
    } else {
        alunos[indiceEdicao] = aluno;
        console.log("Alterações salvas com sucesso!");
    }

    renderizarAlunos();
    limparFormulario();
});

// RELATÓRIOS
function exibirRelatorio(tipo) {
    relatorioAtual = tipo;

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
                ? "Alunos aprovados:\n" +
                  aprovados
                      .map((aluno) => aluno.toString())
                      .join("\n")
                : "Nenhum aluno aprovado.";

            break;
        }

        case "media-notas": {
            const soma = alunos.reduce(
                (total, aluno) => total + aluno.notaFinal,
                0
            );

            const media = soma / alunos.length;

            texto = `Média das notas: ${media.toFixed(2)}`;
            break;
        }

        case "media-idades": {
            const soma = alunos.reduce(
                (total, aluno) => total + aluno.idade,
                0
            );

            const media = soma / alunos.length;

            texto = `Média das idades: ${media.toFixed(2)} anos`;
            break;
        }

        case "nomes": {
            // Ordena um novo array, preservando a ordem de alunos.
            const nomes = alunos
                .map((aluno) => aluno.nome)
                .sort((a, b) =>
                    a.localeCompare(b, "pt-BR", {
                        sensitivity: "base"
                    })
                );

            texto = "Nomes em ordem alfabética:\n" +
                nomes.join("\n");

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

            texto = "Quantidade de alunos por curso:\n" +
                Object.entries(quantidades)
                    .map(
                        ([curso, quantidade]) =>
                            `${curso}: ${quantidade}`
                    )
                    .join("\n");

            break;
        }
    }

    resultadoRelatorio.textContent = texto;
}

// EVENTOS DOS BOTÕES DE RELATÓRIO
const botoesRelatorios = {
    "btn-aprovados": "aprovados",
    "btn-media-notas": "media-notas",
    "btn-media-idades": "media-idades",
    "btn-nomes": "nomes",
    "btn-cursos": "cursos"
};

Object.entries(botoesRelatorios).forEach(([id, tipo]) => {
    document.getElementById(id).addEventListener("click", function () {
        exibirRelatorio(tipo);
    });
});

// INICIALIZAÇÃO
renderizarAlunos();