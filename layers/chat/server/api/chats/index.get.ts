import { getAllChatsByUser } from "#layers/chat/server/repository/chatRepository";
import { getAuthenticatedUserId } from "#layers/auth/server/utils/auth";
// /**
//  * Cached event handler that retrieves all chats from the database.
//  *
//  * This handler implements server-side caching with custom invalidation logic.
//  * The cache is invalidated when a new chat is created, as indicated by the
//  * "chats:has-new-chat" flag in storage.
//  *
//  * @remarks
//  * Cache configuration:
//  * - `maxAge: 0` - Cache has no time-based expiration
//  * - `swr: false` - Stale-while-revalidate is disabled, meaning requests will wait
//  *   for fresh data instead of serving stale cached data while revalidating in the background
//  * - Custom invalidation based on "chats:has-new-chat" storage flag
//  *
//  * @returns Promise resolving to all chats from the database
//  */
// export default defineCachedEventHandler(
// 	async (event) => {
// 		const userId = await getAuthenticatedUserId(event);

// 		const storage = useStorage("db");
// 		await storage.setItem(`chats:has-new-chat:${userId}`, false);
// 		return getAllChatsByUser(userId);
// 	},
// 	{
// 		name: "getAllChats",
// 		maxAge: 0,
// 		swr: false,
// 		getKey: async (event) => {
// 			const userId = await getAuthenticatedUserId(event);
// 			return `getAllChats:${userId}`;
// 		},
// 		async shouldInvalidateCache(event) {
// 			const userId = await getAuthenticatedUserId(event);
// 			const storage = useStorage("db");
// 			const hasNewChat = await storage.getItem<boolean>(
// 				`chats:has-new-chat:${userId}`,
// 			);
// 			// jeśli jest nowy chat, to unieważniamy cache
// 			return hasNewChat || false;
// 		},
// 	},
// );

export default defineEventHandler(async (event) => {
	const userId = await getAuthenticatedUserId(event);

	return getAllChatsByUser(userId);
});
