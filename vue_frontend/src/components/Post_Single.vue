<template>
  <div class="post-item">
    <router-link :to="{ path: `/forum/${post.id}/comments`}" class="comment-link">
      <div class="inner-item">
        <div class="item-header flex">
          <router-link v-if="set_user_image" :to="{ path: `/user/${post.user.username}/posts`}"><img v-bind:src="c_user_image" height="25" width="25"></router-link> 
          <router-link v-if="set_forum_image" :to="{ path: `/forum/${post.forum.name}`}"><img v-bind:src="c_forum_image" height="25" width="25"></router-link>      
          <div class="item-header-data">
            <slot name="post-details-slot"> </slot>
            <span class="post-time"> {{ c_time_ago }} </span>
          </div>
        </div>
        <div class="item-body">
          <div> {{ post.title }} </div> 
          <p> {{ post.content }} </p>
          <div> {{ post.num_of_comments }} <template> Comments </template></div>     
        </div>
      </div>
    </router-link>
  </div>
</template>

<script>
import dateMixin from '../mixins/dateMixin';
import imageMixin from '../mixins/imageMixin';

export default {
  props: ['token', 'user', 'post', 'image_type'],
  computed: {
    c_time_ago: function() {
      return this.time_ago(this.post.date_posted);
    },
    set_user_image: function() {
      return this.image_type == 'user'; 
    },
    set_forum_image: function() {
      return this.image_type == 'forum'; 
    },
    c_user_image: function() {
      return this.user_image(this.post.user.display_picture);
    },
    c_forum_image: function() {
      return this.forum_image(this.post.forum.display_picture);
    }
  },
  mixins: [dateMixin, imageMixin]
};
</script>

<style scoped>
.post-item {
	background-color: #fff;
	border: 1px solid #999;
	margin: 1rem 0;
	border-radius: 3px;
	cursor: pointer;	
}

.post-time {
	font-size: 0.8rem;
	margin-left: 0.3rem; 
	font-weight: 300;
}

.inner-item {
  padding: 0.5rem 1.5rem;
} 

.post-item:hover {
  border: 1px solid black;	
}

.item-body {
  margin-top: 0.8rem;
}

#post-content-g .item-header-data {
	margin-left: 0.5rem;
	line-height: 25px;
}

.item-header img {
	border-radius: 50%;
}

.item-body div:nth-of-type(1) {
  font-weight: 600;
}

.item-body p {
	font-size: 0.9rem;
	margin: 1rem 0;
}

.item-body div:nth-of-type(2) {
  font-size: 0.7rem;
}

@media (max-width: 992px) {
  .post-time {
    font-size: 0.7rem;
    margin-left: 0.2rem; 
  }

  .inner-item {
    padding: 0.3rem 1.2rem;
  } 

  .item-body {
    margin-top: 0.6rem;
  }

  #post-content-g .item-header-data {
    margin-left: 0.4rem;
    line-height: 23px;
  }

  .item-body div:nth-of-type(1) {
    font-size: 0.9rem;
  }

  .item-body p {
    font-size: 0.8rem;
    margin: 0.8rem 0;
  }

  .item-body div:nth-of-type(2) {
    font-size: 0.6rem;
  }

  .item-header img {
    height: 23px;
    width: 23px;
  }
}

@media (max-width: 768px) {
  .item-body {
    margin-top: 0.5rem;
  }

  .item-body p {
    margin: 0.7rem 0;
  }
}
</style>