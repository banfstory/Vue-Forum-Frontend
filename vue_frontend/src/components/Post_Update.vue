<template>
  <div v-if="loading" id="form-layout-g">
    <div id="form-padding-g">
      <div id="form-container-g">
        <h2> Update Post for {{ post.forum.name}} </h2>
        <label> Title </label>
        <input type="text" v-model="post.title">
        <div v-if="title_char_error" class="error-input">Title cannot be empty</div>
        <label> Content </label>
        <textarea type="text" v-model="post.content"></textarea>
        <button v-on:click="update_post()" class="form-submit-g"> Update </button>
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
      id: null,
      post: {},
      title_char_error: false,
      loading: false
    }
  },
  methods: {
    post_results() {
      this.loading = false;
      this.id = this.$route.params.id;
      axios.get(`${this.domain_name_api}post/${this.id}`).then(response => {
        this.post = response.data.post;
        this.loading = true;
      });
    },
    update_post() {
      let title = this.post.title.trim();
      let content = this.post.content.trim();
      if(title.length == 0) {
        this.title_char_error = true;
      } else {
        axios.put(`${this.domain_name_api}post/${this.id}`, {'title' : title, 'content' : content}, { headers: { 'x-access-token' : this.token }}).then(()=> {
          this.$router.push(`/forum/${this.id}/comments`);
          bus.$emit('show_hide_notify', 'Post updated');
        });
      }
    }
  },
  created() {
    if(!this.token) {
			this.$router.push('/home');
		}
    this.post_results();
  },
  watch: {
		$route() {
			this.post_results();
		}
	}
};
</script>

<style scoped>
#form-layout-g {
  transform: translateY(50%);
}
</style>