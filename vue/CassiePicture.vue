<template>
  <loading-spinner v-if="!loaded"></loading-spinner>
  <img :src="src" @load="loaded=true" v-else />
</template>

<script>
import LoadingSpinner from "./LoadingSpinner.vue";
export default {
    data: () => ({
        loaded: false,
    }),
    props: ["src"],
    created() {
        const img = new Image();
        img.onload = () => {
            this.loaded = true;
        };
        img.src = this.src;
    },
    components: { LoadingSpinner },
};
</script>