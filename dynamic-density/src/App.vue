<template>
	<div id="app">
		<ActivityBar />
	</div>
</template>

<script>
import ActivityBar from "./components/ActivityBar.vue";

export default {
	name: "App",
	components: {
		ActivityBar,
	},
};
</script>

<style>
#app {
	text-align: center;
	padding: 20px;
	background-color: #1e1e1e;
	display: flex;
	flex-direction: column;
	gap: 64px;
}
</style>