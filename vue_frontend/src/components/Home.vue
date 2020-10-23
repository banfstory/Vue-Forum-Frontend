<template>
	<div v-if="loading" id="home">
		<div id="post-layout-g">
			<div id="post-padding-g">
				<div id="post-container">
					<div id="post-content-g">
						<h1> RECENT POSTS </h1>
						<div v-for="post in posts" v-bind:key="post.id">
							<postsingle v-bind:token="token" v-bind:user="user" v-bind:post="post" image_type="forum"> 
								<span slot="post-details-slot" class="post-header-details">
									<router-link :to="{ path: `/forum/${post.forum.name}`}" class="post-forum-link">{{ post.forum.name }}</router-link>
									<span>  Posted by  <router-link :to="{ path: `user/${post.user.username}/posts`}">{{ post.user.username }}</router-link> </span>
								</span> 
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
			posts : {},
			details: {},
			loading: false
		}
	},
	methods: {
		posts_results() {
			this.loading = false;
			let page_num = this.$route.query.page ? this.$route.query.page : 1;
			axios.get(`${this.domain_name_api}posts?page=${page_num}`).then(response => {
				this.posts = response.data.posts;
				this.details = response.data.details;
				this.loading = true;
			}).catch(() => {
				this.$router.push('/error404');
			});
		}
	},
	computed: {
    c_forum_image: function() {
      return this.forum_image(this.post.forum.display_picture);
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
#post-content-g h1 {
	margin-left: 1rem;
}

/* Posts */
#post-content-g .post-header-details span {
	margin-left: 1rem;
	font-size: 0.8rem;
	font-weight: 300;
}

#post-content-g .post-header-details > a {
	font-weight: 600;
	font-size: 0.9rem;
}

@media (max-width: 992px) {
	#post-content-g .post-header-details span {
		margin-left: 0.8rem;
		font-size: 0.7rem;
	}

	#post-content-g .post-header-details > a {
		font-size: 0.8rem;
	}
}

@media (max-width: 768px) {
	#post-content-g .post-header-details span {
		margin-left: 0.6rem;
	}
}
</style>
