<template>
    <div class="prompt-menu">
        <div class="menu-items">
            <span class="icon" v-html="arrowRight"></span><span>Go To / Accept</span><span class="key">Tab</span>
        </div>

        <div class="menu-item">
            <span class="icon" v-html="close"></span><span>Reject</span><span class="key">Escape</span>
        </div>
    </div>
</template>

<script>
import close from '../assets/icons/close.svg?raw';
import arrowRight from '../assets/icons/arrow-right.svg?raw';

export default {
    name: "PromptMenu",
    data() {
        return {
            close: close,
            arrowRight: arrowRight,
            
        };
    },
};
</script>

<style scoped>
.prompt-menu {
    width: 180px;   
    background-color: #252525;
    border: 1px solid #484848;
    border-radius: 3px;
    position: absolute;
    top: 0;
}

.menu-item {
    padding: 4px 6px;
    cursor: pointer;
    color: #fff;
    font-family: -apple-system, BlinkMacSystemFont, sans-serif;
    font-size: 13px;
    text-align: left;
    display: flex;
    gap: 8px;
    align-items: center;
    justify-content: start;
}

.icon {
    padding-top: 3px;
}

.key {
    flex-grow: 1;
    text-align: right;
    opacity: 0.6;
    margin-right: 4px;
}
</style>