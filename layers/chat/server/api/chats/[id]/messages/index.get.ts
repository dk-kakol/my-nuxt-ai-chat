import { getMessagesByChatId } from "#layers/chat/server/repository/chatRepository";

export default defineEventHandler(async (event) => {
	const { id } = getRouterParams(event);

	if (!id) {
		throw createError({
			statusCode: 400,
			statusMessage: "Bad Request: Missing chat ID",
		});
	}

	const messages = await getMessagesByChatId(id);
	return messages;
});
