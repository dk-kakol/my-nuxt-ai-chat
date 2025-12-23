import type { Chat, ChatMessage } from "@/types";
import { MOCK_CHAT } from "@/composables/mockData";

export default function useChat() {
	const chat = ref<Chat>(MOCK_CHAT);
	const messages = computed<ChatMessage[]>(() => chat.value.messages);

	function createMessage(
		message: string,
		role: ChatMessage["role"]
	): ChatMessage {
		const id = messages.value.length.toString();

		return {
			id,
			role,
			content: message,
		};
	}

	async function sendMessage(message: string) {
		messages.value.push(createMessage(message, "user"));

		// nie trzeba parsować, $fetch to robi automatycznie
		// oczywiście możesz też użyć axiosa, ale jest on dość ciężki i zwykły $fetch
		// jest wbudowany w Nuxt'a
		const data = await $fetch<ChatMessage>("/api/ai", {
			method: "POST",
			body: {
				messages: messages.value,
			},
		});

		messages.value.push(data);
	}

	return {
		chat,
		messages,
		sendMessage,
	};
}
