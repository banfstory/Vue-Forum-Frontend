<template>
  <div id="form-layout-g">
    <div id="form-padding-g">
      <div id="form-container-g">
        <h2> Create post for {{ forum.name }} Forum </h2>
        <label> Title </label>
        <input type="text" v-model="input.title">
        <div v-if="title_char_error" class="error-input">Title cannot be empty</div>
        <label> Content </label>
        <textarea type="text" v-model="input.content"></textarea>
        <button v-on:click="create_post()" class="form-submit-g"> Create Post </button>   
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
      input: { title: '', content: '' },
      forum: {},
      title_char_error: false
    }
  },
  methods: {
    create_post() {
      let title = this.input.title.trim();
      let content = this.input.content.trim();
      if(title.length == 0) {
        this.title_char_error = true;
      } else {
        axios.post(`${this.domain_name_api}post`, {'title' : title, 'content' : content, 'forum_id' : this.forum.id}, { headers: { 'x-access-token' : this.token } }).then(() => {
          this.$router.push(`/forum/${this.forum.name}`);
          bus.$emit('show_hide_notify', 'Post created');
        });
      }
    },
    forum_result() {
      let name = this.$route.params.name;
      axios.get(`${this.domain_name_api}forum?name=${name}`).then(response => {
        this.forum = response.data.forum;
      }).catch(() => {
        this.$router.push('/error404');
      });
    }
  },
  created() {
    if(!this.token) {
			this.$router.push('/error403');
		} else {
      this.forum_result();
    }
  },
  watch: {
		$route() {
			this.forum_result();
		}
	}
};
</script>

<style scoped>
#form-layout-g {
  transform: translateY(50%);
}
</style>