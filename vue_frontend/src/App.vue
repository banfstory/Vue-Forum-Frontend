<template>
  <div>
    <layout></layout>
		<div v-if="token" id="content-wrapper"><router-view v-if="loading" v-bind:token="token" v-bind:user="user"></router-view></div>
    <div v-else id="content-wrapper" style="margin-left:0"><router-view v-bind:token="token" v-bind:user="user"></router-view></div>
    <transition name="fade_notify"> <div v-if="notification" id="pop-message" ref="popup-notification"> {{ notify_message }} </div> </transition>
  </div>
</template>

<script>
import axios from 'axios';
import Layout from "./components/Layout.vue";
import {bus} from './main.js';
import jwtdecode from "jwt-decode";

export default {
  components: {
    layout: Layout,
  },
  data() {
    return { 
			token: null,
      user: {},
      notification: false,
      loading: false,
      notify_message: ''
    };
  },
  methods: {
    initApp() {
      // if user has token property in localStorage, then they have already authenticated before
      const token = localStorage.getItem('token');
      if(token) {
        this.token = token;
        let user = jwtdecode(this.token);
        axios.get(`${this.domain_name_api}user?id=${user.id}`).then(response => {
          this.user = response.data.user;
          bus.$emit('init_user', this.user);
          bus.$emit('init_token', this.token);
          axios.get(`${this.domain_name_api}user_followers`, { headers: { 'x-access-token' : this.token } }).then(response => {
            bus.$emit('init_followers', response.data);
            this.loading = true;
          });  
        });
      }  
    },
    show_hide_notification() {  
      this.notification = true;
      setTimeout(() => { this.notification = false; }, 5000);
    }
  },
  created() {
    this.initApp();
    bus.$on('loaded', () => {
      this.loading = true;
    });
    bus.$on('set_token', (token) => {
      this.token = token;
    });
    bus.$on('set_user', (user) => {
      this.user = user;
    });
    bus.$on('erase_token', (token) => {
      this.token = token;
    });    
    bus.$on('erase_user', (user) => {
      this.user = user;
    });
    bus.$on('show_hide_notify', (message) => {
      this.notify_message = message;
      this.show_hide_notification();
    });
  },
  watch: {
    $route(to) {
      document.title = to.meta.title || 'Flask Forum';
    },
    immediate: true
  }
};

</script>

<style>
* { box-sizing: border-box }

html, body {
  padding:0;
  margin:0;
  height: 100%;
  width: 100%;
}

body {
  font-family: "Roboto", "Helvetica", "Sans-serif";
  font-size: 1rem;
	background: #EEEEEE;
}

h1, h2 {
  margin: 0;
  padding: 0;
}

h1 {
  font-size: 1.5rem;
}

h2 {
  font-size: 1.3rem;
}

.flex {
  display: flex;
}

.space-between {
  justify-content: space-between;
}

.space-around {
  justify-content: space-around;
}

.flex-start {
  align-items: flex-start;
}

.vertical-dots:after {
  content: '\2807';
  font-size: 1.3rem;
  color: #888;
  cursor: pointer;
}

.dot-popup {
  border-radius: 2px;
  box-shadow: 2px 4px 10px #888888;
  background: #fff;
  width: 120px;
  position: absolute;
  right: 0;
  /* select: none will prevent popup from been highlighted by cursor */
  user-select: none; /* supported by Chrome and Opera */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
}

.dot-popup i {
  margin-right: 0.7rem;
  font-size: 1.2rem;
  width: 20px;
}

.dot-popup div {
  font-size: 0.9rem;
  padding: 0.8rem;
  cursor: pointer;
  text-align: center;
}

.dot-popup div:hover {
  background: #f8f9fa;
}

#content-wrapper {
  position: relative;
  margin-left: 13%;
  top: 50px;
  height: 100%;
}

button, input, textarea:focus { 
  outline: 0;
}

/* General layout of forms */
#form-layout-g {
	position: relative;
	width: 600px;
  margin: 0 auto;
}

#form-padding-g {
  padding: 0 1.5rem;
}

#form-container-g {
	border: 1px solid #ced4da;
	border-radius: 3px;
  background:#fff;
	padding: 3rem;
	overflow: hidden;
}

#form-layout-g h2 {
	margin-top: 1.5rem;
  margin-bottom: 1rem;
}

#form-layout-g label {
  font-size: 0.9rem;
  margin: 1rem 0 0.3rem 0;
  display: block;
}

#form-layout-g textarea {
  width: 100%;
  border: 1px solid #ced4da;
  resize: none;
  height: 100px;
  outline: 0;
  padding: 0.5rem;
  font-size: 0.9rem;  
}

#form-layout-g input:not([type=file]) {
  font-size: 0.8rem;  
  width: 100%;
  height: 35px;
  padding: 0 10px;
  border: 1px solid #ced4da;
}

#form-layout-g button.form-submit-g {
  margin-top: 1rem;
  float: right;
}

#form-layout-g button {
	font-size: 0.8rem;
	cursor: pointer;
	background-color: rgb(17, 65, 133);
	padding: 0.6rem;
	border-radius: 2px; 
	border: none;
	color:white;
}

#form-layout-g button:hover {
	background-color: rgb(11, 52, 110);
}

/* Pagination Layout */
#pagination-bar {
  margin-top: 2rem;
}

#pagination-bar a {
  display: inline-block;
  border-radius: 5px;
  text-align: center;
  width: 30px;
  margin-left: 3px;
  text-decoration: none;
  padding: 4px;
  color: black;
  background-color: #f8f9fa;
  border: 1px solid #ced4da;
  cursor: pointer;
}

#pagination-bar a.page-active {
  color:white;
  background-color: rgb(11, 106, 176);
}

/* Posts General Layout */
#post-layout-g {
	transform: translateY(30px);
	position: relative;
	width: 650px;
	margin: 0 auto;
	margin-bottom: 5rem;
}

#post-padding-g {
  padding: 0 1.5rem;
}

#post-content-g .item-header-data a:hover {
  text-decoration: underline;
}

#post-content-g a {
	text-decoration: none;
	color: black;
}

/* About Forum General Layout */
#forum-side-g {
  width: 350px;
  margin-top: 1rem;
  border: 1px solid#999;
  background-color: #fff;
  border-radius: 5px;
}

#side-content-g {
  padding: 1rem;  
}

#side-title-g {
  background-color: #999;
  padding: 1rem 0.8rem;
  font-size: 0.9rem;
  font-weight: 700;
  text-align: center;
}

#side-about-g {
  font-size: 0.9rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #999;
}

#side-stats-g {
  padding: 1rem 0;   
  border-bottom: 1px solid #999;  
}

#side-stats-g .side-stat div:nth-of-type(1) {
  text-align: center;
  font-weight: 700;
  margin-bottom: 0.3rem;
}

#side-stats-g .side-stat div:nth-of-type(2) {
  font-size: 0.7rem;
}

#side-date-created-g {
  padding-top: 1rem;
  text-align: center;
}

/* Popup form (to remove images from user account or forum) */

#popup-form-g {
  z-index: 30;
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%; 
  background-color: rgba(0, 0, 0, 0.9); 
}

#popup-wrapper-form-g {
  border-radius: 1px;
  position: relative;
  background-color: #fff;
  width: 350px;
  margin: 0 auto;
  top: 50%;
  transform: translateY(-50%);
}

#popup-container-form-g {
  padding: 1.5rem;
  overflow: hidden;
}

#popup-container-form-g > div:nth-of-type(1) {
  font-size: 0.9rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
}

#popup-container-form-g > div:nth-of-type(2) {
  font-size: 0.8rem;
}

#pop-up-buttons-form-g {
  margin-top: 2rem;
  float: right;
}

#pop-up-buttons-form-g button {
  width: 90px;
  font-size: 0.7rem;
  cursor: pointer;
  background-color: rgb(17, 65, 133);
  padding: 0.7rem 0;
  border-radius: 2px; 
  border: none;
  color:white;
  font-weight: 600;
}

#pop-up-buttons-form-g button:hover {
  background-color: rgb(11, 52, 110);
}

#pop-up-buttons-form-g button:nth-of-type(2) {
  margin-left: 0.5rem;
}

/* Authentication Form General Layout */
#popup-auth-g {
  z-index: 100;
  position: fixed;
  top: 0px;
  left: 0px;
  background-color: rgba(0, 0, 0, 0.85); 
  width: 100%;
  height: 100%; 
}

#popup-auth-wrapper-g {
  width: 600px; 
  margin: auto;
  position: relative;
  /* these will ensure that the container appears to be in the container of the webpage taking into account its viewpoint and container's height */
  transform: translateY(-50%); /* place the container 50% of the containers height */
  top: 50%; /* place the container at the center of its viewpoint as its starting point */
}

#popup-auth-container-g {
  background-color: white; 
  padding: 20px; 
  border-radius: 4px;
} 

#popup-auth-container-g .close {
  text-align: right;
  font-size: 40px;
  line-height: 20px;
  color: rgb(153, 148, 148);
  text-decoration: none;
  cursor: pointer;
}

#popup-auth-container-g .close:hover {
  color: rgb(133, 129, 129);
}

/* Popup to add or update comments and replies - general layout */
.comment-reply-popup-g textarea {
  display: block;
  width: 100%;
  padding: 0.4rem;
  margin-bottom: 0.5rem;
  resize: none;
  height: 50px;
  border-radius: 3px;
}

.reply-comment-buttons-g {
  text-align: right;
  margin-bottom: 0.5rem;
}

.reply-comment-buttons-g button {
  width: 80px;
  font-size: 0.9rem;
  cursor: pointer;
  background-color: rgb(17, 65, 133);
  padding: 0.4rem 0;
  border-radius: 3px; 
  border: none;
  color:white;
  text-decoration: none;
  text-align: center;
}

.reply-comment-buttons-g button:hover {
  background-color: rgb(11, 52, 110);
}

.reply-comment-buttons-g button:nth-of-type(2) {
  margin-left: 0.5rem;
}

/* Notification */
#pop-message {
  position: fixed;
  padding: 1rem;
  padding-right: 3rem;
  color: white;
  background: rgb(40, 40, 40);
  margin: 1rem; 
  bottom: 0;
  right: 0;
  border-radius: 2px;
  /* select: none will prevent popup from been highlighted by cursor */
  user-select: none; /* supported by Chrome and Opera */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
}

/* when notification shows then start from 0 to 1 opacity and if notification hides then start from 1 to 0*/
.fade_notify-enter-active, .fade_notify-leave-active {
  transition: opacity 1s ease-in;
} 

.fade_notify-enter, .fade_notify-leave-to { 
  opacity: 0;
}

/* error input message */
.error-input {
  color: red;
  font-size: 0.7rem;
  margin: 0.3rem 0; 
}

@media (max-width: 992px) {
  /* headings */
  h1 {
    font-size: 1.4rem;
  }

  h2 {
    font-size: 1.2rem;
  }

  /* forms general layout */
  #form-container-g {
    padding: 2.5rem;
  }

  #form-padding-g {
    padding: 0 1.5rem;
  }

  #form-layout-g h2 {
    margin-top: 1.2rem;
    margin-bottom: 0.7rem;
  }

  #form-layout-g label {
    font-size: 0.8rem;
    margin: 0.8rem 0 0.2rem 0;
  }

  #form-layout-g textarea {
    padding: 0.4rem;
    font-size: 0.8rem;  
  }

  #form-layout-g input:not([type=file]) {
    padding: 0 8px;
  }

  #form-layout-g button.form-submit-g {
    margin-top: 0.7rem;
  }

  #form-layout-g button {
    font-size: 0.7rem;
    padding: 0.5rem;
  } 
  /* About Forum */
  #forum-side-g {
    display: none;
  }
}

@media (max-width: 768px) {
   /* headings */
  h1 {
    font-size: 1.3rem;
  }

  h2 {
    font-size: 1.1rem;
  }

  #content-wrapper {
    margin-left: 45px;
  }

  /* forms general layout */
  #form-container-g {
    padding: 2rem;
  }

  #form-layout-g h2 {
    margin-top: 1rem;
    margin-bottom: 0.5rem;
  }

  #form-layout-g label {
    margin: 0.7rem 0 0.1rem 0;
  }
}
</style>
