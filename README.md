# DevTech Academy — Gerenciamento de Alunos

Projeto acadêmico desenvolvido com HTML, JavaScript e Docker.

## Funcionalidades

- Cadastro, listagem, edição e exclusão de alunos.
- Classe Aluno com os métodos isAprovado() e toString().
- Relatório de alunos aprovados (nota maior ou igual a 7).
- Média das notas e das idades.
- Nomes dos alunos em ordem alfabética.
- Quantidade de alunos por curso.

## Tecnologias

- HTML
- JavaScript
- Docker
- Nginx

## Como executar

Com o Docker instalado e iniciado, execute na pasta do projeto:

```bash
docker build -t devtech-alunos .
docker run -d --name devtech-alunos -p 8080:80 devtech-alunos
```

Acesse no navegador: http://localhost:8080

Se o container já existir e estiver parado, inicie com:

```bash
docker start devtech-alunos
```

## Armazenamento

Os alunos são armazenados em um array na memória do navegador.
Ao atualizar ou fechar a página, os dados são perdidos.
Não há banco de dados.

## Estrutura

- index.html: formulário, tabela e botões dos relatórios.
- script.js: classe Aluno, operações de cadastro e relatórios.
- Dockerfile: configuração da imagem com Nginx.
- README.md: documentação do projeto.