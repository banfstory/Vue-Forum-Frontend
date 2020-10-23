<template>
  <div v-if="loading" id="forum">
    <div id="forum-header">
      <div id="forum-header-container" class="flex space-between">
        <div class="flex">
          <img  v-bind:src="c_forum_image" height="100" width="100">
          <div id="forum-data">
            <div>{{ forum.name }}</div>
            <div> Forum </div>
          </div>  
        </div>
        <div id="forum-buttons">
          <button v-if="followed" v-on:click="unfollow_forum()" @mouseover="changeToLeave()" @mouseleave="changeToJoin()"> {{ join_state }} </button>
          <button v-else v-on:click="follow_forum()"> JOIN </button>
          <router-link v-if="owner_forum" :to="{ path: `/forum/${forum.name}/update_forum`}"><button> UPDATE </button></router-link>
        </div>
      </div>
    </div>
    <div id="forum-layout">
      <div id="post-padding-g" class="flex flex-start">
        <div id="post-layout-g">
          <div id="post-container">
            <div id="post-content-g">
              <div id="forum-create-post" class="flex">
                <img v-if="token" v-bind:src="c_user_image" height="45" width="45"> 
                <img v-else v-bind:src="c_user_default_image" height="45" width="45"> 
                <router-link :to="{ path: `/forum/${forum.name}/create_post` }"><input placeholder="Create Post"></router-link>
              </div>
              <div v-for="post in posts" v-bind:key="post.id">
                <postsingle v-bind:token="token" v-bind:user="user" v-bind:post="post" image_type="user">
                  <span slot="post-details-slot">  Posted by  <router-link :to="{ path: `/user/${post.user.username}/posts`}">{{ post.user.username }}</router-link> </span> 
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
        <div id="forum-side-g">       
          <div id="side-title-g"> ABOUT FORUM </div>
          <div id="side-content-g">
            <div id="side-about-g">{{ forum.about }}</div>
            <div id="side-stats-g" class="flex space-around">
              <div class="side-stat">
                <div> {{ forum.followers }} </div>
                <div> Followers </div>
              </div>
              <div class="side-stat">
                <div> {{ forum.num_of_post }} </div>
                <div> Posts </div>
              </div>
            </div>
            <div id="side-date-created-g"> Created in {{ c_normal_date }}</div>
          </div>
        </div> 
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import {bus} from '../main.js';
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
      query: null,
      forum: {},
      posts: {},
      details: {},
      followed: false,
      owner_forum: false,
      join_state: 'JOINED',
      loading: false
    };
  },
  methods: {
    posts_results() {
      this.loading = false;
      this.query = this.$route.params.name;
      axios.get(`${this.domain_name_api}forum?name=${this.query}`).then(response => {
        this.forum = response.data.forum;
        let page_num = this.$route.query.page ? this.$route.query.page : 1;
        axios.get(`${this.domain_name_api}posts?forum_id=${this.forum.id}&page=${page_num}`).then(response => {
          this.posts = response.data.posts;
          this.details  = response.data.details;
        }).catch(() => {
          this.$router.push('/error404');
        });
        if(this.token) {
          axios.get(`${this.domain_name_api}user_follower?forum_id=${this.forum.id}`, { headers: { 'x-access-token' : this.token } }).then(response => {
            this.followed = response.data.follow ? true : false;
            // only show the update button for the forum if the user is the owner of the forum
            axios.get(`${this.domain_name_api}forum?id=${this.forum.id}&owner_id=${this.user.id}`).then(response => { 
              this.owner_forum = response.data.forum ? true : false;
            });
          });
        } else {
          this.followed = false;
          this.owner_forum = false;
        }
        this.loading = true;
      }).catch(() => {
        this.$router.push('/error404');
      });
    },
    follow_forum() {
      axios.post(`${this.domain_name_api}user/follow/${this.forum.id}`, {}, { headers: { 'x-access-token' : this.token } }).then((response) => {
        this.followed = true;
        this.forum.followers += 1;
        bus.$emit('follow_forum', response.data.forum);
        bus.$emit('show_hide_notify', 'Forum followed');   
      });
    },
    unfollow_forum() {
      axios.delete(`${this.domain_name_api}user/unfollow/${this.forum.id}`, { headers: { 'x-access-token' : this.token } }).then((response) => {
        this.followed = false;
        this.forum.followers -= 1;
        bus.$emit('unfollow_forum', response.data.forum);
        bus.$emit('show_hide_notify', 'Forum unfollowed');
      });
    },
    changeToLeave() {
      this.join_state = 'LEAVE';
    },
    changeToJoin() {
      this.join_state = 'JOINED';
    }
  },
  computed: {
    c_forum_image: function() {
      return this.forum_image(this.forum.display_picture);
    },
    c_user_image: function() {
      return this.user_image(this.user.display_picture);
    },
    c_user_default_image: function() {
      return this.user_image('default.png');
    },
    c_normal_date() {
      return this.normal_date_format(this.forum.date_created);
    } 
  },
  created() {
    this.posts_results();
  },
  watch: {
		$route() {
      this.posts_results();
		}
  },
  mixins: [dateMixin, imageMixin]
};
</script>

<style scoped>
#forum-layout {
  width: 1100px;
  margin: 0 auto;
  margin-bottom: 5rem;
}

#post-content-g {
  margin-right: 1rem;
}

#post-layout-g {
  transform: translateY(0px);
  margin: 0;
}

#post-padding-g {
  padding: 0 3rem;
}

/* Create Post */
#forum-create-post {
  margin-top: 1rem;
  margin-bottom: 2.5rem;
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid#999;
  background-color: #fff;  
}

#forum-create-post img {
  border-radius: 50%;
}

#forum-create-post a {
  line-height: 45px;
  width: 100%;
}

#forum-create-post input {
  padding-left: 1rem;
  width: 97%;
  margin-left: 0.7rem;
  border-radius: 3px;
  border: 1px solid#999;
  height: 39px;
}

/* Forum Header */
#forum-header {
  background: #f8f9fa;
}

#forum-header-container {
  width: 650px;
  padding: 1rem 0;
  margin: 0 auto;
  line-height: 100px;
}

#forum-header-container img {
  border-radius: 50%;
}

#forum-data {
  margin-left: 2rem;
}

#forum-data div:nth-of-type(1) {
  font-weight: 700;
  font-size: 2rem;
  line-height: 60px;
}

#forum-data div:nth-of-type(2) {
  font-size: 1rem;
  line-height: 15px;
}

#forum-buttons button {
  width: 100px;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  background-color: #fff;
  border: 1px solid black;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 700;
}
#forum-buttons button {
  margin: 0 1rem;
}

#forum-buttons button:hover {
  background-color: rgb(17, 65, 133);
  border: 1px solid rgb(17, 65, 133);
  border: none;
  color: white;
}

/* Posts */
#post-content-g .item-header-data span:nth-of-type(1) {
	font-size: 0.8rem;
  font-weight: 300;
}

@media (max-width: 992px) {
  #post-content-g .item-header-data span:nth-of-type(1) {
    font-size: 0.7rem;
  }

  #forum-layout {
    width: 650px;
  }

  #post-content-g {
    margin: 0;
  }

  #post-padding-g {
    padding: 0 1rem;
  }

  /* Create Post */
  #forum-create-post {
    margin-bottom: 1.5rem;
    padding: 0.4rem;
  }
  
  #forum-create-post img {
    height: 40px;
    width: 40px;
  }

  #forum-create-post a {
    line-height: 40px;
  }

  #forum-create-post input {
    font-size: 0.8rem;
    padding-left: 0.8rem;
    margin-left: 0.5rem;
    height: 35px;
  }

  /* Forum Header */
  #forum-header-container {
    padding: 0.8rem 0;
    line-height: 80px;
  }

  #forum-header-container img {
    height: 80px;
    width: 80px;
  }

  #forum-data {
    margin-left: 1.5rem;
  }

  #forum-data div:nth-of-type(1) {
    font-size: 1.5rem;
    line-height: 50px;
  }

  #forum-data div:nth-of-type(2) {
    font-size: 0.8rem;
    line-height: 15px;
  }

  #forum-buttons button {
    padding: 0.5rem 0.8rem;
    font-size: 0.7rem;
  }

  #forum-buttons button {
    margin: 0 0.7rem;
  }
}

@media (max-width: 768px) {
  
}

</style>