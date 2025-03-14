<template>
	<div id="container">
		<div class="title-container" @click="updateFocus">
			<h4>{{ title }}</h4>
		</div>
		<div class="example">
			<QuickMenu class="menu" v-if="showMenu"/>
			<div class="panel"></div>
			<TabIcon 
				:line-number="line" 
				:start-position="position"
				:start-state="state"
				:suggestion-hover="suggestionHover"
				:completed="isCompleted"
				@completed="isCompleted = true; state = 'active'"
				@inBounds="inBounds = true"
				@active="state = 'active'; position = 'center'"
				@mouseenter="handleTabHover()"
				@mouseleave="showMenu = false"
			/>
			<div v-if="inBounds" class="editor suggestion" @click="updateFocus">
				<div v-if="!isCompleted" class="code-suggestion">
					<div class="original-code">Original code</div>
					<div class="updated-code"
						@mouseenter="suggestionHover = true"
						@mouseleave="suggestionHover = false"
						@click="isCompleted = true; state = 'active'">
					Updated code</div>
				</div>
				<div v-else class="code-suggestion completed">
					Code has been updated
				</div>
				<FlashingCursor v-if="state !== 'unfocused'" :class="state === 'pending' ? 'above': ''"/>
				<div class="line-numbers">
					<span>{{ line - 2 }}</span>
					<span>{{ line - 1 }}</span>
					<span>{{ line }}</span>
					<span>{{ line + 1 }}</span>
					<span>{{ line + 2 }}</span>
				</div>
			</div>
			<div v-else class="editor" @click="updateFocus">
				<div class="code-suggestion other">
					<span v-if="startPosition == 'above'">The code suggestion is somewhere above the viewport</span>
					<span v-else>The code suggestion is somewhere below the viewport</span>
					<FlashingCursor v-if="state !== 'unfocused'" :class="state === 'pending' ? 'above': ''"/>
				</div>
				<div class="line-numbers">
					<span>{{ line - 2 }}</span>
					<span>{{ line - 1 }}</span>
					<span>{{ line }}</span>
					<span>{{ line + 1 }}</span>
					<span>{{ line + 2 }}</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import FlashingCursor from "./FlashingCursor.vue";
import TabIcon from "./TabIcon.vue";
import QuickMenu from "./QuickMenu.vue";

export default {
	name: "TabExample",
	components: {
		TabIcon,
		FlashingCursor,
		QuickMenu,
	},
	props: {
		title: {
			type: String,
			default: "Tab Example",
		},
		startState: {
			type: String,
			default: 'active'
		},
		lineNumber: {
			type: String,
			default: '0'
		},
		startPosition: {
			type: String,
			default: 'center'
		},
	},
	mounted() {
		this.inBounds = this.startPosition === 'center';
		console.log(this.lineNumber);
	},
	data() {
		return {
			suggestionHover: false,
			isCompleted: false,
			inBounds: false, // Set this to true or false based on your logic
			state: this.startState,
			position: this.startPosition,
			showMenu: false,
			line: parseInt(this.lineNumber),
		};
	},
	methods: {
		updateFocus() {
			if (this.startState === 'unfocused') {
				this.state = 'pending';
			}
		},
		handleTabHover() {
			console.log('Tab hovered');
			console.log(this.state);
			console.log(this.position);
			if (this.position === 'center' && this.state !== 'unfocused') {
				this.showMenu = true;
			}
		}
	},
};
</script>

<style scoped>
#container {
	position: relative;
	text-align: center;
	background-color: #1e1e1e;
	display: flex;
	flex-direction: column;
	gap: 8px;
}

tab-icon {
	z-index: 1000;
}

.menu {
	position: absolute;
	z-index: 1000;
	top: -42px;
	left: 0;
}

.panel {
	width: 30px;
    height: 100%;
    position: absolute;
    background: rgb(37, 37, 38);
    top: 0;
    transform: translateX(-32px);
    z-index: 999;
}

.title-container {
	gap: 10px;
	color: white;
	font-family: 'Menlo', 'Courier New', Courier, monospace;
	font-size: 16px;
	font-weight: 300;
	opacity: 0.6;
	display: flex;}

.example {
	display: flex;
	gap: 20px;
	align-items: center;
	position: relative;
	height: 100px;
}

.editor {
	position: absolute;
	width: 600px;
	height: 100px;
	left: 48px;
	background-color: #2d2d2d;
	border-radius: 4px;
	display: flex;
	align-items: center;
	justify-content: start;
	padding-left: 24px;
}

.code-suggestion {
	position: absolute;
	width: 500px;
	display: flex;
	align-items: center;
	justify-content: center;
	color: white;
	font-family: 'Menlo', 'Courier New', Courier, monospace;
	font-weight: 300;
	font-size: 12px;
}

.code-suggestion.completed, .code-suggestion.other {
	justify-content: start;
	padding: 0 8px;
}


.code-suggestion div {
    height: 18px;
    padding: 0 8px;
    flex-grow: 1;
    display: flex;
    align-items: center;
}

.original-code {
    background-color: #ff000033;
    color: #fff;
    border: 1px solid #ff000066;
    border-right: none;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
}

.updated-code {
    background-color: #9BB95533;
    color: #fff;
    border: 1px solid #9BB95566;
    border-left: none;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
	cursor: pointer;
}

.line-numbers {
	position: absolute;
    top: 0;
    left: -63px;
    width: 60px;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: end;
    justify-content: center;
    color: #858585;
    font-family: 'Menlo', 'Courier New', Courier, monospace;
    font-weight: 300;
    font-size: 12px;
    line-height: 19px;
    margin-right: 4px;
}

.above {
	margin-bottom: 38px;
}

/* Keyframes for background animation */
@keyframes backgroundFadeIn {
    from {
        background-color: #9BB95533;
    }
    to {
        background-color: transparent; /* Corrected to use transparent without the '#' */
    }
}

/* Apply the animation to the .code-suggestion.completed class */
.code-suggestion.completed {
    animation: backgroundFadeIn 1s ease-in-out;
}

h4 {
	margin: 0;
	font-weight: 300;
	font-size: 14px;
}
</style>