<template>
    <div 
        :class="`tab-icon ${state} ${computedIsCollapsed ? 'collapsed' : ''} ${isCompleted ? 'completed' : ''} ${position} ${suggestionHover ? 'pulse-outline' : ''} ${isPulsing ? 'pulse-outline-infinite' : ''} ${multiLine ? 'multiline' : ''}`"
        @mouseenter="isHovered = true" 
        @mouseleave="isHovered = false" 
        @click="handleClick"
    >
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
        },
        multiLine : {
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
            check: check,
            pulseActive: false, // Controls the pulse animation
            pulseTimer: null, // Stores the timer ID
            pulseCount: 0 // Tracks the number of pulses
        };
    },
    mounted() {
        this.stateNew = this.startState;
        this.position = this.startPosition;

        if (this.position === 'center' && this.state === 'active') {
            this.triggerPulseAnimation(); // Start the pulse animation when in center position
        }
    },
    watch: {
        startState(newState) {
            this.state = newState;
        },
        position(newPosition) {
            this.position = newPosition;
            if (newPosition === 'center') {
                this.triggerPulseAnimation(); // Start the pulse animation when in center position
            } else {
                this.pulseActive = false; // Stop the pulse animation when not in center position
                clearInterval(this.pulseTimer); // Clear the timer
            }
        },
        completed(newCompleted) {
            this.isCompleted = newCompleted;
        },
    },
    computed: {
        computedIsCollapsed() {
            return this.position === 'above' || this.position === 'below';
        },
        currentIcon() {
            if (this.position === 'below') {
                return this.arrowDown;
            } else if (this.position === 'above') {
                return this.arrowUp;
            } else {
                return this.keyboardTab;
            }
        },
        isPulsing() {
            if (this.state === 'active' && this.pulseActive && this.position === 'center') {
                return true; // Pulse animation is active
            }
            return false; // Pulse animation is not active
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

            this.isCompleted = true;
            this.$emit('completed');
        },
        triggerPulseAnimation() {
            this.pulseCount = 0; // Reset the pulse count
            this.pulseActive = true; // Start the animation

            // Trigger the animation every 3 seconds, up to 3 times
            this.pulseTimer = setInterval(() => {
                this.pulseCount++;
                if (this.pulseCount >= 3) {
                    clearInterval(this.pulseTimer); // Stop the timer after 3 pulses
                    this.pulseActive = false; // Stop the animation
                }
            }, 2000);
        }
    },
    beforeDestroy() {
        // Clear the timer if the component is destroyed
        if (this.pulseTimer) {
            clearInterval(this.pulseTimer);
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

.tab-icon.pending::before {
    background-color: #1e1e1e;
}
.tab-icon.pending::after {
    background-color: #007ACC66;
    outline: 1px solid #007ACC; /* Added solid border for active state */
}

.tab-icon.active::before {
    background-color: #007ACC;
}

.tab-icon.unfocused::before {
    background-color: #1e1e1e;
    outline: 1px solid #3A3D41;
}

.above {
    transform: translateY(-100%);
}

.below {
    transform: translateY(200%);
}

.multiline.above {
    transform: translateY(-325%);
}

.multiline.below {
    transform: translateY(432%);
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

@keyframes pulseOutlineDelayed {
    0% {
        outline: 2px solid #007ACC;
        outline-offset: -1px;
    }
    33% {
        outline: 1px solid #007ACC00;
        outline-offset: 12px;
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

.pulse-outline-infinite {
    animation: pulseOutlineDelayed 2.0s ease-out infinite 0.2s;
}
</style>