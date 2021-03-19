<template>
    <div>
        <div
            id="topStripe"
            :class="isVertical ? 'longboi' : 'shortboi'"
            :style="{ height: topStripeHeight + 'px' }"
        >
            <div class="collageCont" :style="collageDimensions">
                <div v-if="isVertical" id="scrollMessage">
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
                <div v-for="i in images.length" :key="i" />
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
                    :testimonial="q"
                    :flourish-on-bottom="isVertical"
                ></testimonial-quote>
            </div>
            <hr v-if="!isVertical" class="divLine" />
            <div v-if="!isVertical">
                <testimonial-quote
                    v-for="q in divideQuotes(2)"
                    :key="q.quote"
                    :testimonial="q"
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
        progressBarPos() {
            const finalPos = this.topStripeHeight - this.screenHeight;
            if (this.scrollY < finalPos) {
                return { position: "fixed", top: "15px" };
            } else {
                return { position: "absolute", top: finalPos + 15 };
            }
        },
        progressIndicatorPos() {
            const indicatorWidth = 1;
            return {
                left:
                    Math.min(
                        (this.scrollY / (this.topStripeHeight - this.screenHeight)) * 100,
                        100 - indicatorWidth
                    ) + "%",
                width: indicatorWidth + "%",
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

<style scoped>
#topStripe {
    background: #fb7bce;
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
    font-family: "Libre Baskerville", serif;
}

.progressContainer {
    position: fixed;
    width: 90vw;
    height: 10px;
    left: 5vw;
    display: flex;
    border-radius: 4px;
    overflow: hidden;
    color: purple;
    fill: purple;
    background-color: inherit;
}

.progressContainer div {
    height: 100%;
    width: 100%;
    border: 1px solid black;
}

.progressContainer div:first-child {
    border-radius: 4px 0 0 4px;
}

.progressContainer div:nth-last-child(2) {
    border-radius: 0 4px 4px 0;
}

#progressIndicator {
    position: absolute;
    height: 10px;
    top: 0;
    background-color: black;
    border: unset;
}

#middleStripe {
    background: #cc7bfe;
    width: 100%;
    font-family: "Arizonia", Helvetica;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

#bottomStripe {
    background: #7d93ff;
    width: 100%;
    padding: 0 4% 0 4%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    font-family: "Libre Baskerville", serif;
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
    position: absolute;
    top: 30px;
    font-family: "Arizonia", Helvetica, sans-serif;
    width: 100%;
    text-align: center;
    font-size: 40px;
    color: #381a45;
    fill: #381a45;
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
</style>
