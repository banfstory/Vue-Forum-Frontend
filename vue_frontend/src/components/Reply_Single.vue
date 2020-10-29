<template>
  <div class="reply-item" @mouseover="hover=true" @mouseleave="hover=false">
    <div v-if="dotpopup" class="dot-popup" ref="modify-popup">
      <template v-if="dotmodify">
        <div v-on:click="showUpdateReply()" class="flex"> <i class="far fa-edit"> </i> <span> Update </span> </div>
        <div v-on:click="dotpopup=false; delete_reply()" class="flex"> <i class="fas fa-trash-alt"> </i> <span> Delete </span> </div>
      </template>
      <template v-else>
        <div class="flex"> <i class="fas fa-flag"> </i> <span> Report </span>  </div>
      </template>
    </div>
    <div class="flex space-between">
      <div class="reply-header flex">
        <router-link :to="{ path: `/user/${reply.user.username}/posts`}">
          <img v-bind:src="c_user_image" height="30" width="30">
        </router-link>
        <div class="reply-header-data">
          <span>  Posted by  <router-link :to="{ path: `/user/${reply.user.username}/posts`}">{{ reply.user.username }}</router-link> </span> 
          <span> {{ c_time_ago }}  </span>  
        </div>
      </div>
      <div v-if="hover" v-on:click="popup_reply(!dotpopup)" class="vertical-dots" ref="triple-dots"></div>
    </div>
    <p> {{ reply.content }} </p>
    <div v-if="updatereply" class="comment-reply-popup-g">
      <div v-if="content_empty_error" class="error-input">Content cannot be empty</div>
      <div v-else-if="content_limit_error" class="error-input">Content field must not exceed 20000 characters</div>
      <textarea placeholder="Update reply" v-model="input.update_reply"> </textarea>
      <div class="reply-comment-buttons-g">
        <button v-on:click="update_reply()"> Update </button>
        <button v-on:click="updatereply=false; resetValidation()"> Cancel </button>
      </div>
    </div>
  </div>
</template>

<script>
import {bus} from '../main.js';
import axios from 'axios';
import dateMixin from '../mixins/dateMixin';
import imageMixin from '../mixins/imageMixin';

export default {
  props: ['token', 'user', 'reply'],
  data() {
    return {
      input: { update_reply: '' },
      hover: false,
      dotpopup: false,
      dotmodify: false,
      updatereply: false,
      content_empty_error: false,
      content_limit_error: false
    }
  },
  methods: {
    delete_reply() {
      this.$emit('removeReply', this.reply);
    },
    modify_reply() {
      if(this.token && this.user.id == this.reply.user.id) {
        this.dotmodify = true;
      } else {
        this.dotmodify = false;
      }
    },
    update_reply() {
      this.resetValidation();
      let content = this.input.update_reply.trim();
      if(content.length == 0) {
        this.content_empty_error = true;
      } else if(content.length > 20000) {
        this.content_limit_error = true;
      } else {
        axios.put(`${this.domain_name_api}reply/${this.reply.id}`, { 'content' : content }, { headers: { 'x-access-token' : this.token } }).then(() => {
          this.reply.content = content;
          this.input.update_reply = '';
          bus.$emit('show_hide_notify', 'Reply updated');
        });
        this.updatereply = false;
      }
    },
    popup_reply() {
      bus.$emit('dotpopup', this);
    },
    showUpdateReply() {
      this.dotpopup = false; 
      this.updatereply = true; 
      this.input.update_reply = this.reply.content;
    },
    resetValidation() {
      this.content_empty_error = false;
      this.content_limit_error = false;
    }
  },
  computed: {
    c_user_image: function() {
      return this.user_image(this.reply.user.display_picture);
    },
    c_time_ago: function() {
      return this.time_ago(this.reply.date_reply );
    }
  },
  created() {
    this.modify_reply();
  },
  mixins: [dateMixin, imageMixin]
};
</script>

<style scoped>
.dot-popup {
  transform: translateX(70px);
}

.reply-header img {
  border-radius: 50%;
}

.reply-header-data {
  margin-left: 0.5rem;
  line-height: 30px;
}

.reply-header a {
  cursor: pointer;
  text-decoration: none;
  color: black;  
}

.reply-header a:hover {
  text-decoration: underline;
}

.reply-header span:nth-of-type(1) {
	font-size: 0.8rem;
}

.reply-header span:nth-of-type(2) {
	font-size: 0.8rem;
	margin-left: 0.3rem; 
}

.reply-item p {
  margin: 0.7rem 0;
  margin-left: 2.4rem;
  font-size: 0.8rem;
}

.vertical-dots:after {
  font-size: 1.2rem;
}

.comment-reply-popup-g textarea {
  font-size: 0.9rem;
}

.reply-comment-buttons-g button {
  font-size: 0.8rem;
}

@media (max-width: 992px) {
  .reply-header img {
    height: 26px;
    width: 26px;
  }

  .reply-header-data {
    margin-left: 0.4rem;
    line-height: 26px;
  }

  .reply-item p {
    margin: 0.6rem 0;
    margin-left: 2.2rem;
  }

 /* Reply Vertical Dots */
  .vertical-dots:after {
    font-size: 1.1rem;
  }

    /* Reply Popup */
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