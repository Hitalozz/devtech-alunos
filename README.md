# DevTech Academy — Gerenciamento de Alunos

Projeto acadêmico para gerenciamento de alunos, desenvolvido com HTML,
JavaScript e Bootstrap, executado em um container Docker com Nginx.

## Funcionalidades

- Cadastro, listagem, edição e exclusão de alunos.
- Confirmação antes da exclusão.
- Cancelamento de edição.
- Busca por nome e filtro por curso.
- Resumo com total de alunos, aprovados e média da turma.
- Interface responsiva com Bootstrap.
- Mensagens de confirmação das operações.

## Relatórios

- Alunos aprovados, com nota final maior ou igual a 7.
- Média das notas.
- Média das idades.
- Nomes em ordem alfabética.
- Quantidade de alunos por curso.

Os relatórios e os cards de resumo consideram todos os alunos cadastrados,
independentemente da busca e do filtro da tabela.

## Tecnologias

- HTML5
- JavaScript
- Bootstrap 5.3.9 via CDN
- Docker
- Nginx

A interface utiliza verde (#004643) e bege (#F0EDE5),
com personalizações de cor diretamente no HTML.

## Conceitos utilizados

- Classe Aluno, construtor e métodos isAprovado() e toString().
- Armazenamento em array de objetos.
- Manipulação do DOM e eventos.
- Funções anônimas e arrow functions.
- Métodos filter, map, reduce, sort e forEach.

## Estrutura

- index.html: interface e componentes Bootstrap.
- script.js: cadastro, edição, exclusão, filtros e relatórios.
- puc-goias.svg: logotipo exibido no cabeçalho.
- Dockerfile: configuração da imagem com Nginx.
- README.md: documentação do projeto.

## Como executar com Docker

Com o Docker instalado e iniciado, abra o terminal na pasta do projeto.

Crie a imagem:

```bash
docker build -t devtech-alunos .
```

Crie e inicie o container:

```bash
docker run -d --name devtech-alunos -p 8080:80 devtech-alunos
```

Acesse: http://localhost:8080

É necessário acesso à internet para carregar o Bootstrap via CDN.

### Iniciar um container existente que está parado

```bash
docker start devtech-alunos
```

### Atualizar após alterar os arquivos

Reconstrua a imagem:

```bash
docker build -t devtech-alunos .
```

Após a construção terminar com sucesso, substitua o container antigo:

```bash
docker stop devtech-alunos
docker rm devtech-alunos
docker run -d --name devtech-alunos -p 8080:80 devtech-alunos
```

Atualize a página no navegador com Ctrl + F5.

## Armazenamento dos dados

Os dados são armazenados somente na memória do navegador.
Ao atualizar ou fechar a página, os cadastros são perdidos.
O projeto não utiliza banco de dados.

## Teste básico

1. Cadastre Ana, 20 anos, Python, nota 8.
2. Cadastre Bruno, 30 anos, Java, nota 6.
3. Confira: 2 alunos, 1 aprovado e média 7,00.
4. Edite a nota de Bruno para 10 e confira a média 9,00.
5. Teste a busca, o filtro por curso e os cinco relatórios.
6. Teste cancelar uma edição e confirmar ou cancelar uma exclusão.