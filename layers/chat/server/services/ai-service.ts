import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { ollama } from "ai-sdk-ollama";
import type { ModelMessage, LanguageModel } from "ai";

export const createOllamaModel = () => {
	return ollama("llama3.2");
};

export const createOpenAiModel = (apiKey: string) => {
	const openai = createOpenAI({ apiKey });
	return openai("gpt-4o-mini");
};

export async function generateChatResponse(
	messages: ModelMessage[],
	model: LanguageModel
) {
	if (!Array.isArray(messages) || messages.length === 0) {
		throw new Error("Invalid messages format");
	}

	const response = await generateText({
		model,
		messages,
	});

	return response.text.trim();
}
