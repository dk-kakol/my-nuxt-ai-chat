import { createProject } from "#layers/chat/server/repository/projectRepository";
import { CreateProjectSchema } from "#layers/chat/server/schemas";

export default defineEventHandler(async (event) => {
	const { success, data } = await readValidatedBody(
		event,
		CreateProjectSchema.safeParse,
	);

	if (!success) {
		throw createError({
			statusCode: 400,
			statusMessage: "Bad Request",
		});
	}
	return createProject(data);
});
