<template>
  <router-link :to="{path: `/forum/${forum.name}`}" class="search-item flex">
    <img v-bind:src="c_forum_image" height="30" width="30">				
    <div class="search-content flex space-between">
      <span class="forum-title"> {{ forum.name }} </span>
      <div class="search-stats flex">
        <span> {{ forum.followers }} <template> followed </template> </span>
        <span> {{ forum.num_of_post }} <template> posted </template> </span>
      </div>
    </div>
  </router-link>
</template>
<script>
import imageMixin from '../mixins/imageMixin';

export default {
  props: ['forum'],
  computed: {
    c_forum_image: function() {
      return this.forum_image(this.forum.display_picture);
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
</style>