<template>
    <div class="activity-bar">
        <div class="activity-bar-item">
            <span v-html="files" alt="Files" ></span>
        </div>
        <div class="activity-bar-item">
            <span v-html="search" alt="Search" ></span>
        </div>
        <div class="activity-bar-item">
            <span v-html="sourceControl" alt="Source Control" ></span>
        </div>
    </div>
</template>

<script>
import files from '../assets/icons/files.svg?raw';
import search from '../assets/icons/search.svg?raw';
import sourceControl from '../assets/icons/source-control.svg?raw';
import debugAlt from '../assets/icons/debug-alt.svg?raw';
export default {
    name: "ActivityBar",
    data() {
        return {
            search: search,
            files: files,
            sourceControl: sourceControl,
            debugAlt: debugAlt,
        };
    },
};
</script>

<style scoped>
.activity-bar {
    width: 48px;
    height: 100vh;
    background-color: #333;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
}
</style>