import type { Chat } from "../types";
import { MOCK_CHAT } from "../composables/mockData";

export default function useChats() {
	const chats = useState<Chat[]>("chats", () => [MOCK_CHAT]);

	function createChat(options: { projectId?: string } = {}): Chat {
		const id = (chats.value.length + 1).toString();
		const chat: Chat = {
			id,
			title: `New Chat ${id}`,
			messages: [],
			projectId: options.projectId,
			createdAt: new Date(),
			updatedAt: new Date(),
		};
		chats.value.push(chat);
		return chat;
	}

	async function createChatAndNavigate(options: { projectId?: string } = {}) {
		const chat = createChat(options);
		if (chat.projectId) {
			await navigateTo(`/projects/${chat.projectId}/chats/${chat.id}`);
			return chat;
		}
		await navigateTo(`/chats/${chat.id}`);
		return chat;
	}

	function chatsInProject(projectId: string) {
		return chats.value.filter((c) => c.projectId === projectId);
	}

	return {
		chats,
		createChat,
		chatsInProject,
		createChatAndNavigate,
	};
}
