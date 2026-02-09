<script setup lang="ts">
// import type { NuxtError } from "#app";
// defineProps<{ error: NuxtError }>();

// w kursie używają useError,
// ale error może być undefined => w stosunku do kursu trzeba jeszcze dodać v-if="error" w template
// inną opcja jest użycie defineProps (tak jest w aktualnych docsach) i wtedy nie trzeba tego v-if
const error = useError();

function handleError() {
	// uwaga tutaj bo możesz wpaść w pętlę jeśli strona domowa też będzie miała błąd.
	// App musi być w dobrym stanie
	clearError({ redirect: "/" });
}
</script>

<template>
	<UContainer v-if="error" class="flex justify-center items-center h-full p-4">
		<UCard variant="soft" class="min-w-md">
			<template #header>
				<h1 class="text-lg font-bold">Error! - {{ error.statusCode }}</h1>
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
