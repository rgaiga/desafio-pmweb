# desafio-pmweb

Desafio técnico desenvolvido para a Pmweb.

## Dependências

- Node.js >= 16.17.1
- npm >= 8.15.0
- MongoDB >= 6.0.1

## Executando a aplicação

Após clonar o projeto, instale as dependências:

```bash
$ npm install
```

Depois, construa o projeto:

```bash
$ npm run build
```

E finalmente, execute a aplicação:

```bash
$ npm start
```

> **Observação:** É necessário haver uma instância do MongoDB ouvindo na porta 27017. É possível customizar a porta alterando o valor da variável **DATABASE_PORT** no arquivo **.env**.

Com isso, aplicação estará disponível em **http://localhost:3000/api/v1**.

## Documentação

Com a aplicação rodando, a documentação pode ser acessada em **http://localhost:3000/swagger-ui**.
