import { getAllProjects } from "#layers/chat/server/repository/projectRepository";

export default defineEventHandler(async (_event) => {
	return getAllProjects();
});
