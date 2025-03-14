<template>
    <span class="flashing-cursor"></span>
</template>

<script>
export default {
    name: "FlashingCursor"
};
</script>

<style scoped>
.flashing-cursor {
    display: inline-block;
    width: 2px;
    height: 1em;
    background-color: #fff;
    animation: blink 1s step-end infinite;
    opacity: 0.4;
}

@keyframes blink {
    from, to {
        background-color: transparent;
    }
    50% {
        background-color: #fff;
    }
}
</style>