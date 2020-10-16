<template>
	<div id="search-result-layout">
		<div id="search-result-container">
			<div id="search-result-content">
				<h2> Search results for '{{ query }}': </h2>
				<div v-for="forum in forums" v-bind:key="forum.id">
					<searchsingle v-bind:forum="forum"></searchsingle>
				</div>
			</div>
		</div>
		<div id="pagination-bar">
			<span v-for="page in details.paginate" v-bind:key="page">
				<router-link v-if="page" :to="{ path: '/search', query: { q : query, page : page } }" v-bind:class="{'page-active' : page == details.page}"> {{ page }} </router-link>
				<span v-else> ... </span>
			</span>
		</div>
	</div>
</template>
<script>
import axios from 'axios';
import Search_Single from './Search_Single';

export default {
	props: ['token', 'user'],
	components: {
    searchsingle: Search_Single
  },
	data() {
		return {
			query: null,
			forums: {},
			details: {},
			loading: false
		}
	},
	methods: {
		search_result() {
			this.loading = false;
			this.query = this.$route.query.q;
			if(this.query.trim().length == 0) {
				this.$router.push('/');
			}
			let page_num = this.$route.query.page ? this.$route.query.page : 1;
			axios.get(`${this.domain_name_api}forums?query=${this.query}&page=${page_num}`).then(response => {
				this.forums = response.data.forums;
				this.details = response.data.details;
				this.loading = true;
			});
		},
	},
	created() {
		this.search_result();
	},
	watch: {
		$route() {
			this.search_result();
		}
	}
};
</script>

<style>
#search-result-layout {
	transform: translateY(30px);
	position: relative;
	width: 800px;
	margin: 0 auto;
	margin-bottom: 5rem;
}

#search-result-content {
	border: 1px solid #ced4da;
	border-radius: 3px;
	background:#fff;
	padding: 2rem;
}

#search-result-layout h2 {
	margin-bottom: 2rem
}
</style>