<template>
	<div id="ERROR_PAGE">
		<div> 403 </div>
		<div> Forbidden </div>
		<div> You don't have permission to access this page. </div>
		<button v-on:click="return_home()"> Return to Homepage </button>
	</div>
</template>

<script>

export default {
  methods: {
		return_home() {
			this.$router.push('/');
		}
  }
};
</script>

<style scoped>
#ERROR_PAGE {
	position: relative;
	top: 250px;
	width: 700px;
	text-align: center;
	margin: 0 auto;
}

#ERROR_PAGE div:nth-of-type(1){
	font-size: 10rem;
	color: rgb(77, 154, 209);
}

#ERROR_PAGE div:nth-of-type(2){
	font-size: 3rem;
	margin: 1rem 0;
}

#ERROR_PAGE div:nth-of-type(3){
	font-size: 1.2rem;
	margin: 1rem 0;
}

button {
	margin-top: 1.5rem;
	font-size: 0.8rem;
	cursor: pointer;
	background-color: rgb(17, 65, 133);
	padding: 0.8rem;
	border-radius: 4px; 
	border: none;
	color:white;
}

button:hover {
	background-color: rgb(11, 52, 110);
}


@media (max-width: 992px) {

}

@media (max-width: 768px) {
	
}
</style>
