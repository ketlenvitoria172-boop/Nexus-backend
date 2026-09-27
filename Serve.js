import express from "express";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

app.post("/api/chat", async (req, res) => {
    try {
        const messages = req.body.messages || [];

        if (!messages.length) {
            return res.status(400).json({
                error: "Nenhuma mensagem foi enviada."
            });
        }

        const conversation = messages.map(message => {
            const role = message.role === "assistant"
                ? "NEXUS"
                : "Usuário";

            return `${role}: ${message.content}`;
        }).join("\n\n");

        const response = await ai.models.generateContent({
            model: "gemini-3.8-flash",
            contents: `
Você é o NEXUS, um assistente pessoal de IA.
Responda em português do Brasil.
Seja claro, útil e direto.

Conversa:
${conversation}
`
        });

        res.json({
            reply: response.text
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Não foi possível conectar à IA."
        });
    }
});

app.get("/", (req, res) => {
    res.send("NEXUS Backend online.");
});

app.listen(PORT, () => {
    console.log(`NEXUS Backend rodando na porta ${PORT}`);
});
