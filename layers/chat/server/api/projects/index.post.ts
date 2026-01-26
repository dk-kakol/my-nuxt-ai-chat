import { createProject } from "#layers/chat/server/repository/projectRepository";

export default defineEventHandler(async (event) => {
	const { name } = await readBody(event);
	return createProject({ name });
});
