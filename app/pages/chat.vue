<script setup lang="ts">
const { chat, messages, sendMessage } = useChat();
useHead({
	title: chat.value?.title ? `Chat - ${chat.value.title}` : "Chat - Nuxt Chat",
});
</script>
<template>
	<ChatWindow :chat :messages @send-message="sendMessage" />
</template>
