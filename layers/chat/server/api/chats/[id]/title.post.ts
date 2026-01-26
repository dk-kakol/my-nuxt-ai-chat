import { updateChat } from "../../../repository/chatRepository";
import {
	createOpenAiModel,
	generateChatTitle,
} from "#layers/chat/server/services/ai-service";

export default defineEventHandler(async (event) => {
	const { id } = getRouterParams(event);
	const { message } = await readBody(event);

	const model = createOpenAiModel(useRuntimeConfig().openaiApiKey);
	const title = await generateChatTitle(model, message);

	return updateChat(id, { title });
});
