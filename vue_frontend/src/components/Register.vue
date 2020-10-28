<template>
  <div id="register">
    <div id="popup-auth-g">
      <div id="popup-auth-wrapper-g">
        <div id="popup-auth-container-g">
          <div v-on:click="close_popup()" class="close"> &times; </div>
          <div id="register_form">
            <h2> Join Flask Forum! </h2>
            <input type="text" v-model="input.username" placeholder="Username" v-on:keyup.enter="register_user()">
            <div v-if="username_exist_error" class="error-input">Username already exist</div>
            <div v-else-if="username_char_error" class="error-input">Username must be between 3 and 25 characters long</div>
            <div v-else-if="user_space_error" class="error-input">Username must not contain spaces</div>
            <input type="text" v-model="input.email" placeholder="Email" v-on:keyup.enter="register_user()">
            <div v-if="email_invalid_error" class="error-input">Invalid email address</div>
            <input type="password" v-model="input.password" placeholder="Password" v-on:keyup.enter="register_user()">
            <input type="password" v-model="input.confirm_pass" placeholder="Confirm Password" v-on:keyup.enter="register_user()">
            <div v-if="password_invalid" class="error-input">Password must be 8 or more characters long and contain atleast one uppercase, lowercase, digit and special character</div>
            <div v-else-if="password_not_equal" class="error-input">Field must be equal to password</div>
            <div v-else-if="password_limit_error" class="error-input">Password cannot exceed 128 characters</div>
            <button v-on:click="register_user();"> Register </button>
            <span v-on:click="switch_auth_popup()" id="login_account"> Already have an account? </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import {bus} from '../main.js';
import validationMixin from '../mixins/validationMixin';

export default {
  data() {
    return {
      input: { username: '', email: '', password: '', confirm_pass: '' },
      username_exist_error: false,
      username_char_error: false,
      email_invalid_error: false,
      password_invalid: false,
      password_limit_error: false,
      password_not_equal: false,
      user_space_error: false
    }
  },
  methods: {
    register_user() {
      this.resetValidation();
      let username = this.input.username.trim();
      let email = this.input.email.trim();
      let password = this.input.password;
      let confirm_password = this.input.confirm_pass;
      let validation_error = false;
      if(username.length < 3 || username.length > 25) { // username must be 3 and 25 characters long
        this.username_char_error = true;
        validation_error = true;
      } else if(!this.validUserSpace(username)) {
				this.user_space_error = true;
				validation_error = true;
      }
      if(!this.validEmail(email)) { // email format is invalid
        this.email_invalid_error = true;
        validation_error = true;
      } 
      if(password != confirm_password) { // passwords do not match
        this.password_not_equal = true;
        validation_error = true;
      } else if(password.length > 128) {
        this.password_limit_error = true;
        validation_error = true;
      } else if(!this.validPassword(password)) { // password format is invalid
        this.password_invalid = true;
        validation_error = true;
      }
      if(!validation_error){
        axios.post(`${this.domain_name_api}register`, {'username' : username, 'email' : email, 'password' : password}).then(() => {
          this.$router.push('/').catch(() => {});
          document.body.style = "overflow: scroll";
          this.close_popup();
          bus.$emit('show_hide_notify', 'Register successful'); 
        }).catch(err => {
          console.log(err);
          if(err.response.data.error) { // user already exist
            this.username_exist_error = true;
          }
        }); 
      }  
    },
    close_popup() {
      bus.$emit('close_popup');
    },
    switch_auth_popup() {
      bus.$emit('switch_auth_popup', 'login');
    },
    resetValidation() {
      this.username_exist_error = false;
      this.username_error = false;
      this.username_char_error = false;
      this.email_invalid_error = false;
      this.password_not_equal = false;
      this.password_limit_error = false;
      this.password_invalid = false;
      this.user_space_error = false;
    }
  },
  mixins: [validationMixin]
};
</script>

<style>
#register_form {
  width: 350px;
  margin: 1rem auto;
}

#register_form h2 {
  text-align: center;
  margin-bottom: 2rem;
}

#register_form input {
  width: 100%;
  height: 35px;
  padding: 0 10px;
  margin-top: 1rem;
  border: 1px solid #ced4da;
}

#register_form a {
  font-size: 0.9rem;
  color: rgb(17, 65, 133);
  margin-top: 1rem;
  text-decoration: none;
  display: block;
}

#register_form a:hover {
  text-decoration: underline;
}

#register_form button {
  width: 100%;
  font-size: 1rem;
  cursor: pointer;
  background-color: rgb(17, 65, 133);
  padding: 0.8rem 0;
  border-radius: 2px; 
  border: none;
  margin-top: 1rem;
  color:white;
}

#register_form button:hover {
  background-color: rgb(11, 52, 110);
}

#login_account {
  display: block;
  color: rgb(17, 65, 133);
  cursor: pointer;
  text-align: center;
  margin: 1rem 0;
}

#login_account:hover {
  text-decoration: underline;
}
</style>