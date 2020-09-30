//npm run serve

import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import Routes from './routes.js'

export const bus = new Vue();

Vue.mixin({
  data() {
    return {
      domain_name_api: 'http://127.0.0.1:5000/api/'
    }
  }
});

Vue.use(VueRouter);
const router = new VueRouter({
  routes: Routes,
  mode: 'history'
});

let handleProfileNav;
Vue.directive('closeProfileNav', {  
  bind(el, binding, vnode) {
    // data that has been passed from binded element will ensure that certain elements are excluded and the method can be called directly from its component (vnode)
    const { handler, exclude } = binding.value;
    // this is called when click event is fired
    handleProfileNav = (e) => {
      // do nothing if binded element contains the clicked element
      if(el.contains(e.target)) {
        return;
      }
      let element = vnode.context.$refs[exclude];
      // if not contained within excluded elements then call the method within the virtual node 
      if(!element.contains(e.target)) {
        vnode.context[handler]();
      }
    }
    // create an event listen for the click event
    document.addEventListener('click', handleProfileNav);
  },
  unbind() {
    document.removeEventListener('click', handleProfileNav);
  }
});

let handleReplyComment;
let dotpopupEl;

handleReplyComment = (e) => {
  // if no popup is set then there is no point trying to hide the popup
  // if popup is not clicked or the triple dots icon is not clicked then hide the popup
  if(dotpopupEl && !(dotpopupEl.$refs['modify-popup'] && dotpopupEl.$refs['modify-popup'].contains(e.target) || (dotpopupEl.$refs['triple-dots'] && dotpopupEl.$refs['triple-dots'].contains(e.target)))) {
    dotpopupEl._data.dotpopup = false;
    dotpopupEl = null;
  }
};

document.addEventListener('click', handleReplyComment);

bus.$on('dotpopup', (element) => {
  const el_component  = element;
  if(dotpopupEl) { 
    if(dotpopupEl === el_component) { // if clicked element are the same component then hide popup nav
      dotpopupEl._data.dotpopup = false;
      dotpopupEl = null;
    } else { // hide previous selected popup nav and show another popup nav
      dotpopupEl._data.dotpopup = false;
      el_component._data.dotpopup = true;
      dotpopupEl = el_component;
    }
  } else { // show popup nav
    el_component._data.dotpopup = true;
    dotpopupEl = el_component;
  }
});

new Vue({
  el: '#app',
  render: h => h(App),
  router: router
})
