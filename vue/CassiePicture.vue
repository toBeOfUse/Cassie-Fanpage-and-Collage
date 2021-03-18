<template>
    <loading-spinner v-if="!loaded && !error"></loading-spinner>
    <span v-else-if="error">error loading image 🥺</span>
    <div
        v-else
        class="rotationContainer"
        @mouseenter="flipped = true"
        @mouseleave="flipped = false"
        @touchstart="touchHandler"
        ref="container"
    >
        <div style="width: 100%; height: 100%" :style="frontTransforms">
            <img :alt="backText" class="imageFront" :src="loadedSrc" />
            <PageCurl class="pageCurl" />
        </div>
        <img :alt="backText" class="backImage" :src="loadedSrc" :style="backTransforms" />
        <div class="imageBack" :style="backTransforms">
            <span>{{ backText }}</span>
        </div>
    </div>
</template>

<script>
import LoadingSpinner from "./LoadingSpinner.vue";
import PageCurl from "../images/page-curl.svg";
export default {
    data: () => ({
        loaded: false,
        haveFallenBack: false,
        error: false,
        loadedSrc: undefined,
        orientation: undefined,
        flipped: false,
    }),
    props: ["src", "fallback", "backText"],
    created() {
        const img = new Image();
        img.onload = () => {
            this.loadedSrc = img.src;
            this.orientation = img.naturalWidth > img.naturalHeight ? "horizontal" : "vertical";
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
    methods: {
        touchHandler(event) {
            const touchStartTime = Date.now();
            const flipper = (event2) => {
                if (Date.now() - touchStartTime < 300) {
                    this.flipped = !this.flipped;
                }
                this.$refs.container.removeEventListener("touchend", flipper);
                this.$refs.container.removeEventListener("touchmove", canceller);
            };
            const canceller = (event) => {
                this.$refs.container.removeEventListener("touchend", flipper);
                this.$refs.container.removeEventListener("touchmove", canceller);
            };
            this.$refs.container.addEventListener("touchend", flipper);
            this.$refs.container.addEventListener("touchmove", canceller, { passive: true });
        },
    },
    computed: {
        rotationFunc() {
            if (this.orientation == "horizontal") {
                return "rotateX";
            } else {
                return "rotateY";
            }
        },
        frontTransforms() {
            return {
                transform: this.rotationFunc + (this.flipped ? "(180deg)" : "(0deg)"),
            };
        },
        backTransforms() {
            return {
                transform: this.rotationFunc + (this.flipped ? "(0deg)" : "(-180deg)"),
            };
        },
    },
    components: { LoadingSpinner, PageCurl },
};
</script>

<style scoped>
* {
    transform-style: preserve-3d; /* fixes backface bug in chrome for no reason */
    backface-visibility: hidden;
    transition: transform 500ms ease-in-out;
}

.rotationContainer {
    /* proposal: base perspective on element width ?? */
    perspective: 800px;
}

.imageFront {
    z-index: 1000;
}
.imageBack {
    background-color: #f2a7d7cc;
    position: absolute;
    left: 0%;
    top: 0%;
    width: 100%;
    height: 100%;
    border-radius: 4px;
    font-size: 1em;
    text-align: center;
    z-index: 900;
    display: flex;
    align-items: center;
    justify-content: center;
}

.backImage {
    position: absolute;
    left: 0%;
    top: 0%;
    filter: contrast(40%) brightness(150%);
}

.pageCurl {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 30px;
}

@media (min-aspect-ratio: 1/1) {
    .pageCurl {
        display: none;
    }
}

img {
    max-height: 100%;
    max-width: 100%;
    border-radius: 4px;
}
</style>
