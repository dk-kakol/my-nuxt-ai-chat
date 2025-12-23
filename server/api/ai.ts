// jeśli będzie w server/routes to będzie pod localhost:3000/ai
// teraz jest w server/api i będzie pod localhost:3000/api/ai
export default defineEventHandler(async (event) => {
	const body = await readBody(event);
	const { messages } = body;
	const id = messages.length.toString();
	const lastMessage = messages[messages.length - 1];

	// możesz zwrócić cokolwiek:
	// return 403;
	// return null (co da 204 No Content);
	// return '<h1>Hello World</h1>';
	// lub json
	return {
		id,
		role: "assistant",
		content: `You said: ${lastMessage.content}`,
	};
});
