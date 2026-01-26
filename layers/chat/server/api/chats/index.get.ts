import { getAllChats } from "#layers/chat/server/repository/chatRepository";

export default defineEventHandler(async (_event) => {
	return getAllChats();
});
