<template>
  <div v-if="loading"> 
    <div id="form-layout-g">
      <div id="form-padding-g">
        <div id="form-container-g">
          <div id="forum-profile" class="flex">
            <img v-bind:src="c_forum_image" height="125" width="125">
            <div>
              <div> {{ forum.name }} </div>
              <div> Forum </div>
            </div>
          </div>
          <button v-if="forum.display_picture!='default.png'" v-on:click="popup=true"> Remove Forum Picture </button>
          <h2> Update Account </h2>
          <label> About </label>
          <textarea v-model="forum.about" type="text"> </textarea>
          <div v-if="about_limit_error" class="error-input">About field must not exceed 30000 characters</div>
          <label> Image Upload </label>
          <div v-if="image_invalid_error" class="error-input">File must have the extension .jpg or .png</div>
          <input type="file" name="image_file" ref="forum_picture">
          <button v-on:click="update_forum()" class="form-submit-g"> Update </button>
        </div>
      </div>
    </div>
    <div v-if="popup" id="popup-form-g">
      <div id="popup-wrapper-form-g">
        <div id="popup-container-form-g">
          <div> Remove Forum Image </div>
          <div> Are you sure you want to remove this image? </div>
          <div id="pop-up-buttons-form-g">
            <button v-on:click="remove_forum_image()"> REMOVE </button>
            <button v-on:click="popup=false"> CANCEL </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import {bus} from '../main.js';
import imageMixin from '../mixins/imageMixin';

export default {
  props: ['token', 'user'],
  data() {
    return {
      query: null,
      forum: {},
      loading: false,
      image_invalid_error: false,
      about_limit_error: false,
      popup: false
    }
  },
  methods: {
    remove_forum_image() {
			axios.delete(`${this.domain_name_api}remove_forum_picture/${this.forum.id}`, { headers: { 'x-access-token' : this.token } }).then(() => {
        this.forum.display_picture = 'default.png';
        bus.$emit('show_hide_notify', 'Forum picture removed');
        this.popup = false;
			});
		},
    change_forum_image() {
      let image = this.$refs['forum_picture'].files[0];
      if(image) {
        let ext = image.name.split('.').pop(); // the extnesion will be the last period of the filename therefore pop is used
        if(ext != 'jpg' && ext != 'png') {
          this.image_invalid_error = true;
        } else {
          let form_data = new FormData();
          form_data.append("file", image);
          axios.post(`${this.domain_name_api}update_forum_image/${this.forum.id}`, form_data, { headers: { 'Content-Type': 'multipart/form-data', 'x-access-token' : this.token } }).then(response => {
            let picture = response.data.filename
            if(picture) {
              this.forum.display_picture = picture;
            }
          })
        }
      }
		},
    update_forum() {
      this.resetValidation();
      let about = this.forum.about.trim();
      if(about.length > 30000) {
        this.about_limit_error = true;
      } else {
        axios.put(`${this.domain_name_api}forum/${this.forum.id}`, {'about' : about}, { headers: { 'x-access-token' : this.token } }).then(response => {
          this.change_forum_image();
          this.about = response.data.forum.about;
          bus.$emit('show_hide_notify', 'Forum updated');
        });
      }
    },
    forum_results() {
      this.loading = false;
      this.query = this.$route.params.name;
      axios.get(`${this.domain_name_api}forum?name=${this.query}`).then(response => {
        this.forum = response.data.forum;
        this.loading = true;
      }).catch(() => {
         this.$router.push('/error404');
      });
    },
    resetValidation() {
      this.image_invalid_error = false;
      this.about_limit_error = false;
		}
  },
  computed: {
    c_forum_image: function() {
      return this.forum_image(this.forum.display_picture);
    }
  },
  created() {
    if(!this.token) {
      this.$router.push('/error403');
		} else {
      this.forum_results();
    }
  },
  watch: {
		$route() {
			this.forum_results();
		}
  },
  mixins: [imageMixin]
};
</script>

<style scoped>
#form-layout-g {
  transform: translateY(25%);
}

#form-layout-g img {
	border-radius: 50%;
}

#forum-profile > div {
	margin-left: 1.5rem;
}

#forum-profile > div > div:nth-of-type(1) {
	font-size: 2.5rem;
	margin-bottom: 0.5rem;
}

#forum-profile > div > div:nth-of-type(2) {
  font-size: 1.1rem;
}

#form-layout-g button:nth-of-type(1) {
	margin: 1rem 0;
}

@media (max-width: 992px) {
  #form-layout-g img {
    height: 100px;
    width: 100px;
  }

  #forum-profile > div {
    margin-left: 1.2rem;
  }

  #forum-profile > div > div:nth-of-type(1) {
    font-size: 2rem;
    margin-bottom: 0.3rem;
  }

  #forum-profile > div > div:nth-of-type(2) {
    font-size: 0.9rem;
  }
}

@media (max-width: 768px) {
  
}
</style>