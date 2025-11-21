<template>
    <div class="quick-menu">
        <div class="menu-section">
            <div class="menu-item">
                <span class="icon" v-html="arrowRight"></span><span>Go To / Accept</span><span class="key">Tab</span>
            </div>
            <div class="menu-item">
                <span class="icon" v-html="close"></span><span>Reject</span><span class="key">Escape</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "QuickMenu"
};
</script>

<style scoped>
.quick-menu {
    width: 180px;

    background-color: #252525;
    border: 1px solid #484848;
    border-radius: 3px;
}

.menu-section {
    padding: 4px 0;
    border-bottom: #252525 1px solid;
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