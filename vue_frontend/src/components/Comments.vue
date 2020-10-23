<template>
  <div v-if="loading" id="forum-post">
    <div id="forum-post-layout">
      <div id="post-comments-padding-g" class="flex flex-start">
        <div id="post-full-layout">
          <div id="post-comments-layout">
            <div id="post-details">
              <div id="post-header" class="flex">
                <router-link :to="{ path: `/forum/${post.forum.name}`}">
                  <img v-bind:src="c_forum_image" height="40" width="40">
                </router-link>
                <div id="post-header-data">
                  <router-link :to="{ path: `/forum/${post.forum.name}`}">{{ post.forum.name }}</router-link>
                  <span>Posted by <router-link :to="{ path: `/user/${post.user.username}/posts`}">{{ post.user.username }}</router-link></span> 
                  <span> {{ c_time_ago }} </span>
                </div>
              </div>
              <div id="post-content">
                <div> {{ post.title }} </div> 
                <p> {{ post.content }} </p>
                <div> {{ post.num_of_comments }} <template> Comments </template></div>
              </div>
              <div id="user-post">
                <div v-if="token && post.user.id == user.id" id="modify-post">
                  <router-link :to="{ path: `/forum/${post.id}/update_post`}"><button> Update </button></router-link>
                  <button v-on:click="popup_menu(true)" class="post-delete"> Delete </button>
                </div>
                <div id="add-comment">
                  <textarea placeholder="Add a comment" v-model="input.add_comment"> </textarea>
                  <button v-on:click="add_comment()"> Comment </button>
                </div>
              </div>
            </div>
            <div id="comments-details">
              <div v-for="comment in comments" v-bind:key="comment.id" class="comment-item">
                <commentsingle v-bind:token="token" v-bind:user="user" v-bind:comment="comment" v-on:removeComment="delete_comment($event)"></commentsingle>
              </div>
            </div>
          </div>
          <div id="pagination-bar">
            <span v-for="page in comments_details.paginate" v-bind:key="page">
              <router-link v-if="page" :to="{ query: { page : page } }" v-bind:class="{'page-active' : page == comments_details.page}"> {{ page }} </router-link>
              <span v-else> ... </span>
            </span>
          </div>
        </div>
        <div id="forum-side-g">       
          <div id="side-title-g"> ABOUT FORUM </div>
          <div id="side-content-g">
            <div id="side-forum-name" class="flex">
              <img v-bind:src="c_forum_image" height="50" width="50">
              <span> {{ post.forum.name }} </span>
            </div>
            <div id="side-about-g">{{ post.forum.about }}</div>
            <div id="side-stats-g" class="flex space-around">
              <div class="side-stat">
                <div> {{ post.forum.followers }} </div>
                <div> Followers </div>
              </div>
              <div class="side-stat">
                <div> {{ post.forum.num_of_post }} </div>
                <div> Posts </div>
              </div>
            </div>
            <div id="side-date-created-g"> Created in date {{ c_normal_date }}</div>
            <button v-if="followed" v-on:click="unfollow_forum()" @mouseover="changeToLeave()" @mouseleave="changeToJoin()"> {{ join_state }} </button>
            <button v-else v-on:click="follow_forum()"> JOIN </button>
          </div>
        </div> 
      </div>
    </div> 
    <div v-if="popup" id="popup">
      <div id="popup-wrapper">
        <div id="popup-container">
          <div> Delete Comment </div>
          <div> Are you sure you want to delete this post? </div>
          <div id="pop-up-buttons">
            <button v-on:click="delete_post(); popup_menu(false)"> DELETE </button>
            <button v-on:click="popup_menu(false)"> CANCEL </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import {bus} from '../main.js';
import Comment_Single from "./Comment_Single.vue";
import dateMixin from '../mixins/dateMixin';
import imageMixin from '../mixins/imageMixin';

export default {
  components: {
    commentsingle: Comment_Single
  },
  props: ['token', 'user'],
  data() {
    return { 
      input: { add_comment: '' },
      id: null,
      post: {},
      comments: {},
      comments_details: {},
      followed: false,
      popup: false,
      join_state: 'JOINED',
      loading: false
    };
  },
  methods: {
    forum_post() {
      this.loading = false;
      this.id = this.$route.params.id;
      axios.get(`${this.domain_name_api}post/${this.id}`).then(response => {
        this.post = response.data.post;
        let page_num = this.$route.query.page ? this.$route.query.page : 1;
        axios.get(`${this.domain_name_api}comments?post_id=${this.post.id}&page=${page_num}`).then(response => {
          this.comments = response.data.comments;
          this.comments_details = response.data.details;
        }).catch(() => {
          this.$router.push('/error404');
        });
        if(this.token) {
          axios.get(`${this.domain_name_api}user_follower?forum_id=${this.post.forum.id}`, { headers: { 'x-access-token' : this.token } }).then(response => {
            this.followed = response.data.follow ? true : false;
          });
        } else {
          this.followed = false;
        }
        this.loading = true;
      }).catch(() => {
        this.$router.push('/error404');
      });
    },
    follow_forum() {
      axios.post(`${this.domain_name_api}user/follow/${this.post.forum.id}`, {}, { headers: { 'x-access-token' : this.token } }).then((response) => {
        this.followed = true;
        this.post.forum.followers += 1;
        bus.$emit('follow_forum', response.data.forum);
        bus.$emit('show_hide_notify', 'Forum followed');   
      });
    },
    unfollow_forum() {
      axios.delete(`${this.domain_name_api}user/unfollow/${this.post.forum.id}`, { headers: { 'x-access-token' : this.token } }).then((response) => {
        this.followed = false;
        this.post.forum.followers -= 1;
        bus.$emit('unfollow_forum', response.data.forum);
        bus.$emit('show_hide_notify', 'Forum unfollowed');
      });
    },
    delete_post() {
      axios.delete(`${this.domain_name_api}post/${this.post.id}`, { headers: { 'x-access-token' : this.token } }).then(() => {
        this.$router.push(`/forum/${this.post.forum.name}`);
        bus.$emit('show_hide_notify', 'Post deleted');   
      });
    },
    add_comment() {
      let content = this.input.add_comment.trim();
      if(content.length > 0) {
        axios.post(`${this.domain_name_api}comment`, {'content' : content, 'post_id' : this.post.id}, { headers: { 'x-access-token' : this.token } }).then((response) => {
          this.post.num_of_comments += 1;
          this.input.add_comment = '';
          this.comments.unshift(response.data.comment);
          if(this.comments.length > 10) {
            this.comments.pop();
          }
          bus.$emit('show_hide_notify', 'Commented on post');      
        });
      }
    },
    delete_comment(user_comment) {
      axios.delete(`${this.domain_name_api}comment/${user_comment.id}`, { headers: { 'x-access-token' : this.token } }).then(() => {
        let index = this.comments.indexOf(user_comment); // get index of this specific object from comments array
        if(index > -1) {
          this.comments.splice(index, 1); // delete the selected index of the comments array
          this.post.num_of_comments -= 1;
          bus.$emit('show_hide_notify', 'Comment deleted');
        }
      });
    },
    popup_menu(val) {
      if(val) {
        document.body.style = "overflow: hidden";
      } else {
        document.body.style = "overflow: scroll";
      }
      this.popup = val;
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
      return this.forum_image(this.post.forum.display_picture);
    },
    c_time_ago: function() {
      return this.time_ago(this.post.date_posted);
    },
    c_normal_date() {
      return this.normal_date_format(this.post.forum.date_created);
    } 
  },
  created() {
    this.forum_post();
  },
  watch: {
		$route() {
			this.forum_post();
		}
  },
  mixins: [dateMixin, imageMixin]
};
</script>

<style scoped>
/* POST */
#forum-post-layout {
  width: 1200px;
  margin: 0 auto;
  margin-bottom: 5rem;
}

#post-comments-padding-g {
  padding: 0 3rem;
}

#post-full-layout {
	position: relative;
	width: 750px;
}

#post-comments-layout {
  margin-top: 1rem;
  margin-right: 1rem;
  background:#fff;
	border: 1px solid #999;
  border-radius: 4px;
  padding: 1rem 2rem;
}

#post-header img {
  border-radius: 50%;
}

#post-header-data {
	margin-left: 0.5rem;
	line-height: 40px;
}

#post-header-data a {
  cursor: pointer;
  text-decoration: none;
  color: black;
}

#post-header-data a:hover {
  text-decoration: underline;
}

#post-header-data > a {
  margin-left: 0.5rem;
  font-weight: 600;  
}

#post-header-data > span:nth-of-type(1) {
	margin-left: 1rem;
	font-size: 0.8rem;
}

#post-header-data > span:nth-of-type(2) {
	font-size: 0.8rem;
	margin-left: 0.3rem; 
}

#post-content {
  margin-top: 1rem;
  margin-bottom: 2rem;
}

#post-content > div:nth-of-type(1) {
  font-weight: 600;
}

#post-content > div:nth-of-type(2) {
  font-size: 0.8rem;  
}

#user-post {
  padding-bottom: 3rem;
  border-bottom: 1px solid #999;
  overflow: hidden;
}

#user-post button {
  width: 100px;
  margin: 0.5rem 0;
  font-size: 0.9rem;
  cursor: pointer;
  background-color: rgb(17, 65, 133);
  padding: 0.5rem 0;
  border-radius: 3px; 
  border: none;
  color:white;
  text-align: center;
}

#user-post button:hover {
  background-color: rgb(11, 52, 110); 
}

#user-post textarea {
  width: 100%;
  display: block;
  outline: 0;
  font-size: 1.1rem;
  padding: 0.5rem;
  border-radius: 3px;
  height: 60px;
  resize: none;
}

#modify-post .post-delete {
  margin-left: 1rem;
}

#add-comment button {
  margin-bottom: 0;
  float: right;
}

/* COMMENTS */
#comments-details {
  margin-top: 1rem;
}

/* POPUP TO DELETE POST */
#popup {
  z-index: 30;
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%; 
  background-color: rgba(0, 0, 0, 0.9); 
}

#popup-wrapper {
  border-radius: 1px;
  position: relative;
  background-color: #fff;
  width: 300px;
  margin: 0 auto;
  top: 50%;
  transform: translateY(-50%);
}

#popup-container {
  padding: 1.5rem;
  overflow: hidden;
}

#popup-container > div:nth-of-type(1) {
  font-size: 0.9rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
}

#popup-container > div:nth-of-type(2) {
  font-size: 0.8rem;
}

#pop-up-buttons {
  margin-top: 2rem;
  float: right;
}

#pop-up-buttons button {
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

#pop-up-buttons button:hover {
  background-color: rgb(11, 52, 110);
}

#pop-up-buttons button:nth-of-type(2) {
  margin-left: 0.5rem;
}

/* SIDE ABOUT */
#side-forum-name {
  margin-bottom: 1rem;
}

#side-forum-name img {
  border-radius: 50%;
}

#side-forum-name span {
  margin-left: 1rem;
  line-height: 50px;
  font-size: 1.3rem;
  font-weight: 700;
}

#side-content-g button {
  width: 100%;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  background-color: #fff;
  border: 1px solid black;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 700;
  margin-top: 1rem;
}

#side-content-g button:hover {
  background-color: rgb(17, 65, 133);
  border: 1px solid rgb(17, 65, 133);
  border: none;
  color: white;
}

@media (max-width: 992px) {
  #forum-post-layout {
    width: 800px;
  }

  #post-comments-padding-g {
    padding: 0 1rem;
  }

  #post-comments-layout {
    margin-right: 0;
  }

  /* POST */
  #post-header img {
    height: 35px;
    width: 35px;
  }

  #post-header-data {
    margin-left: 0.4rem;
    line-height: 35px;
  }

  #post-header-data > a {
    margin-left: 0.4rem;
    font-size: 0.9rem;
  }

  #post-header-data > span:nth-of-type(1) {
    margin-left: 0.8rem;
    font-size: 0.7rem;
  }

  #post-header-data > span:nth-of-type(2) {
    font-size: 0.7rem;
    margin-left: 0.2rem; 
  }

  #post-content {
    margin-top: 0.8rem;
    margin-bottom: 1.5rem;
  }

  #post-content > div:nth-of-type(1) {
    font-size: 0.9rem;
  }

  #post-content > p {
    font-size: 0.9rem;
    margin: 0.8rem 0;
  }

  #post-content > div:nth-of-type(2) {
    font-size: 0.7rem;  
  }

  #user-post {
    padding-bottom: 2.5rem;
  }

  #user-post button {
    margin: 0.4rem 0;
    font-size: 0.8rem;
    padding: 0.5rem 0;
  }

  #user-post textarea {
    font-size: 1rem;
    padding: 0.4rem;
  }

  #modify-post .post-delete {
    margin-left: 0.7rem;
  }

  /* COMMENTS */
  #comments-details {
    margin-top: 0.8rem;
  }
}

@media (max-width: 768px) {
  
}
</style>