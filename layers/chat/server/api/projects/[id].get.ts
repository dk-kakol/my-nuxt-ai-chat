import { getProjectByIdForUser } from "#layers/chat/server/repository/projectRepository";
import { getAuthenticatedUserId } from "#layers/auth/server/utils/auth";

export default defineEventHandler(async (event) => {
	const { id } = getRouterParams(event);

	if (!id) {
		throw createError({
			statusCode: 400,
			statusMessage: "Bad Request: Missing project ID",
		});
	}

	const userId = await getAuthenticatedUserId(event);

	const project = await getProjectByIdForUser(id, userId);

	if (!project) {
		throw createError({
			statusCode: 404,
			statusMessage: "Project not found",
		});
	}

	return project;
});
