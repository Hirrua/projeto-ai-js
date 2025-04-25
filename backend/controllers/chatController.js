import { GoogleGenerativeAI } from "@google/generative-ai";
import 'dotenv/config';
import pdf from 'pdf-parse/lib/pdf-parse.js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const chatWithGemini = async (req, res) => {
    try {
        if (!req.files?.curriculo || !req.body.descricao) {
            return res.status(400).json({ error: "Envie a descrição da vaga e o currículo (PDF ou Imagem)" });
        }

        const file = req.files.curriculo[0];
        const fileBuffer = file.buffer;
        const mimeType = file.mimetype;

        let contentParts = [
            {
                text: `Analise esta descrição de vaga e o currículo fornecido (que pode ser um PDF ou uma imagem) e retorne um JSON estruturado
                n\nDESCRIÇÃO DA VAGA:\n${req.body.descricao}\n\nRetorne apenas um JSON válido`
            }
        ];

        if (mimeType === 'application/pdf') {
            const pdfData = await pdf(fileBuffer);
            const textoCurriculo = pdfData.text;

            contentParts[0].text += `\n\n**TEXTO DO CURRÍCULO (Extraído do PDF):**\n${textoCurriculo}`;
        } else if (mimeType.startsWith('image/')) {

            contentParts[0].text = `Analise esta descrição de vaga e a imagem do currículo fornecida e retorne um JSON estruturado
            \n\nDESCRIÇÃO DA VAGA:\n${req.body.descricao}\n\nRetorne apenas um JSON válido`;

            contentParts.push({
                inlineData: {
                    mimeType: mimeType,
                    data: fileBuffer.toString('base64')
                }
            });

        } else {
            return res.status(400).json({ error: "Formato não suportado. Use PDF ou imagens (JPG/PNG)." });
        }

        contentParts[0].text += `\n\nEstrutura do JSON esperado:
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

        const result = await model.generateContent(contentParts);
        const response = await result.response;
        const text = response.text();

        const jsonString = text.replace(/```json|```/g, '').trim();
        const analise = JSON.parse(jsonString);

        res.json(analise);

    } catch (error) {
      console.error("Erro ao análise: ", error);
      res.status(500).json({ 
          error: error.message || "Erro ao processar a análise",
          details: error.stack 
      });
    }
};