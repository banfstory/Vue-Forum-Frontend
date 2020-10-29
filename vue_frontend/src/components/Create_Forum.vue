<template>
  <div id="form-layout-g">
    <div id="form-padding-g">
      <div id="form-container-g">
        <h2> Create Forum </h2>
        <label> Name </label>
        <input type="text" v-model="input.name">
        <div v-if="forum_exist_error" class="error-input">Forum already exist</div>
        <div v-if="forum_char_error" class="error-input">Forum name must be 3 and 25 characters long</div>
        <label> About </label>
        <textarea type="text" v-model="input.about"></textarea>
        <div v-if="about_limit_error" class="error-input">About field must not exceed 30000 characters</div>
        <button v-on:click="create_forum()" class="form-submit-g"> Create Forum </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import {bus} from '../main.js';

export default {
  props: ['token', 'user'],
  data() {
    return {
      input: { name: '', about: '' },
      forum_exist_error: false,
      forum_char_error: false,
      about_limit_error: false
    }
  },
  methods: {
    create_forum() {
      this.resetValidation();
			let name = this.input.name.trim();
      let about = this.input.about.trim();
      let validation_error = false;
      if(about.length > 30000) {
        this.about_limit_error = true;
        validation_error = true;
      }
      if(name.length < 3) {
        this.forum_char_error = true;
        validation_error = true;
      } 
      if(!validation_error) {
        axios.post(`${this.domain_name_api}forum`, {'name' : name, 'about' : about}, { headers: { 'x-access-token' : this.token } }).then(() => {
          this.$router.push('/');
          bus.$emit('show_hide_notify', 'Forum created');
        }).catch(err => {
          if(err.response.data.error) {
            this.forum_exist_error = true;
          }
        })
      }
    },
    resetValidation() {
      this.forum_exist_error = false;
      this.forum_char_error = false;
      this.about_limit_error = false;
    }
  },
  created() {
    if(!this.token) {
      this.$router.push('/error403');
		}
  }
};
</script>

<style scoped>
#form-layout-g {
  transform: translateY(50%);
}
</style>

