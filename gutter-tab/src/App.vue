<template>
	<div id="app">
		<TabExample 
			title="In viewport, Cursor inside suggestion"
			start-position="center"
			line-number="30000"
		/>
		<TabExample 
			title="In viewport, Cursor outside suggestion"
			start-position="center"
			start-state="pending"
			line-number="3000"
		/>
		<TabExample 
			title="In viewport, Cursor outside of editor focus"
			start-position="center"
			start-state="unfocused"
			line-number="300"
		/>

		<TabExample 
			title="Above viewport, Cursor inside suggestion"
			start-position="above"
			line-number="30"
		/>
		<TabExample 
			title="Above viewport, Cursor outside suggestion"
			start-position="above"
			start-state="pending"
			line-number="3"
		/>
		<TabExample 
			title="Above viewport, Cursor outside of editor focus"
			start-position="above"
			start-state="unfocused"
			line-number="300"
		/>

		<TabExample 
			title="Below viewport, Cursor inside suggestion"
			start-position="below"
			line-number="300"
		/>
		<TabExample 
			title="Below viewport, Cursor outside suggestion"
			start-position="below"
			start-state="pending"
			line-number="300"
		/>
		<TabExample 
			title="Below viewport, Cursor outside of editor focus"
			start-position="below"
			start-state="unfocused"
			line-number="300"
		/>
		
		<TabMultilineExample 
			title="In viewport, Cursor inside suggestion"
			start-position="center"
			line-number="30000"
		/>
	</div>
</template>

<script>
import TabExample from "./components/TabExample.vue";
import TabMultilineExample from "./components/TabMultilineExample.vue";

export default {
	name: "App",
	components: {
		TabExample,
		TabMultilineExample,
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