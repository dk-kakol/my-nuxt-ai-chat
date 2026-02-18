import { getProjectById } from "#layers/chat/server/repository/projectRepository";

export default defineEventHandler(async (event) => {
	const { id } = getRouterParams(event);

	if (!id) {
		throw createError({
			statusCode: 400,
			statusMessage: "Bad Request: Missing project ID",
		});
	}

	return getProjectById(id);
});
