<script setup lang="ts">
const route = useRoute();
const {
	chat: chatFromChats,
	messages,
	sendMessage,
	fetchMessages,
} = useChat(route.params.id as string);

await fetchMessages();

if (!chatFromChats.value) {
	await navigateTo("/", { replace: true });
}
const chat = computed<Chat>(() => {
	return chatFromChats.value as Chat;
});

const typing = ref(false);
const handleSendMessage = async (message: string) => {
	typing.value = true;
	await sendMessage(message);
	typing.value = false;
};

const appConfig = useAppConfig();

const title = computed(() => {
	return chatFromChats.value?.title
		? `${chatFromChats.value.title} - ${appConfig.title}`
		: `${appConfig.title}`;
});

useHead({
	title: title.value,
});

async function handleError() {
	await navigateTo("/", { replace: true });
}
</script>

<template>
	<NuxtErrorBoundary>
		<ChatWindow :typing :chat :messages @send-message="handleSendMessage" />

		<template #error="{ error }">
			<UContainer
				v-if="error"
				class="flex justify-center items-center h-full p-4"
			>
				<UCard variant="soft" class="min-w-md">
					<template #header>
						<h1 class="text-lg font-bold">Error - {{ error }}</h1>
					</template>

					<p>{{ error.message }}</p>

					<UButton
						class="mt-4"
						color="primary"
						variant="soft"
						icon="i-heroicons-arrow-left"
						@click="handleError"
					>
						Go back home
					</UButton>
				</UCard>
			</UContainer>
		</template>
	</NuxtErrorBoundary>
</template>
