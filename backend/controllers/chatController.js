import { GoogleGenerativeAI } from "@google/generative-ai";
import 'dotenv/config';
import pdf from 'pdf-parse/lib/pdf-parse.js';
import 'dotenv/config';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const chatWithGemini = async (req, res) => {
  try {
      if (!req.files?.curriculo || !req.body.descricao) {
          return res.status(400).json({ error: "Envie a descrição da vaga e o currículo em PDF" });
      }

      const pdfBuffer = req.files.curriculo[0].buffer;
      const pdfData = await pdf(pdfBuffer);
      const textoCurriculo = pdfData.text;

      const prompt = `Analise esta descrição de vaga e currículo e retorne um JSON estruturado com os seguintes campos:
      
      **DESCRIÇÃO DA VAGA:**
      ${req.body.descricao}

      **TEXTO DO CURRÍCULO:**
      ${textoCurriculo}

      Retorne APENAS um JSON válido (sem markdown) com esta estrutura:
      {
          "pontos_fortes": [string],
          "pontos_fracos": [string],
          "percentual_adequacao": number,
          "explicacao_adequacao": string,
          "correspondencias_chave": [string],
          "alertas": [string],
          "sugestoes_palavras_chave": [string],
          "melhorias_curriculo": [string]
      }

      Regras:
      - Pontos fortes: lista de até 10 competências alinhadas à vaga
      - Pontos fracos: lista de até 5 deficiências em relação à vaga
      - Percentual: 0-100 baseado na adequação técnica
      - Explicação: 2-3 frases resumindo a avaliação
      - Correspondências: termos técnicos relevantes encontrados
      - Alertas: pontos críticos para verificação
      - Sugestões: palavras-chave faltantes para incluir
      - Melhorias: sugestões práticas para o currículo`;

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonString = text.replace(/```json|```/g, '').trim();
      const analise = JSON.parse(jsonString);

      res.json(analise);

  } catch (error) {
      console.error("Erro na análise:", error);
      res.status(500).json({ 
          error: error.message || "Erro ao processar a análise",
          details: error.stack 
      });
  }
};