<template>
<div id="form-layout-g">
  <div id="form-padding-g">
    <div id="form-container-g">
      <div class="flex">
        <img v-bind:src="c_user_image" height="125" width="125">
        <div id="account-profile">
          <span> {{ user.username }} </span>
          <span> {{ user.email }} </span>
        </div>
      </div>
      <h2> Change Password </h2>
      <label> Old Passowrd </label>
      <input type="password" v-model="input.old_password">
      <div v-if="password_inc_error" class="error-input">Password is incorrect</div>
      <label> New Passowrd </label>
      <input type="password" v-model="input.new_password">
      <label> Confirm New Passowrd </label>
      <input type="password" v-model="input.confirm_new_password">
      <div v-if="password_not_equal" class="error-input">Field must be equal to new password</div>
      <div v-else-if="password_invalid" class="error-input">Password must be 8 or more characters long and contain atleast one uppercase, lowercase, digit and special character</div>
      <div v-else-if="password_limit_error" class="error-input">Password cannot exceed 128 characters</div>
      <button v-on:click="change_password()" class="form-submit-g"> Change Password </button>
    </div>
  </div>
</div>
</template>

<script>
import axios from 'axios';
import {bus} from '../main.js';
import imageMixin from '../mixins/imageMixin';
import validationMixin from '../mixins/validationMixin';

export default {
  title: 'Change Password',
  props: ['token', 'user'],
  data() {
    return { 
      input: { old_password: '', new_password: '', confirm_new_password: '' },
      password_inc_error: false,
      password_not_equal: false,
      password_limit_error: false,
      password_invalid: false
    }
  },
  methods: {
    change_password() {
      this.resetValidation();
      let old_password = this.input.old_password;
      let new_password = this.input.new_password;
      let confirm_new_password = this.input.confirm_new_password;
      if(new_password != confirm_new_password) {
        this.password_not_equal = true;
      } else if(new_password.length > 128) {
        this.password_limit_error = true;
      } else if(!this.validPassword(new_password)) {
        this.password_invalid = true;
      } else {
        axios.put(`${this.domain_name_api}account_pass`, {'old_password' : old_password, 'new_password' : new_password}, { headers: { 'x-access-token' : this.token } }).then(() => {
          this.$router.push(`/`);
          bus.$emit('show_hide_notify', 'Account password changed');
        }).catch(err => {
          if(err.response.data.error) {
            this.password_inc_error = true;
          }
        });
      }
    },
    resetValidation() {
      this.password_inc_error = false;
      this.password_not_equal = false;
      this.password_invalid = false;
      this.password_limit_error = false;
    }
  },
  created() {
		if(!this.token) {
      this.$router.push('/error403');
		}
  },
  computed: {
    c_user_image: function() {
      return this.user_image(this.user.display_picture);
    }
	},
  mixins: [imageMixin, validationMixin]
};
</script>

<style scoped>
#form-layout-g {
  transform: translateY(25%);
}

#form-layout-g img {
	border-radius: 50%;
}

#account-profile {
  margin-left: 1rem;
}

#account-profile div {
	margin-left: 1.5rem;
}

#account-profile span:nth-of-type(1), span:nth-of-type(2) {
	display: block;
}

#account-profile span:nth-of-type(1) {
	font-size: 2.5rem;
	margin-bottom: 0.5rem;
}

#account-profile span:nth-of-type(2) {
  font-size: 1rem;
}
</style>