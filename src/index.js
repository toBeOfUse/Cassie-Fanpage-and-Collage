import Vue from 'vue';
import CassieFlag from '../vue/CassieFlag.vue';
import images from './images.js';
import quotes from './quotes.js';

new Vue({
    el: "#root",
    render: (createElement) => createElement(CassieFlag, {
        props: {
            images,
            quotes
        }
    })
});