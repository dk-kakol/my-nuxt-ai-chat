import { generateText, streamText } from "ai";
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
	model: LanguageModel,
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

export async function generateChatTitle(
	model: LanguageModel,
	firstMessage: string,
): Promise<string> {
	const response = await generateText({
		model,
		messages: [
			{
				role: "system",
				content:
					"You are a helpful assistant that generates concise, descriptive titles for chat conversations. Generate a title that captures the essence of the first message in 3 short words or less.",
			},
			{
				role: "user",
				content: firstMessage,
			},
		],
	});
	return response.text.trim();
}

export async function streamChatResponse(
	model: LanguageModel,
	messages: ModelMessage[],
) {
	if (!Array.isArray(messages) || messages.length === 0) {
		throw new Error("Invalid messages format");
	}

	return streamText({
		model,
		messages,
	}).textStream;
}
