<template>
    <div class="quoteCont">
        <div class="quote">
            {{'"'+testimonial.quote+'"'}}
            <img class="flourish" v-if="!flourishOnBottom" src="images/flourish.png">
        </div>
        <div class="source">
            <a v-if="testimonial.attachment" :href="testimonial.attachment">{{" - "+testimonial.author}}</a>
            <span v-else>{{" - "+testimonial.author}}</span>
            <img class="flourish" v-if="flourishOnBottom" src="images/flourish.png">
        </div>
    </div>
</template>

<script>
export default {
    props: ['testimonial', 'flourishOnBottom']
}
</script>

<style scoped>
.quote {
    font-size: 1.5em;
    text-align: center;
    width: 80%;
}

.source {
    width: 20%;
    text-align: center;
    white-space: nowrap;
}

.quoteCont {
    display: flex;
    align-items: center;
    margin: 20px 0 20px 0;
}

a {
    color: darkblue;
}

.flourish {
    height: 1em;
    display: block;
    margin: 10px auto 0 auto;
}

/* vertical */
@media (max-aspect-ratio: 1/1) {

    .flourish {
        height: 0.7em;
        margin: 5px auto 0 auto;
    }

    .quote {
        width: 87.5%;
		font-size: 2.2vh;
	}
	
	.source {
		font-size: 1.4vh;
	}

    .quoteCont {
        flex-direction: column;
        margin: 10px auto 10px auto;
    }

}

/* horizontal */

@media (min-aspect-ratio: 1/1) {
	.quote {
		font-size: 3vh;
	}
	
	.source {
		font-size: 1.5vh;
	}
	
	@media (max-size: 500px) {
		.flourish {
			height: 0.75em;
		}
	}
}



</style>
