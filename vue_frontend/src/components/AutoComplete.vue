<template>
  <a @mousedown.prevent @click="forumPage(forum.name)" class="search-item flex">
    <img v-bind:src="c_forum_image" height="30" width="30">				
    <div class="search-content flex space-between">
      <span class="forum-title"> {{ forum.name }} </span>
      <div class="search-stats flex">
        <span> {{ forum.followers }} <template> followed </template> </span>
        <span> {{ forum.num_of_post }} <template> posted </template> </span>
      </div>
    </div>
  </a>
</template>
<script>
import imageMixin from '../mixins/imageMixin';
import {bus} from '../main.js';

export default {
  props: ['forum'],
  computed: {
    c_forum_image: function() {
      return this.forum_image(this.forum.display_picture);
    }
  },
  methods: {
    forumPage(name) {
      this.$router.push(`/forum/${name}`).catch(() => {});
      bus.$emit('closeSearchBox');
    }
  },
  mixins: [imageMixin]
};
</script>

<style scoped>
.search-item {
	padding: 0.3rem 0.5rem;
	cursor: pointer;
}

.search-item:hover {
  background: #f8f9fa;
}

.search-item img {
	border-radius: 50%;
	margin-right: 0.5rem;	
}

.forum-title {
  font-weight: 700;
}

.search-stats span {
	font-size: 0.9rem;
	margin-right: 1.5rem;
}

.search-content {
	width: 100%;
  line-height: 30px;
}

a {
	color: black;
	text-decoration: none;
}

@media (max-width: 992px) {
  .search-item {
    padding: 0.2rem 0.4rem;
  }

  .search-item img {
    height: 24px;
    width: 24px;
    margin-right: 0.3rem;
  }

  .search-stats span {
    font-size: 0.7rem;
    margin-right: 1rem;
  }

  .search-content {
    line-height: 24px;
  }

  .forum-title {
    font-size: 0.8rem;
  }
}

@media (max-width: 768px) {
  .search-item {
    padding: 0.1rem 0.3rem;
  }
  .search-stats span {
    margin-right: 0.5rem;
  }
}
</style>