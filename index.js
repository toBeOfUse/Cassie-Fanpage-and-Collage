import LoadingSpinner from "./vue/LoadingSpinner.vue"
import Vue from 'vue';

// cheap hack to make make vue available in the global scope of index.html
window.Vue = Vue;
window.LoadingSpinner = LoadingSpinner;