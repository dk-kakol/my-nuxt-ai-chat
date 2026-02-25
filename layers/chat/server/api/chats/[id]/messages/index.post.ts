import {
	createMessageForChat,
	getChatByIdForUser,
} from "#layers/chat/server/repository/chatRepository";
import { CreateMessageSchema } from "#layers/chat/server/schemas";
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

	// readBody is method from h3
	// https://v1.h3.dev/utils/request#body-utils
	// inne przydatne metody to:
	// getCookie(), getQuery(), getHeader()
	const { success, data } = await readValidatedBody(
		event,
		CreateMessageSchema.safeParse,
	);

	if (!success) {
		throw createError({
			statusCode: 400,
			statusMessage: "Bad Request",
		});
	}

	return createMessageForChat({
		chatId: id,
		content: data.content,
		role: data.role,
	});
});
