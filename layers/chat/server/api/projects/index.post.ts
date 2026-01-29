import { createProject } from "#layers/chat/server/repository/projectRepository";
import { CreateProjectSchema } from "#layers/chat/server/schemas";

export default defineEventHandler(async (event) => {
	const { success, data } = await readValidatedBody(
		event,
		CreateProjectSchema.safeParse,
	);

	if (!success) {
		return 400;
	}
	return createProject(data);
});
