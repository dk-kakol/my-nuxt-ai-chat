import {
	createOllamaModel,
	// createOpenAiModel,
	generateChatResponse,
} from "../services/ai-service";
import { ChatMessageSchema } from "#layers/chat/server/schemas";

// jeśli będzie w server/routes to będzie pod localhost:3000/ai
// teraz jest w server/api i będzie pod localhost:3000/api/ai
export default defineEventHandler(async (event) => {
	const { success, data } = await readValidatedBody(
		event,
		ChatMessageSchema.safeParse,
	);
	if (!success) {
		return 400;
	}

	const { messages } = data as {
		messages: ChatMessage[];
		chatId: string;
	};
	// const lastMessage = messages[messages.length - 1];

	// const openaiApiKey = useRuntimeConfig().openaiApiKey;
	// const openaiModel = createOpenAiModel(openaiApiKey);
	const ollamaModel = createOllamaModel();

	const response = await generateChatResponse(
		messages,
		// openaiModel
		// możesz też użyć ollamaModel
		ollamaModel,
	);
	// możesz zwrócić cokolwiek:
	// return 403;
	// return null (co da 204 No Content);
	// return '<h1>Hello World</h1>';
	// lub json
	return {
		id: messages.length.toString(),
		role: "assistant",
		// content: `You said: ${lastMessage.content}`,
		content: response,
	};
});
