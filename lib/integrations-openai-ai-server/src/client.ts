import OpenAI from "openai";

function createOpenAIClient(): OpenAI {
  const baseURL = process.env.AI_INTEGRATIONS_OPENAI_BASE_URL;
  const integrationKey = process.env.AI_INTEGRATIONS_OPENAI_API_KEY;
  const directKey = process.env.OPENAI_API_KEY;

  if (baseURL && integrationKey) {
    return new OpenAI({ apiKey: integrationKey, baseURL });
  }

  if (directKey) {
    return new OpenAI({ apiKey: directKey });
  }

  throw new Error(
    "OpenAI is not configured. Set OPENAI_API_KEY or provision the Replit OpenAI AI integration.",
  );
}

export const openai = createOpenAIClient();
