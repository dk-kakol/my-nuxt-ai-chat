import type {
	ChatWithMessages,
	Message,
} from "#layers/chat/shared/types/types";

export default function useChats() {
	// const { data: chats, execute, status } = useAsyncData<Chat[]>(
	// 	"chats",
	// 	() => {
	// 		// console.log("ten fetch wykona się tylko po stronie serwera");
	// 		return $fetch<Chat[]>("/api/chats");
	// 	},
	// 	{
	// 		immediate: false,
	// 		default: () => [],
	// 	},
	// );

	const chats = useState<ChatWithMessages[]>("chats", () => []);

	const { data, execute, status } = useFetch<ChatWithMessages[]>("/api/chats", {
		immediate: false,
		default: () => [],
		headers: useRequestHeaders(["cookie"]),
	});

	async function fetchChats(refresh = false) {
		// console.log("Taki fetch wykona się zarówno po stronie serwera, jak i klienta");
		// const fetchedChats = await $fetch<Chat[]>("/api/chats");
		// chats.value = fetchedChats;
		if (status.value !== "idle" && !refresh) return;
		await execute();
		chats.value = data.value || [];
	}

	async function prefetchChatMessages() {
		const recentChats = chats.value
			.toSorted(
				(a, b) =>
					new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
			)
			.slice(0, 2);

		await Promise.all(
			recentChats.map(async (chat) => {
				try {
					const messages = await $fetch<Message[]>(
						`/api/chats/${chat.id}/messages`,
						{
							headers: useRequestHeaders(["cookie"]),
						},
					);

					const targetChat = chats.value.find((c) => c.id === chat.id);
					if (targetChat) {
						targetChat.messages = messages;
					}
				} catch (error) {
					console.error(`Failed to fetch messages for chat ${chat.id}`, error);
				}
			}),
		);
	}

	async function createChat(
		options: { projectId?: string; title?: string } = {},
	) {
		try {
			const newChat = await $fetch<ChatWithMessages>("/api/chats", {
				method: "POST",
				headers: useRequestHeaders(["cookie"]),
				body: {
					title: options.title,
					projectId: options.projectId,
				},
			});
			chats.value.push(newChat);
			return newChat;
		} catch (error) {
			console.error("Failed to create chat:", error);
			throw error;
		}
	}

	async function createChatAndNavigate(options: { projectId?: string } = {}) {
		try {
			const chat = await createChat(options);
			if (!chat || !chat.id) {
				throw new Error("Failed to create chat");
			}
			if (chat.projectId) {
				await navigateTo(`/projects/${chat.projectId}/chats/${chat.id}`);
			} else {
				await navigateTo(`/chats/${chat.id}`);
			}
		} catch (error) {
			console.error("Failed to create chat and navigate:", error);
			throw error;
		}
	}

	function chatsInProject(projectId: string) {
		return chats.value.filter((c) => c.projectId === projectId);
	}

	return {
		chats,
		createChat,
		chatsInProject,
		createChatAndNavigate,
		fetchChats,
		prefetchChatMessages,
	};
}
