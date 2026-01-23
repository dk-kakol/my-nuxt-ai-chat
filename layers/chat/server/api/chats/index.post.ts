import { createChat } from "#layers/chat/server/repository/chatRepository";

export default defineEventHandler(async (event) => {
	const { title, projectId } = await readBody(event);

	return createChat({
		title,
		projectId,
	});
});
