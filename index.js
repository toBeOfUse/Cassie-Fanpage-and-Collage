import LoadingSpinner from "./vue/spinner.vue"
import Vue from 'vue';

Vue.component("loading-spinner", LoadingSpinner);

// cheap hack to make make vue available in the global scope of index.html
window.Vue = Vue;