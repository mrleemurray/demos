<template>
    <div :class="`tab-icon ${state} ${computedIsCollapsed ? 'collapsed' : ''} ${isCompleted ? 'completed' : ''} ${position} ${suggestionHover ? 'pulse-outline' : ''}`"
         @mouseenter="isHovered = true" @mouseleave="isHovered = false" @click="handleClick">
        <span>{{ lineNumber }}</span>
        <div v-html="(isHovered && position === 'center') || suggestionHover ? check : currentIcon" class="icon" ></div>
    </div>
</template>

<script>
import keyboardTab from '../assets/icons/keyboard-tab.svg?raw';
import arrowUp from '../assets/icons/arrow-up.svg?raw';
import arrowDown from '../assets/icons/arrow-down.svg?raw';
import check from '../assets/icons/check.svg?raw';

export default {
    name: "TabIcon",
    props: {
        startState: {
            type: String,
            default: 'active'
        },
        lineNumber: {
            type: Number,
            default: 0
        },
        startPosition: {
            type: String,
            default: 'center'
        },
        suggestionHover: {
            type: Boolean,
            default: false
        },
        completed: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            position: this.startPosition,
            state: this.startState,
            isHovered: false,
            isCompleted: false,
            keyboardTab: keyboardTab,
            arrowUp: arrowUp,
            arrowDown: arrowDown,
            check: check
        };
    },
    mounted() {
        this.state = this.startState;
        this.position = this.startPosition;
    },
    watch: {
        startState(newState) {
            this.state = newState;
        },
        position(newPosition) {
            this.position = newPosition;
        },
        completed(newCompleted) {
            this.isCompleted = newCompleted;
        }
    },
    computed: {
        computedIsCollapsed() {
            return this.position === 'above' || this.position === 'below';
        },
        currentIcon() {
            if (this.position === 'above') {
                return this.arrowDown;
            } else if (this.position === 'below') {
                return this.arrowUp;
            } else {
                return this.keyboardTab;
            }
        }
    },
    methods: {
        handleClick() {
            if (this.position === 'above' || this.position === 'below') {
                this.position = 'center'
                this.$emit('inBounds')
                this.state = 'active';
                this.$emit('active');
                return;
            }

            // if (this.state === 'active' || this.state === 'pending') {
                this.isCompleted = true;
                this.$emit('completed');
            // }
        }
    }
};
</script>

<style scoped>
.tab-icon {
    position: relative;
    display: flex;
    gap: 2px;
    align-items: center;
    justify-content: end;
    padding: 1px 3px;
    background-color: transparent; /* Set the background to transparent */
    border-radius: 4px;
    width: 60px;
    font-family: 'Menlo', 'Courier New', Courier, monospace;
    font-weight: 300;
    font-size: 12px;
    color: #fff;
    cursor: pointer;
    z-index: 100; /* Ensure the parent element has a higher z-index */
    transition: width 0.2s ease; /* Add transition for width */
}

.completed {
    opacity: 0;
}

.tab-icon::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: #FFF; /* Set the background color here */
    z-index: -1; /* Ensure the ::before element is behind its parent */
    border-radius: 4px; /* Match the border-radius of the parent */
}

.collapsed {
    width: 18px;
    padding: 1px;
    gap: 0px;
    justify-content: center;
}

.icon {
    fill: #fff;
    color: #fff;
    width: 16px;
    height: 16px;
}

span {
    padding-top: 1px;
    font-size: 12px;
    line-height: 12px;
    font-weight: 400;
    color: #fff;
    opacity: 0; /* Set initial opacity to 0 */
    width: 0;
    transition: opacity 0s ease-in 0s; /* Add transition for opacity with a delay */
}

.tab-icon:not(.collapsed) span {
    width: auto; /* Set width to auto when not collapsed */
    opacity: 1; /* Set opacity to 1 when not collapsed */
    transition: opacity 0.2s ease-in 0.1s;
}

.tab-icon::before, .tab-icon::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    border-radius: 4px;
    z-index: -1;
    outline: 1px solid transparent; /* Set initial outline to transparent */
    transition: background-color 0.1s ease-in, outline 0.1s ease-in;
}

.tab-icon.active::before {
    background-color: #1e1e1e;
}
.tab-icon.active::after {
    background-color: #007ACC66;
    outline: 1px solid #007ACC; /* Added solid border for active state */
}

.tab-icon.pending::before {
    background-color: #007ACC;
}

.tab-icon.unfocused::before {
    background-color: #3A3D41;
}

.above {
    transform: translateY(-100%);
}

.below {
    transform: translateY(200%);
}

@keyframes pulseOutline {
    0% {
        outline: 2px solid #007ACC;
        outline-offset: -1px;
    }
    100% {
        outline: 1px solid #007ACC00;
        outline-offset: 12px;
    }
}

/* Apply the animation to the .pulse-outline class */
.pulse-outline {
    animation: pulseOutline 0.7s ease-out;
}
</style>