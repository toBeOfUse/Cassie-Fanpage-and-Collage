<template>
  <loading-spinner v-if="!loaded && !error"></loading-spinner>
  <span v-else-if="error">error loading image 🥺</span>
  <div v-else class="rotationContainer">
    <img class="imageFront" :src="loadedSrc" />
    <div class="imageBack"><span>Cute</span></div>
  </div>
</template>

<script>
import LoadingSpinner from "./LoadingSpinner.vue";
export default {
    data: () => ({
        loaded: false,
        haveFallenBack: false,
        error: false,
        loadedSrc: undefined,
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

<style scoped>
.rotationContainer {
    /* proposal: base perspective on element width ?? */
    perspective: 800px;
}

.imageFront {
    backface-visibility: hidden;
    transition: transform 300ms ease-in-out;
}

.rotationContainer:hover .imageFront {
    transform: rotateY(180deg);
}

.imageBack {
    background-color: #9b4f96;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%) rotateY(180deg);
    backface-visibility: hidden;
    transition: transform 300ms ease-in-out;
    width: 100%;
    height: 100%;
}

.rotationContainer:hover .imageBack {
    transform: translate(-50%, -50%) rotateY(360deg);
}

.imageBack span {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}

img {
    max-height: 100%;
    max-width: 100%;
    border-radius: 4px;
}
</style>