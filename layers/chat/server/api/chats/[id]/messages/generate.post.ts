import {
	getMessagesByChatId,
	createMessageForChat,
	getChatByIdForUser,
} from "#layers/chat/server/repository/chatRepository";
import {
	createOpenAiModel,
	generateChatResponse,
} from "#layers/chat/server/services/ai-service";
import { getAuthenticatedUserId } from "#layers/auth/server/utils/auth";

export default defineEventHandler(async (event) => {
	const { id } = getRouterParams(event);

	if (!id) {
		throw createError({
			statusCode: 400,
			statusMessage: "Bad Request: Missing chat ID",
		});
	}

	const userId = await getAuthenticatedUserId(event);

	// Verify user owns the chat
	const chat = await getChatByIdForUser(id, userId);
	if (!chat) {
		throw createError({
			statusCode: 404,
			statusMessage: "Chat not found",
		});
	}

	const history = await getMessagesByChatId(id);
	const openai = createOpenAiModel(useRuntimeConfig().openaiApiKey);
	const reply = await generateChatResponse(history, openai);
	// const body = await readBody(event);

	return createMessageForChat({
		chatId: id,
		content: reply,
		role: "assistant",
	});
});
