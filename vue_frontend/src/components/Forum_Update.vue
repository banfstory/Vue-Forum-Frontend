<template>
	<div v-if="loading" id="form-layout-g">
    <div id="form-padding-g">
      <div id="form-container-g">
        <div id="forum-profile" class="flex">
          <img v-bind:src="c_forum_image" height="125" width="125">
          <div>
            <div> {{ forum.name }} </div>
            <div> Forum </div>
          </div>
        </div>
        <button> Remove Forum Picture </button>
        <h2> Update Account </h2>
        <label> About </label>
        <textarea v-model="forum.about" type="text"> </textarea>
        <label> Image Upload </label>
        <input type="file">
        <button v-on:click="update_forum()" class="form-submit-g"> Update </button>
      </div>
    </div>
	</div>
</template>

<script>
import axios from 'axios';
import {bus} from '../main.js';
import imageMixin from '../mixins/imageMixin';

export default {
  props: ['token', 'user'],
  data() {
    return {
      query: null,
      forum: {},
      loading: false
    }
  },
  methods: {
    update_forum() {
      axios.put(`${this.domain_name_api}forum/${this.forum.id}`, {'about' : this.forum.about}, { headers: { 'x-access-token' : this.token } }).then(() => {
        this.$router.push(`/forum/${this.query}`);
        bus.$emit('show_hide_notify', 'Forum updated');
      });
    },
    forum_results() {
      this.loading = false;
      this.query = this.$route.params.name;
      axios.get(`${this.domain_name_api}forum?name=${this.query}`).then(response => {
        this.forum = response.data.forum;
        this.loading = true;
      });
    }
  },
  computed: {
    c_forum_image: function() {
      return this.forum_image(this.forum.display_picture);
    }
  },
  created() {
    if(!this.token) {
			this.$router.push('/home');
		}
    this.forum_results();
  },
  watch: {
		$route() {
			this.forum_results();
		}
  },
  mixins: [imageMixin]
};
</script>

<style scoped>
#form-layout-g {
  transform: translateY(25%);
}

#form-layout-g img {
	border-radius: 50%;
}

#forum-profile > div {
	margin-left: 1.5rem;
}

#forum-profile > div > div:nth-of-type(1) {
	font-size: 2.5rem;
	margin-bottom: 0.5rem;
}

#forum-profile > div > div:nth-of-type(2) {
  font-size: 1.1rem;
}

#form-layout-g button:nth-of-type(1) {
	margin: 1rem 0;
}

@media (max-width: 992px) {
  #form-layout-g img {
    height: 100px;
    width: 100px;
  }

  #forum-profile > div {
    margin-left: 1.2rem;
  }

  #forum-profile > div > div:nth-of-type(1) {
    font-size: 2rem;
    margin-bottom: 0.3rem;
  }

  #forum-profile > div > div:nth-of-type(2) {
    font-size: 0.9rem;
  }
}

@media (max-width: 768px) {
  
}
</style>