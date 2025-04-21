# Visualiza.AI

> Trabalho da disciplina de inteligência articial da Faculdade Antonio Meneghetti.

Esse projeto é uma aplicação, onde consta com integração com o Gemini, onde é utilizado para dar feedback de adequação do curriculo do profissional referente a uma vaga especifica.

## Back-end

Back-end foi desenvolvido uma API simples em NodeJs/Express, onde possui um **prompt** para a LLM ter um contexto de como deve se portar ao responder.

- Descrição da vaga
- Texto do currículo
- Retorno JSON
- Regras a serem seguidas pelo Gemini

Para envio dos arquivos, foi configurado a biblioteca **multer** e a biblioteca **pdf-parse** para capturar o texto contido no curriculo.

Para rodar o back-end, crie um arquivo .env onde conste `GEMINI_API_KEY` com sua respectiva chave

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