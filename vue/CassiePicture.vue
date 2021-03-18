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
        <div class="imageBack" :style="{ ...backTransforms, fontSize }">
            <CornerFiligree
                class="cornerFiligree"
                v-for="i in 4"
                :key="i"
                :style="getCornerPos(i)"
            />
            <span>{{ backText }}</span>
        </div>
    </div>
</template>

<script>
import LoadingSpinner from "./LoadingSpinner.vue";
import PageCurl from "../images/page-curl.svg";
import CornerFiligree from "../images/corner-filigree.svg";
export default {
    data: () => ({
        loaded: false,
        haveFallenBack: false,
        error: false,
        loadedSrc: undefined,
        orientation: undefined,
        flipped: false,
        fontSize: "1em",
    }),
    props: ["src", "fallback", "backText"],
    created() {
        const img = new Image();
        img.onload = () => {
            this.loadedSrc = img.src;
            this.orientation = img.naturalWidth > img.naturalHeight ? "horizontal" : "vertical";
            this.loaded = true;
            const setFontSize = () => {
                if (!this.$refs.container) {
                    return;
                }
                const maxDimension = Math.max(
                    this.$refs.container.offsetWidth,
                    this.$refs.container.offsetHeight
                );
                this.fontSize = Math.min(20, maxDimension / 15) + "px";
            };
            this.$nextTick(setFontSize);
            window.addEventListener("resize", setFontSize);
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
        getCornerPos(index) {
            index -= 1;
            const pos = { transform: "rotate(" + index * 90 + "deg)" };
            const x = ["left", "left", "right", "right"];
            const y = ["bottom", "top", "top", "bottom"];
            pos[x[index]] = "3px";
            pos[y[index]] = "3px";
            return pos;
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
    components: { LoadingSpinner, PageCurl, CornerFiligree },
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
    font-size: 0.75em;
    text-align: center;
    z-index: 900;
    display: flex;
    align-items: center;
    justify-content: center;
}

@media (max-aspect-ratio: 1/1) {
    .imageBack {
        font-size: 1.2em;
    }
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

.cornerFiligree {
    position: absolute;
    width: 50px;
    max-width: 40%;
}

img {
    max-height: 100%;
    max-width: 100%;
    border-radius: 4px;
}
</style>
