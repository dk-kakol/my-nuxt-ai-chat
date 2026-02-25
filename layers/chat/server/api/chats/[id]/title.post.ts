import {
	updateChat,
	getChatByIdForUser,
} from "../../../repository/chatRepository";
import {
	createOpenAiModel,
	generateChatTitle,
} from "#layers/chat/server/services/ai-service";
import { UpdateChatTitleSchema } from "#layers/chat/server/schemas";
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

	const { success, data } = await readValidatedBody(
		event,
		UpdateChatTitleSchema.safeParse,
	);

	if (!success) {
		throw createError({
			statusCode: 400,
			statusMessage: "Bad Request",
		});
	}

	const model = createOpenAiModel(useRuntimeConfig().openaiApiKey);
	const title = await generateChatTitle(model, data.message);

	return updateChat(id, { title });
});
