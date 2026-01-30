<script setup lang="ts">
const config = useRuntimeConfig();
console.log(config);

const { fetchChats, prefetchChatMessages } = useChats();
const { fetchProjects } = useProjects();
await Promise.all([fetchChats(), fetchProjects()]);

await callOnce(prefetchChatMessages);
</script>

<template>
	<UApp>
		<NuxtRouteAnnouncer />
		<NuxtLayout>
			<NuxtPage />
		</NuxtLayout>
	</UApp>
</template>
