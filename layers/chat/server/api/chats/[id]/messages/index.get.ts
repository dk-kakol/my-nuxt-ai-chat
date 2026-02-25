import {
	getMessagesByChatId,
	getChatByIdForUser,
} from "#layers/chat/server/repository/chatRepository";
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

	const messages = await getMessagesByChatId(id);
	return messages;
});
