# Analisa.AI

> Trabalho da disciplina de inteligência articial da Faculdade Antonio Meneghetti.

Esse projeto é uma aplicação, onde consta com integração com o Gemini, onde é utilizado para dar feedback de adequação do curriculo do profissional referente a uma vaga especifica.

O projeto suporta envio de texto (descrição da vaga), curriculo (PDF ou Imagem).

## Incialização

Instale as dependências do back-end e front-end com o comando `npm i`

Após a instalação, entre no diretório backend/ e em outro terminal frontend/ agora rode o comando `npm run dev` em ambos.

Para rodar o back-end, crie um arquivo **.ENV** onde conste `GEMINI_API_KEY` com sua respectiva chave

## Back-end

Back-end foi desenvolvido uma API simples em NodeJs/Express, onde possui um **prompt** para a LLM ter um contexto de como deve se portar ao responder.

A integração é com o Gemini 1.5 Flash, uma API externa, que requer a chave de acesso.

- Descrição da vaga
- Texto do currículo
- Retorno JSON
- Regras a serem seguidas pelo Gemini

Para envio dos arquivos, foi configurado a biblioteca **multer** e a biblioteca **pdf-parse** para capturar o texto contido no curriculo.

O back-end está rodando na porta **3333**, para testar, crie um requisição POST utilizando form-data.

## Front-end

O front-end foi desenvolvido utilizando NextJs, por já ter mais familiaridade com a sua estrutura.

Na pasta **api** configurado a rota de **POST**, onde utilizamos **form-data** para enviar os dados

Foi utilizado a biblioteca  **axios** para realizar as requisições.

No `page.js` enviamos o post para rota do back-end, aguardamos analisar e temos um retorno de alguns aspectos:

- Pontos fortes
- Pontos fracos
- Resumo da avaliação
- % de adequação à aquela vaga
- Alertas, onde precisa melhorar e sugestões

## Dependências

- Back-end

```json
  "dependencies": {
    "@google/generative-ai": "^0.24.0",
    "cors": "^2.8.5",
    "dotenv": "^16.5.0",
    "express": "^5.1.0",
    "multer": "^1.4.5-lts.2",
    "node-fetch": "^3.3.2",
    "pdf-parse": "^1.1.1",
    "tesseract.js": "^6.0.1"
  },
  "devDependencies": {
    "nodemon": "^3.1.9"
  }
```

- Front-end

```json
  "dependencies": {
    "axios": "^1.8.4",
    "next": "15.3.1",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "tailwindcss": "^4"
  }
```