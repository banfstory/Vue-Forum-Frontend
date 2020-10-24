<template>
  <div id="login">
    <div id="popup-auth-g">
      <div id="popup-auth-wrapper-g">
        <div id="popup-auth-container-g">
          <div v-on:click="close_popup()" class="close"> &times; </div>
          <div id="login_form">
            <h2> Log in to Flask Forum </h2>      
            <input type="text" v-model="input.username" placeholder="Username" v-on:keyup.enter="login_user(); close_popup()">
            <div v-if="username_error" class="error-input">Username does not exist</div>
            <input type="password" v-model="input.password" placeholder="Password" v-on:keyup.enter="login_user(); close_popup()">
            <div v-if="password_error" class="error-input">Password does not match with this username</div>
            <a href="#"> Forgot Password? </a>
            <button v-on:click="login_user();"> Login </button>
            <span v-on:click="switch_auth_popup()" id="new_account"> Create an account </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import {bus} from '../main.js';
import jwtdecode from "jwt-decode";

//https://www.npmjs.com/package/jwt-decode
export default {
  data() {
    return {
      input: { username: '', password: '' },
      username_error: false,
      password_error: false
    }
  },
  methods: {
    login_user() {
      this.username_error = false;
      this.password_error = false;
      let username = this.input.username;
      let password = this.input.password;
      if(username.trim().length >= 3 || password.trim().length >= 4) { // username must be 3 or more characters long and password must be 4 or more characters long
        axios.get(`${this.domain_name_api}login`, { auth: { username: username, password: password}}).then(response => {
          let currTime = new Date();
          currTime.setTime(currTime.getTime() + 86400 * 1000);
          document.cookie = "token=" + response.data.token + "; expires=" + currTime.toUTCString();
          let token = response.data.token;
          bus.$emit('set_token', token);
          let user = jwtdecode(token); //decode the token to retrieve data about the user
          axios.get(`${this.domain_name_api}user?id=${user.id}`).then(response => {
            bus.$emit('set_user', response.data.user);
          });
          axios.get(`${this.domain_name_api}user_followers`, { headers: { 'x-access-token' : token } }).then(response => {
            bus.$emit('set_followers', response.data);
          });
          bus.$emit('loaded'); // ensure router-vew is loaded when user login
          this.$router.push('/').catch(() => {});
          bus.$emit('show_hide_notify', 'Login successful');
          document.body.style = "overflow: scroll";
          this.close_popup();
        }).catch(err => {
          let error = err.response.data.error;
          if(error) {
            if(error.username) { // username already exist
              this.username_error = true;
            } else if (error.password) { // password does not match with username
              this.password_error = true;
            }
          } 
        });
      }
    },
    close_popup() {
      document.body.style = "overflow: scroll";
      bus.$emit('close_popup');
    },
    switch_auth_popup() {
      bus.$emit('switch_auth_popup', 'register');
    }
  }
};
</script>

<style scoped>
#login_form {
  width: 350px;
  margin: 1rem auto;
}

#login_form h2 {
  text-align: center;
  margin-bottom: 2rem;
}

#login_form input {
  width: 100%;
  height: 35px;
  padding: 0 10px;
  margin-top: 1rem;
  border: 1px solid #ced4da;
}

#login_form a {
  font-size: 0.9rem;
  color: rgb(17, 65, 133);
  margin-top: 1rem;
  text-decoration: none;
  display: block;
}

#login_form a:hover {
  text-decoration: underline;
}

#login_form button {
  width: 100%;
  font-size: 1rem;
  cursor: pointer;
  background-color: rgb(17, 65, 133);
  padding: 0.8rem 0;
  border-radius: 2px; 
  border: none;
  color:white;
}

#login_form button:hover {
  background-color: rgb(11, 52, 110);
}

#new_account {
  display: block;
  color: rgb(17, 65, 133);
  cursor: pointer;
  text-align: center;
  margin: 1rem 0;
}

#new_account:hover {
  text-decoration: underline;
}

</style>