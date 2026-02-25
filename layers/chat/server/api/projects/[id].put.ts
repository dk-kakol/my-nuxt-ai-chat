import {
	updateProject,
	getProjectByIdForUser,
} from "#layers/chat/server/repository/projectRepository";

import { UpdateProjectSchema } from "#layers/chat/server/schemas";
import { getAuthenticatedUserId } from "#layers/auth/server/utils/auth";

export default defineEventHandler(async (event) => {
	const { id } = getRouterParams(event);
	const userId = await getAuthenticatedUserId(event);

	if (!id) {
		throw createError({
			statusCode: 400,
			statusMessage: "Bad Request: Missing project ID",
		});
	}

	const project = await getProjectByIdForUser(id, userId);
	if (!project) {
		throw createError({
			statusCode: 404,
			statusMessage: "Project not found",
		});
	}
	const { success, data } = await readValidatedBody(
		event,
		UpdateProjectSchema.safeParse,
	);
	if (!success) {
		throw createError({
			statusCode: 400,
			statusMessage: "Bad Request",
		});
	}
	return updateProject(id, data);
});
