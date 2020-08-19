<template>
  <div>
    <div id="topStripe" :class="isVertical ? 'longboi' : 'shortboi'" :style="{height: topStripeHeight}">
      <div class="collageCont" :style="{width: screenHeight*collageAspectRatio}">
        <div v-if="isVertical" id="scrollMessage">Scroll down ↓</div>
        <template v-if="isVertical">
          <div style="position: absolute;" :style="calcSpinnerStyle()">
            <loading-spinner></loading-spinner>
          </div>
        </template>
        <template v-else>
          <div v-for="(image, i) in images" :key="i" style="position: absolute;" :style="{left: image.left, top: image.top}">
            <loading-spinner></loading-spinner>
          </div>
        </template>
        <img
          class="posImage bordered"
          v-for="(image, i) in images"
          :src="'images/'+image.file"
          :key="image.file"
          :id="'cass'+i"
          @load="imageStyle($event, i, image)"
          style="visibility: hidden;"
        />
      </div>
    </div>
    <div id="middleStripe" :style="{height: screenHeight/3+'px'}">
      <img src="images/great.svg" style="height: 65%; max-width: 90%;" />
    </div>
    <div id="bottomStripe" :style="{height: screenHeight+'px'}">
      <div>
        <testimonial-quote
          v-for="q in (isVertical ? quotes : divideQuotes(1))"
          :key="q.quote"
          :testimonial="q"
          :flourish-on-bottom="isVertical"
        ></testimonial-quote>
      </div>
      <hr v-if="!isVertical" class="divLine" />
      <div v-if="!isVertical">
        <testimonial-quote v-for="q in divideQuotes(2)" :key="q.quote" :testimonial="q" :flourish-on-bottom="isVertical"></testimonial-quote>
      </div>
    </div>
  </div>
</template>

<script>
import LoadingSpinner from "./LoadingSpinner.vue";
import TestimonialQuote from "./TestimonialQuote.vue";
export default {
    props: ["images", "quotes"],
    components: {
        LoadingSpinner,
        TestimonialQuote,
    },
    data: () => ({
        screenHeight: document.querySelector("#heightref").offsetHeight,
        screenWidth: window.innerWidth,
        collageAspectRatio: 1.4,
        screensPerImage: 0.5,
        scrollY: 0,
    }),
    mounted() {
        this.canUseWebP().then((canUseWebP) => {
            if (!canUseWebP) {
                this.images = this.images.map((v) => ({
                    ...v,
                    file: v.file.replace(/\.webp/, ".gif"),
                }));
            }
        });
        const updateSize = () => {
            const isVertical = this.isVertical;
            this.screenHeight = document.querySelector(
                "#heightref"
            ).offsetHeight;
            // just... don't ask
            if (window.outerWidth === 0) {
                this.screenWidth = window.innerWidth;
            } else if (window.innerWidth === 0) {
                this.screenWidth = window.outerWidth;
            } else {
                this.screenWidth = Math.min(
                    window.outerWidth,
                    window.innerWidth
                );
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
        window.addEventListener(
            "scroll",
            () => (this.scrollY = window.scrollY)
        );
    },
    methods: {
        // called when an image loads; sets up event listeners that keep it in position
        imageStyle(event, i, meta) {
            const image = event.target;
            const style = () => {
                if (this.isVertical) {
                    image.style.left = "50%";
                    const height = this.calcHeight(image);
                    image.style.height = height;
                    const isOnTop = this.isOnTop(i);
                    image.style.opacity = isOnTop ? "1" : "0";
                    image.style.zIndex = isOnTop ? "10000" : "1";
                    const position = this.calcPosition(i);
                    image.style.position = position;
                    if (position === "absolute") {
                        image.style.top =
                            this.images.length *
                                this.screenHeight *
                                this.screensPerImage +
                            this.screenHeight / 2 +
                            "px";
                    } else {
                        image.style.top = "50%";
                    }
                } else {
                    image.style.left = meta.left;
                    image.style.top = meta.top;
                    image.style.height = meta.height;
                    image.style.position = "absolute";
                    image.style.opacity = "1";
                }
                image.style.visibility = "visible";
            };
            style();
            window.addEventListener("resize", style);
            window.addEventListener("scroll", style);
        },
        /* positioning and visibility math for vertical mode */
        calcSpinnerStyle() {
            const finalPos =
                this.images.length * this.screenHeight * this.screensPerImage;
            if (this.scrollY < finalPos) {
                return {
                    left: "50%",
                    top: "50%",
                    position: "fixed",
                };
            } else {
                return {
                    left: "50%",
                    top:
                        this.images.length *
                            this.screenHeight *
                            this.screensPerImage +
                        this.screenHeight / 2 +
                        "px",
                };
            }
        },
        calcHeight(image) {
            const imageAspectRatio = image.width / image.height;
            if (imageAspectRatio > this.screenAspectRatio) {
                const width = this.screenWidth * 0.9;
                const height = width / imageAspectRatio;
                return height + "px";
            } else {
                return this.screenHeight * 0.8 + "px";
            }
        },
        isOnTop(i) {
            const screensDown = window.scrollY / this.screenHeight;
            const currentImage = Math.min(
                Math.floor(screensDown / this.screensPerImage),
                this.images.length - 1
            );
            return currentImage == i;
        },
        calcPosition(i) {
            const totalSlideshowHeight =
                this.screenHeight * this.screensPerImage * this.images.length;
            if (window.scrollY >= totalSlideshowHeight) {
                return "absolute";
            } else {
                return "fixed";
            }
        },
        /* boring utility functions */
        divideQuotes(pageNumber) {
            if (pageNumber === 1) {
                return this.quotes.slice(0, this.quotes.length / 2);
            } else {
                return this.quotes.slice(
                    this.quotes.length / 2,
                    this.quotes.length
                );
            }
        },
        canUseWebP() {
            return new Promise((resolve, reject) => {
                var webP = new Image();
                webP.onload = webP.onerror = function () {
                    resolve(webP.height == 2);
                };
                webP.src =
                    "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
            });
        },
    },
    computed: {
        screenAspectRatio() {
            return this.screenWidth / this.screenHeight;
        },
        isVertical() {
            return this.screenHeight > this.screenWidth;
        },
        topStripeHeight() {
            if (!this.isVertical) {
                return this.screenHeight + "px";
            } else {
                return (
                    this.screenHeight *
                        this.screensPerImage *
                        this.images.length +
                    this.screenHeight
                );
            }
        },
    },
};
</script>

<style scoped>
.posImage {
    transition: opacity 100ms linear, transform 200ms linear;
    position: absolute;
    transform: translate(-50%, -50%);
    z-index: 1000;
}

.shortboi .posImage:hover {
    transform: translate(-50%, -50%) scale(1.15, 1.15);
}

.bordered {
    border: 1px black solid;
    border-radius: 4px;
}

#topStripe {
    background: linear-gradient(to bottom, #ffc0e0 0%, #b50367 100%);
    width: 100%;
    position: relative;
    display: flex;
    justify-content: center;
}

.collageCont {
    position: relative;
    height: 100%;
}

#middleStripe {
    background: linear-gradient(
        to bottom,
        #9b4f96 0%,
        #a01194 50%,
        #9b4f96 100%
    );
    width: 100%;
    font-family: "Arizonia", Helvetica;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

#bottomStripe {
    background: linear-gradient(to bottom, #1562fb 0%, #1342a0 100%);
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
    opacity: 0.5;
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

/* horizontal */
@media (min-aspect-ratio: 1/1) {
    @media (min-height: 300px) and (max-height: 350px) {
        body {
            font-size: 0.45em;
        }
    }

    @media (min-height: 350px) and (max-height: 400px) {
        body {
            font-size: 0.5em;
        }
    }

    @media (min-height: 400px) and (max-height: 450px) {
        body {
            font-size: 0.55em;
        }
    }
}

/* vertical */
@media (max-aspect-ratio: 1/1) {
    @media (max-width: 355px) {
        body {
            font-size: 0.5em;
        }
    }

    @media (min-width: 355px) and (max-width: 420px) {
        body {
            font-size: 0.6em;
        }
    }

    @media (min-width: 420px) and (max-width: 470px) {
        body {
            font-size: 0.7em;
        }
    }
}
</style>