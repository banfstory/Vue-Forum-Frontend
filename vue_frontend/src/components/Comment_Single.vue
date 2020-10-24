<template>
  <div class="comment-item">
    <div v-if="dotpopup" class="dot-popup" ref="modify-popup">
      <template v-if="dotmodify">
        <div v-on:click="dotpopup=false; updatecomment=true; currentdata=comment.content" class="flex"> <i class="far fa-edit"> </i> <span> Update </span> </div>
        <div v-on:click="dotpopup=false; delete_comment()" class="flex"> <i class="fas fa-trash-alt"> </i> <span> Delete </span> </div>
      </template>
      <template v-else>
        <div class="flex"> <i class="fas fa-flag"> </i> <span> Report </span>  </div>
      </template>
    </div>
    <div @mouseover="hover=true" @mouseleave="hover=false">
      <div class="flex space-between">
        <div class="comment-header flex">
          <router-link :to="{ path: `/user/${comment.user.username}/posts`}">
            <img v-bind:src="c_user_image" height="40" width="40">
          </router-link>
          <div class="comment-header-data">
            <span>  Posted by  <router-link :to="{ path: `/user/${comment.user.username}/posts`}">{{ comment.user.username }}</router-link> </span> 
            <span> {{ c_time_ago }} </span>
          </div>
        </div>
        <div v-if="hover" v-on:click="popup_comment(!dotpopup)" class="vertical-dots" ref="triple-dots"> </div>
      </div>
      <p> {{ comment.content }} </p>
    </div>
    <div v-if="token" class="comment-footer">
      <div v-on:click="addreply=true" class="prompt-reply"> REPLY </div>
      <div v-if="addreply" class="comment-reply-popup-g">
        <textarea placeholder="Add a reply" v-model="input.add_reply"></textarea>
        <div class="reply-comment-buttons-g">
          <button v-on:click="reply_to_comment()"> Reply </button>
          <button v-on:click="addreply=false"> Cancel </button>
        </div>
      </div>
      <div v-if="updatecomment" class="comment-reply-popup-g">
        <textarea placeholder="Update comment" v-model="input.update_comment"> </textarea>
        <div class="reply-comment-buttons-g">
          <button v-on:click="update_comment()"> Update </button>
          <button v-on:click="updatecomment=false"> Cancel </button>
        </div>
      </div>
    </div>
    <div v-if="show_replys" v-on:click="reply_hide()" class="reply-display"> Hide {{ comment.num_of_reply }} replies </div>
    <div v-else v-on:click="reply_show()" class="reply-display"> Show {{ comment.num_of_reply }} replies </div>
    <div v-if="show_replys" class="reply-details">
      <div v-for="reply in replys" v-bind:key="reply.id" class="reply-item">
        <replysingle v-bind:token="token" v-bind:user="user" v-bind:reply="reply" v-on:removeReply="delete_reply($event)"> </replysingle>
      </div>
    </div>
  </div>
</template>

<script>
import {bus} from '../main.js';
import Reply_Single from "./Reply_Single.vue";
import axios from 'axios';
import dateMixin from '../mixins/dateMixin';
import imageMixin from '../mixins/imageMixin';

export default {
  components: {
    replysingle: Reply_Single
  },
  props: ['token', 'user', 'comment'],
  data() {
    return {
      input: { add_reply : '', update_comment: '' },
      show_replys : false,
      replys: {},
      hover: false,
      dotpopup: false,
      dotmodify: false,
      addreply: false,
      updatecomment: false,
    }
  },
  methods: {
    replys_result() {
      axios.get(`${this.domain_name_api}replys?comment_id=${this.comment.id}`).then(response => {
        this.replys = response.data.replys;
      });
    },
    delete_comment() {
      this.$emit('removeComment', this.comment);
    },
    reply_to_comment() {
      let content = this.input.add_reply.trim();
      if(content.length > 0) {
        axios.post(`${this.domain_name_api}reply`, { 'content' : content, 'comment_id' : this.comment.id }, { headers: { 'x-access-token' : this.token } }).then((response) => {
          this.comment.num_of_reply += 1;
          this.input.add_reply = '';
          bus.$emit('show_hide_notify', 'Comment replied');
          if(this.show_replys) {
            this.replys.unshift(response.data.reply); // add to begginning of replys array
          }
        });
        this.addreply = false;
      }
    },
    update_comment() {
      let content = this.input.update_comment.trim();
      if(content.length > 0) {
        axios.put(`${this.domain_name_api}comment/${this.comment.id}`, { 'content' : content }, { headers: { 'x-access-token' : this.token } }).then(() => {
          this.comment.content = content;
          this.input.update_comment = '';
          bus.$emit('show_hide_notify', 'Comment updated');
        });
        this.updatecomment = false;
      }
    },
    modify_comment() {
      if(this.token && this.user.id == this.comment.user.id) {
        this.dotmodify = true;
      } else {
        this.dotmodify = false;
      }
    },
    delete_reply(user_reply) {
      axios.delete(`${this.domain_name_api}reply/${user_reply.id}`, { headers: { 'x-access-token' : this.token } }).then(() => {
        let index = this.replys.indexOf(user_reply); // get index of this specific object from replys array
        if(index > -1) {
          this.replys.splice(index, 1); // delete the selected index of the replys array
          this.comment.num_of_reply -= 1;
          bus.$emit('show_hide_notify', 'Reply deleted');
        }
      });
    },
    reply_show() {
      this.replys_result();
      this.show_replys = true;
    },
    reply_hide() {
      this.replys = {};
      this.show_replys = false;
    },
    popup_comment() {
      bus.$emit('dotpopup', this);
    }
  },
  computed: {
    c_user_image: function() {
      return this.user_image(this.comment.user.display_picture);
    },
    c_time_ago: function() {
      return this.time_ago(this.comment.date_commented);
    }
  },
  created() {
    this.modify_comment();
  },
  mixins: [dateMixin, imageMixin]
};
</script>

<style scoped>
.reply-details {
  margin: 0 1.5rem;
}

.dot-popup {
  transform: translateX(90px);
}

.comment-header img {
  border-radius: 50%;
}

.comment-item {
  margin-bottom: 3rem;
}

.comment-header-data {
  font-size: 0.9rem;
  margin-left: 0.5rem;
  line-height: 40px;
}

.comment-header a {
  cursor: pointer;
  text-decoration: none;
  color: black;
}

.comment-header a:hover {
  text-decoration: underline;
}

.comment-header > span:nth-of-type(1) {
	font-size: 0.8rem;
	font-weight: 300;
}

.comment-header > span:nth-of-type(2) {
	font-size: 0.8rem;
	margin-left: 0.3rem; 
	font-weight: 300;
}

.prompt-reply, .reply-display {
  margin-bottom: 1rem;
  font-weight: 700;
  cursor: pointer;
}

.prompt-reply {
  font-size: 0.7rem;
}

.reply-display {
  font-size: 0.9rem;
  color: rgb(11, 52, 110);
}

@media (max-width: 992px) {
  .reply-details {
    margin: 0 1.2rem;
  }

  .comment-header img {
    height: 35px;
    width: 35px;
  }

  .comment-item p {
    font-size: 0.9rem;
    margin: 0.8rem 0;
  }

  .comment-item {
    margin-bottom: 2.5rem;
  }

  .comment-header-data {
    margin-left: 0.4rem;
    line-height: 35px;
  }

  .prompt-reply, .reply-display {
    margin-bottom: 0.8rem;
  }

  .reply-display {
    font-size: 0.8rem;
  }

  /* Comment Vertical Dots */
  .vertical-dots:after {
    font-size: 1.2rem;
  }

  /* Comment Popup */
  .dot-popup {
    right: 150px;
    width: 110px;
  }

  .dot-popup i {
    margin-right: 0.6rem;
    font-size: 1.1rem;
  }

  .dot-popup div {
    font-size: 0.8rem;
    padding: 0.7rem;
  }
}

@media (max-width: 768px) {
  
}
</style>