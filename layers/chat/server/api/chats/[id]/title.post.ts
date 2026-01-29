import { updateChat } from "../../../repository/chatRepository";
import {
	createOpenAiModel,
	generateChatTitle,
} from "#layers/chat/server/services/ai-service";
import { UpdateChatTitleSchema } from "#layers/chat/server/schemas";

export default defineEventHandler(async (event) => {
	const { id } = getRouterParams(event);
	const { success, data } = await readValidatedBody(
		event,
		UpdateChatTitleSchema.safeParse,
	);

	if (!success) {
		return 400;
	}

	const model = createOpenAiModel(useRuntimeConfig().openaiApiKey);
	const title = await generateChatTitle(model, data.message);

	return updateChat(id, { title });
});
