<template>
    <div>
        <div
            id="topStripe"
            :class="isVertical ? 'longboi' : 'shortboi'"
            :style="{ height: topStripeHeight + 'px' }"
        >
            <div class="collageCont" :style="collageDimensions">
                <div v-if="isVertical" id="scrollMessage" :style="scrollMessageVisibility">
                    Scroll down
                    <br />
                    <DownArrow />
                </div>
                <cassie-picture
                    v-for="(image, i) in images"
                    :key="image.file"
                    :src="imageSrc(i)"
                    :fallback="image.fallback ? 'images/' + image.fallback : undefined"
                    :style="{ ...imagePos(i), ...imageVisibility(i) }"
                    :backText="image.desc"
                    class="cassiePicture"
                ></cassie-picture>
            </div>
            <div class="progressContainer" :style="progressBarPos" v-if="isVertical">
                <div
                    v-for="i in images.length"
                    :key="i"
                    :style="{ backgroundColor: ['#ffffff33', '#ffffff66'][i % 2] }"
                />
                <div id="progressIndicator" :style="progressIndicatorPos" />
            </div>
        </div>
        <div id="middleStripe" :style="{ height: screenHeight / 3 + 'px' }">
            <CassieIsGreat style="height: 65%; max-width: 90%" />
        </div>
        <div id="bottomStripe" :style="{ height: screenHeight + 'px' }">
            <div>
                <testimonial-quote
                    v-for="q in isVertical ? quotes : divideQuotes(1)"
                    :key="q.quote"
                    v-bind="q"
                    :flourish-on-bottom="isVertical"
                ></testimonial-quote>
            </div>
            <hr v-if="!isVertical" class="divLine" />
            <div v-if="!isVertical">
                <testimonial-quote
                    v-for="q in divideQuotes(2)"
                    :key="q.quote"
                    v-bind="q"
                    :flourish-on-bottom="isVertical"
                ></testimonial-quote>
            </div>
        </div>
    </div>
</template>

<script>
import CassiePicture from "./CassiePicture.vue";
import TestimonialQuote from "./TestimonialQuote.vue";
import CassieIsGreat from "../images/great.svg";
import DownArrow from "../images/scroll-down.svg";
export default {
    props: ["images", "quotes"],
    components: {
        CassiePicture,
        TestimonialQuote,
        CassieIsGreat,
        DownArrow,
    },
    data: () => ({
        screenHeight: document.querySelector("#heightref").offsetHeight,
        screenWidth: window.innerWidth,
        collageAspectRatio: 1.4,
        screensPerImage: 0.5,
        scrollY: 0,
    }),
    mounted() {
        const updateSize = () => {
            const isVertical = this.isVertical;
            this.screenHeight = document.querySelector("#heightref").offsetHeight;
            // just... don't ask
            if (window.outerWidth === 0) {
                this.screenWidth = window.innerWidth;
            } else if (window.innerWidth === 0) {
                this.screenWidth = window.outerWidth;
            } else {
                this.screenWidth = Math.min(window.outerWidth, window.innerWidth);
            }
            if (isVertical != this.isVertical) {
                // so the orientation changed
                window.scrollTo(0, 0);
            }
        };
        updateSize();
        window.addEventListener("resize", updateSize);
        if ("scrollRestoration" in history) {
            history.scrollRestoration = "manual";
        }
        window.addEventListener("scroll", () => (this.scrollY = window.scrollY));
    },
    methods: {
        imageSrc(i) {
            const filename = this.images[i].file.split(".")[0];
            const actualWidth = this.containerWidth * window.devicePixelRatio;
            console.log(actualWidth);
            if (!this.images[i].file.endsWith(".jpg")) {
                return "/images/" + this.images[i].file;
            } else if (this.isVertical || actualWidth > 2500) {
                return "/images/" + filename + "-l.jpg";
            } else if (actualWidth > 1500) {
                return "/images/" + filename + "-m.jpg";
            } else {
                return "/images/" + filename + "-s.jpg";
            }
        },
        imagePos(i) {
            if (!this.isVertical) {
                // get image data object without image filename (just positioning info)
                const { file, fallback, ...pos } = this.images[i];
                return { position: "absolute", ...pos };
            } else {
                const finalPos = this.images.length * this.screenHeight * this.screensPerImage;
                if (i == this.images.length - 1 && this.scrollY > finalPos) {
                    return {
                        position: "absolute",
                        left: "50%",
                        top: this.topStripeHeight - this.screenHeight / 2 + "px",
                    };
                } else {
                    return { position: "fixed", left: "50%", top: "50%" };
                }
            }
        },
        imageVisibility(i) {
            if (!this.isVertical) {
                return { visibility: "visible", opacity: 1 };
            } else {
                const screensDown = this.scrollY / this.screenHeight;
                const currentImage = Math.min(
                    Math.floor(screensDown / this.screensPerImage),
                    this.images.length - 1
                );
                if (currentImage == i) {
                    return { visibility: "visible", opacity: "1" };
                } else {
                    return { visibility: "hidden", opacity: "0" };
                }
            }
        },
        divideQuotes(pageNumber) {
            if (pageNumber === 1) {
                return this.quotes.slice(0, this.quotes.length / 2);
            } else {
                return this.quotes.slice(this.quotes.length / 2, this.quotes.length);
            }
        },
    },
    computed: {
        scrollMessageVisibility() {
            return this.imageVisibility(0);
        },
        progressBarPos() {
            const finalPos = this.topStripeHeight - this.screenHeight;
            if (this.scrollY < finalPos) {
                return { position: "fixed", top: "15px" };
            } else {
                return { position: "absolute", top: finalPos + 15 };
            }
        },
        progressIndicatorPos() {
            return {
                left: 0,
                width: (this.scrollY / (this.topStripeHeight - this.screenHeight)) * 100 + "%",
            };
        },
        containerWidth() {
            if (this.isVertical || this.screenAspectRatio < this.collageAspectRatio) {
                return this.screenWidth;
            } else {
                return this.screenHeight * this.collageAspectRatio;
            }
        },
        collageDimensions() {
            if (this.isVertical) {
                return { width: "100%" };
            } else {
                if (this.screenAspectRatio > this.collageAspectRatio) {
                    return {
                        width: this.screenHeight * this.collageAspectRatio + "px",
                        height: "100%",
                    };
                } else {
                    return {
                        height: this.screenWidth / this.collageAspectRatio + "px",
                        width: "100%",
                    };
                }
            }
        },
        screenAspectRatio() {
            return this.screenWidth / this.screenHeight;
        },
        isVertical() {
            return this.screenHeight > this.screenWidth;
        },
        topStripeHeight() {
            if (!this.isVertical) {
                return this.screenHeight;
            } else {
                return (
                    this.screenHeight * this.screensPerImage * this.images.length +
                    this.screenHeight
                );
            }
        },
    },
};
</script>

<style scoped lang="scss">
@use "sass:color" as *;

$cursive-font: "Arizonia", Helvetica, sans-serif;
$serif-font: "Libre Baskerville", serif;

$top-stripe-color: #fb7bce;
$progress-bar-color: #852882;
$scroll-message-color: scale($progress-bar-color, $lightness: -50%);
$middle-stripe-color: #cc7bfe;
$bottom-stripe-color: #7d93ff;

#topStripe {
    background: $top-stripe-color;
    width: 100%;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
}

.collageCont {
    position: relative;
    height: 100%;
}

.cassiePicture {
    transition: opacity 200ms ease-in-out, visibility 200ms, transform 200ms ease-in-out;
    margin-right: -50%;
    transform: translate(-50%, -50%);
    max-width: 95vw;
    font-family: $serif-font;
}

.progressContainer {
    position: fixed;
    width: 90vw;
    height: 10px;
    left: 5vw;
    display: flex;
    border-radius: 4px;
    overflow: hidden;
    border: 1px solid $progress-bar-color;
}

.progressContainer div {
    height: 100%;
    width: 100%;
}

#progressIndicator {
    position: absolute;
    height: 10px;
    top: 0;
    background-color: $progress-bar-color;
    border: unset;
}

#middleStripe {
    background: $middle-stripe-color;
    width: 100%;
    font-family: $cursive-font;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

#bottomStripe {
    background: $bottom-stripe-color;
    width: 100%;
    padding: 0 4% 0 4%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    font-family: $serif-font;
    overflow-y: hidden;
}

.divLine {
    width: 1px;
    height: 85%;
    border-color: black;
    border-style: solid;
    display: inline-block;
    margin: 0 4% 0 5%;
}

#scrollMessage {
    position: fixed;
    top: 30px;
    font-family: $cursive-font;
    width: 100%;
    text-align: center;
    font-size: 40px;
    color: $scroll-message-color;
    fill: $scroll-message-color;
}

h1 {
    margin-bottom: 0.45em;
}

/* vertical */
@media (max-aspect-ratio: 1/1) {
    #bottomStripe {
        flex-direction: column;
        justify-content: center;
        padding: 0;
    }
}
</style>

<style>
* {
    box-sizing: border-box;
}

body {
    overflow-x: hidden;
}

body,
p {
    margin: 0;
}

.longboi img {
    max-height: 90vh;
    max-width: 95vw;
}
</style>
