<template>
  <div v-if="loading" id="user-posts">
    <div id="user-header">
      <div id="user-header-container">
        <div class="flex">
          <img  v-bind:src="c_user_image" height="100" width="100">
          <div id="user-data">
            <span>{{ user_of_posts.username }}</span>
            <span> User </span>
          </div>  
        </div>
      </div>
    </div>
    <div id="post-layout-g">
      <div id="post-padding-g">
        <div id="post-container">
          <div id="post-content-g">
            <h2> USER POSTS (total of {{ details.total_posts }} posts) </h2>
            <div v-for="post in posts" v-bind:key="post.id">
              <postsingle v-bind:token="token" v-bind:user="user" v-bind:post="post" image_type="forum">
                <router-link slot="post-details-slot" :to="{ path: `/forum/${post.forum.name}`}">{{ post.forum.name }}</router-link> 
              </postsingle>
            </div>
          </div>
          <div id="pagination-bar">
            <span v-for="page in details.paginate" v-bind:key="page">
              <router-link v-if="page" :to="{ query: { page : page } }" v-bind:class="{'page-active' : page == details.page}"> {{ page }} </router-link>
              <span v-else> ... </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Post_Single from './Post_Single.vue';
import dateMixin from '../mixins/dateMixin';
import imageMixin from '../mixins/imageMixin';

export default {
  components: {
		postsingle: Post_Single
	},
	props: ['token', 'user'],
  data() {
    return { 
      posts: {},
      details: {},
      user_of_posts: {},
      loading: false
    }
  },
  methods: {
    user_posts() {
      this.loading = false;
      let query = this.$route.params.username;
      let page_num = this.$route.query.page ? this.$route.query.page : 1;
      axios.get(`${this.domain_name_api}user?username=${query}`).then(response => {
        this.user_of_posts = response.data.user;
        axios.get(`${this.domain_name_api}posts?user_id=${this.user_of_posts.id}&page=${page_num}`).then(response => {
          this.posts = response.data.posts;
          this.details = response.data.details;
          this.loading = true;
        });
      });
    }
  },
  computed: {
    c_forum_image: function() {
      return this.forum_image(this.post.forum.display_picture);
    },
    c_user_image: function() {
      return this.user_image(this.user_of_posts.display_picture);
    }
  },
  created() {
    this.user_posts();
  },
  watch: {
		$route() {
			this.user_posts();
		}
  },
  mixins: [dateMixin, imageMixin]
};
</script>

<style scoped>
#user-header {
  background: #f8f9fa;
}

#user-header-container {
  width: 650px;
  padding: 1rem 0;
  margin: 0 auto;
  line-height: 100px;
}

#user-header-container img {
  border-radius: 50%;
}

#user-header-container span {
    display: block;
}

#user-data {
  margin-left: 2rem;
}

#user-header span:nth-of-type(1) {
  font-weight: 700;
  font-size: 2rem;
  line-height: 60px;
}

#user-header span:nth-of-type(2) {
  font-size: 1rem;
  line-height: 15px;
}

#post-content-g h2 {
  margin-left: 1rem;
}

/* Posts */
#post-content-g a {
	font-size: 0.9rem;
	font-weight: 600;
}


@media (max-width: 992px) {
  #post-content-g a {
    font-size: 0.8rem;
  }
}

@media (max-width: 768px) {

}
</style>