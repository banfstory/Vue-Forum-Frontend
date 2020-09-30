<template>
  <router-link :to="{ path: `/forum/${follow.name}`}" class="flex">
    <img v-bind:src="c_forum_image" height="35" width="35">
    <span> {{ follow.name }} </span>
  </router-link>
</template>
<script>
import imageMixin from '../mixins/imageMixin';

export default {
  props: ['follow'],
  computed: {
    c_forum_image: function() {
      return this.forum_image(this.follow.display_picture);
    }
  },
  mixins: [imageMixin]
};
</script>

<style scoped>
a {
  text-decoration: none;
  color: black;
  padding: 0.5rem;
  cursor: pointer;
}

a:hover {
  background: #f8f9fa;
}

img {
  border-radius: 50%; 
}

span {
  line-height: 35px;
  margin-left: 0.5rem;
  font-weight: 550;
  font-size: 0.9rem;
}

@media (max-width: 992px) {
  img {
    width: 30px;
    height: 30px;
  }

  span {
    line-height: 30px;
    font-size: 0.7rem;
  }

  a {
    padding: 0.4rem;
  }
}

@media (max-width: 768px) {
  span {
    display: none;
  }
}
</style>