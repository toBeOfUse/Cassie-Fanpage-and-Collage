<template>
  <loading-spinner v-if="!loaded && !error"></loading-spinner>
  <span v-else-if="error">error loading image 🥺</span>
  <img :src="loadedSrc" v-else />
</template>

<script>
import LoadingSpinner from "./LoadingSpinner.vue";
export default {
    data: () => ({
        loaded: false,
        haveFallenBack: false,
        error: false,
        loadedSrc: undefined
    }),
    props: ["src", "fallback"],
    created() {
        const img = new Image();
        img.onload = () => {
            this.loadedSrc = img.src;
            this.loaded = true;
        };
        img.onerror = () => {
            if (this.fallback && !this.haveFallenBack) {
                img.src = this.fallback;
                this.haveFallenBack = true;
            } else {
                this.error = true;
            }
        };
        img.src = this.src;
    },
    components: { LoadingSpinner },
};
</script>