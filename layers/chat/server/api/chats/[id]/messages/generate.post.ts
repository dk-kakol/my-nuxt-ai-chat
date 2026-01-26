import {
	getMessagesByChatId,
	createMessageForChat,
} from "#layers/chat/server/repository/chatRepository";
import {
	createOpenAiModel,
	generateChatResponse,
} from "#layers/chat/server/services/ai-service";

export default defineEventHandler(async (event) => {
	const { id } = getRouterParams(event);
	const history = getMessagesByChatId(id);
	const openai = createOpenAiModel(useRuntimeConfig().openaiApiKey);
	const reply = await generateChatResponse(history, openai);
	// const body = await readBody(event);

	return createMessageForChat({
		chatId: id,
		content: reply,
		role: "assistant",
	});
});
