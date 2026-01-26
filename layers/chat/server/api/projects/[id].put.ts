import {
	updateProject,
	getProjectById,
} from "#layers/chat/server/repository/projectRepository";

export default defineEventHandler(async (event) => {
	const { id } = getRouterParams(event);
	const project = await getProjectById(id);
	if (!project) return null;
	const body = await readBody(event);
	return updateProject(id, { name: body.name });
});
