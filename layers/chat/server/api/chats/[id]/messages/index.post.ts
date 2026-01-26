import { createMessageForChat } from "#layers/chat/server/repository/chatRepository";

export default defineEventHandler(async (event) => {
	const { id } = getRouterParams(event);
	// readBody is method from h3
	// https://v1.h3.dev/utils/request#body-utils
	// inne przydatne metody to:
	// getCookie(), getQuery(), getHeader()
	const body = await readBody(event);

	return createMessageForChat({
		chatId: id,
		content: body.content,
		role: body.role,
	});
});
