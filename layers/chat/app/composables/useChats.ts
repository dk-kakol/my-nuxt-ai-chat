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

	const chats = useState<Chat[]>("chats", () => []);

	const { data, execute, status } = useFetch<Chat[]>("/api/chats", {
		immediate: false,
		default: () => [],
	});

	async function fetchChats() {
		// console.log("Taki fetch wykona się zarówno po stronie serwera, jak i klienta");
		// const fetchedChats = await $fetch<Chat[]>("/api/chats");
		// chats.value = fetchedChats;
		if (status.value !== "idle") return;
		await execute();
		chats.value = data.value;
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
					const messages = await $fetch<ChatMessage[]>(
						`/api/chats/${chat.id}/messages`,
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
		const newChat = await $fetch<Chat>("/api/chats", {
			method: "POST",
			body: {
				title: options.title,
				projectId: options.projectId,
			},
		});
		chats.value.push(newChat);
		return newChat;
	}

	async function createChatAndNavigate(options: { projectId?: string } = {}) {
		const chat = await createChat(options);
		if (chat.projectId) {
			await navigateTo(`/projects/${chat.projectId}/chats/${chat.id}`);
		} else {
			await navigateTo(`/chats/${chat.id}`);
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
