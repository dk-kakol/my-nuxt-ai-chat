<template>
	<div class="layout-container">
		<main class="main-content">
			<slot />
		</main>
	</div>
</template>

<style scoped>
.layout-container {
	height: calc(100vh - 4rem);
	background-color: var(--ui-background);
}

.main-content {
	height: 100%;
	margin-top: 4rem;
}
</style>
