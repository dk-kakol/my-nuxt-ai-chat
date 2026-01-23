import { getProjectById } from "#layers/chat/server/repository/projectRepository";

export default defineEventHandler(async (event) => {
	const { id } = getRouterParams(event);
	return getProjectById(id);
});
