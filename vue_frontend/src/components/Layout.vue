<template>
  <div id="layout">
    <header>
      <div id="top-nav" class="flex space-between">
        <div id="logo" class="flex">
          <router-link to="/">
            <i class="fab fa-forumbee"></i>
            <span>Flask Forum</span>
          </router-link>
        </div>
        <div id="search">
          <input v-model="search_result"  @focus="display_search=true" @blur="display_search=false" type="text" ref="search" placeholder="Search" v-on:keyup.enter="search_enter()">
          <router-link :to="search_value"><button> <i class="fas fa-search"></i> </button></router-link>
        </div>
        <div v-if="token"><img v-on:click="toggle_profile()" v-bind:src="c_user_image" id="profile-pic" ref="profile" height="35" width="35"></div>
        <div v-else><img v-on:click="toggle_profile()" v-bind:src="c_user_default_image" id="profile-pic" ref="profile" height="35" width="35"></div>
      </div>
    </header>
    <div v-if="token" v-closeProfileNav="{exclude: 'profile', handler: 'close_profile'}" class="flex">
      <div v-if="profile_nav" id="profile-popup">
        <div id="profile-header-popup" class="flex">
            <div><img v-bind:src="c_user_image" height="50" width="50"></div>
            <div id="profile-user"> 
              <div>{{ user.username }}</div> 
              <div>{{ user.email }}</div> 
            </div>
        </div>
        <div id="profile-body-popup">
          <div v-on:click="toggle_profile()"><router-link to="/account" class="flex"> <i class="fas fa-id-badge"></i> <span>Account</span> </router-link></div>
          <div v-on:click="toggle_profile()"><router-link to="/create_forum" class="flex"> <i class="fab fa-wpforms"></i> <span>Create Forum</span> </router-link></div>
          <div v-on:click="toggle_profile()"><router-link to="/change_password" class="flex"> <i class="fas fa-lock"></i> <span>Change Password</span> </router-link></div>
          <div v-on:click="toggle_profile(); log_out();"><a class="flex"> <i class="fas fa-sign-out-alt"></i> <span>Logout</span> </a></div>
        </div>
      </div>
    </div>
    <div v-else v-closeProfileNav="{exclude: 'profile', handler: 'close_profile'}" class="flex">
      <div v-if="profile_nav" id="profile-popup">
        <div id="profile-header-popup" class="flex">
            <div><img v-bind:src="c_user_default_image" height="50" width="50"></div>
            <div id="profile-guest"> Guest </div>
        </div>
        <div id="profile-body-popup">
            <div v-on:click="toggle_profile(); login_form()"><a class="flex"> <i class="fas fa-sign-in-alt"></i> <span>Login</span> </a></div>
            <div v-on:click="toggle_profile(); register_form()"><a class="flex"> <i class="fas fa-address-book"></i>  <span>Sign up</span> </a></div>
        </div>
      </div>
    </div>
    <div v-if="loading && display_search" id="autocomplete">
      <div v-for="forum in forums_query" v-bind:key="forum.id">
        <autocomplete v-bind:forum="forum"> </autocomplete>
      </div>
    </div>
    <aside v-if="token">
      <div id="side-nav">
        <div id="follower_count"> FOLLOWED FORUMS ({{ num_of_followers }}) </div>
        <div id="follower_list">
          <div v-for="follow in followers" v-bind:key="follow.id" class="follower">
            <followersingle v-bind:token="token" v-bind:user="user" v-bind:follow="follow"> </followersingle>
          </div>
        </div>
      </div>
    </aside>
    <component v-if="!token && auth_form" v-bind:is="auth_form"></component>
  </div>
</template>

<script>
import {bus} from '../main.js';
import axios from 'axios';
import Login from './Login.vue';
import Register from './Register.vue';
import Follower_Single from './Follower_Single.vue';
import imageMixin from '../mixins/imageMixin';
import AutoComplete from './AutoComplete.vue';

export default {
  components: {
    login: Login,
    register: Register,
    followersingle: Follower_Single,
    autocomplete: AutoComplete
  },
  data() {
    return { 
      token: null,
      user: {},
      followers: {},
      num_of_followers: 0,
      profile_nav: false,
      auth_form: null,
      search_result: '',
      loading: false,
      display_search: false,
      forums_query: {}
    };
  },
  methods: {
    log_out() {
      this.deleteAllCookies();
      this.token = null;
      this.user = {};
      this.num_of_followers = 0;
      this.followers = {};
      this.profile_nav = false;
      bus.$emit('erase_token', null);
      bus.$emit('erase_user', {});
      bus.$emit('show_hide_notify', 'Logged out');
      this.$router.push('/').catch(() => {});
    },
    deleteAllCookies() {
      let cookies = document.cookie.split(";");
      let currTime = new Date();
      currTime.setMonth(currTime.getMonth() - 1);
      for(let i = 0; i < cookies.length; i++) {
        let name = cookies[i].split("=")[0];
        document.cookie = `${name}=; expires=${currTime.toUTCString()}`;
      }
    },
    toggle_profile() {  /* popup to show navigation links when user profile image is clicked */
      this.profile_nav = !this.profile_nav;
    },
    close_profile() {
      this.profile_nav = false;
    },
    login_form() {
      document.body.style = "overflow: hidden";
      this.auth_form = 'login';
    },
    register_form() {
      document.body.style = "overflow: hidden";
      this.auth_form = 'register';
    },
    search_enter() {
      this.$router.push(`/search?q=${this.search_result}`);
    },
    auto_complete() {
      this.loading = false;
      if(this.search_result.trim().length == 0) {
        return;
      }
      axios.get(`${this.domain_name_api}autocomplete?query=${this.search_result}`).then(response => {
        this.forums_query = response.data.forums;
        if(this.forums_query.length > 0) {
          this.loading = true;
        }
			});
    }
  },
  computed: {
    search_value() {
      this.auto_complete();
      return `/search?q=${this.search_result}`;
    },
    c_user_image: function() {
      return this.user_image(this.user.display_picture);
    },
    c_user_default_image: function() {
      return this.user_image('default.png');
    }
  },
  created() {
    bus.$on('init_token', (token) => {
      this.token = token;
    });
    bus.$on('init_user', (user) => {
      this.user = user;
    });
    bus.$on('init_followers', (followers) => {
      this.followers = followers.user_followers;
      this.num_of_followers = followers.num_of_followers;
    });
    bus.$on('set_token', (token) => {
      this.token = token;
    });
    bus.$on('set_user', (user) => {
      this.user = user;
    });
    bus.$on('set_followers', (followers) => {
      this.followers = followers.user_followers;
      this.num_of_followers = followers.num_of_followers;
    });
    //listen for event to close popup for authentication (login or register)
    bus.$on('close_popup', () => {
      this.auth_form = null;
    });
    //listen for event to switch popup for authentication (login or register)
    bus.$on('switch_auth_popup', (switch_to) => {
      this.auth_form = switch_to;
    });
    bus.$on('follow_forum', (forum) => {
      this.followers.push(forum);
      this.num_of_followers += 1;
    });
    bus.$on('unfollow_forum', (forum) => {
      for(let i=0; i<this.followers.length; i++) {
        if(this.followers[i].id == forum.id) {
          this.followers.splice(i, 1);
          this.num_of_followers -= 1;
        }
      }
    });
    bus.$on('closeSearchBox', () => {
      this.$refs['search'].blur(); // unselect input when link is clicked
      this.display_search = false; // hide search results box
    });
  },
  mixins: [imageMixin]
};
</script>

<style scoped>
/* top navigation bar */
header {
  width: 100%;
  position: fixed;
  z-index: 20;
  background-color:rgb(19, 50, 173);
}

#top-nav {
  margin: 0 40px 0 30px;
}

#logo {
  font-weight: 800;
  cursor: pointer;
}

#logo i {
  font-size: 1.5rem;
  display: inline-block;
  position: relative;
  transform: translateY(-50%);
  top: 50%;
  color: rgb(245, 224, 66);
}

#logo span {
  font-size: 1.3rem;
  display: inline-block;
  position: relative;
  transform: translateY(-50%);
  top: 50%;
  color: #fff;
}

#search {
  width: 45%;
  margin: 10px 0;
}

#search input {
  float: left;
  border-radius: 4px 0px 0px 4px;
  position: relative;
  transform: translateY(-50%);
  top: 50%;
  width: 80%;
  height: 30px;
  padding: 0 15px;
  font-size: 1rem;
  border: none;
}

#search button {
  border-radius: 0px 4px 4px 0px;
  border: none;
  position: relative;
  transform: translateY(-50%);
  top: 50%;
  width: 60px;
  height: 30px;
  cursor: pointer;
}

#profile-pic {
  cursor: pointer;
  border-radius: 50%;
  position: relative;
  transform: translateY(-50%);
  top: 50%;
}

#profile-popup {
  border: 1px solid #f8f9fa;
  box-shadow: 2px 4px 10px #888888;
  border-radius: 1px;
  position: fixed;
  color: black;
  background: #fff;
  z-index: 30;
  top: 37px;
  right: 0;
  margin: 0.5rem;
}

#profile-header-popup {
  padding: 1rem 3.5rem 1rem 1rem;
  border-bottom: 1px solid rgb(224, 218, 218);
}

#profile-header-popup div img {
  border-radius: 50%;
}

#profile-user {
  line-height: 25px;
  margin-left: 1rem;
}

#profile-user div:nth-of-type(1) {
  font-size: 1.2rem;
}

#profile-user div:nth-of-type(2) {
  font-size: 0.9rem;
}

#profile-guest {
  line-height: 50px;
  margin-left: 1rem;
  font-size: 1.2rem;
}

#profile-body-popup {
  margin-top: 0.5rem;
}

#profile-body-popup a {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  text-decoration: none;
  color: black;
  cursor: pointer;
}

#profile-body-popup a:hover {
  background: #f8f9fa;
}

#profile-body-popup i {
  margin-right: 0.5rem;
  font-size: 1.3rem;
  width: 25px;
}

/* side navigation - followers */
aside {
  width: 13%;
  height: 100%;
  background: #fff;
  position: fixed;
  z-index: 10;
  padding-bottom: 5rem;
  overflow: hidden;
}

aside:hover {
  overflow-y: scroll; 
}

aside::-webkit-scrollbar {
  width: 5px;
}

aside::-webkit-scrollbar-track {
  background: white;
}

aside::-webkit-scrollbar-thumb {
  background: rgb(153, 153, 153);
  border-radius: 10rem;
}

#side-nav {
  position: relative;
  top: 50px;
}

#follower_count {
  font-weight: 700;
  font-size: 0.8rem;
  margin: 1rem;
}

/* Auto complete search */
#autocomplete {
  top: 47px;
  position: fixed;
  width: 38%;
  right: 50%;
  transform: translateX(50%);
  background: #fff;
  border: 1px solid #f8f9fa;
  box-shadow: 2px 4px 10px #888888;
  border-radius: 1px;
  z-index: 100;
}

/* MEDIA QUERIES */
/* width <= 992px */
@media (max-width: 992px) {
  /* top nav */
  #top-nav {
  margin: 0 30px 0 20px;
  }

  #search button {
    width: 40px;
  }
  
  #search input {
    font-size: 0.8rem;
  } 

  #logo i {
    font-size: 1.2rem;
  }

  #logo span {
    font-size: 1rem;
  }

  #profile-pic {
    height: 30px;
    width: 30px;
  }

  /* side nav */
  #follower_count {
    font-weight: 600;
    font-size: 0.7rem;
    margin: 0.9rem;
  }

  /* profile popup */
  #profile-header-popup {
    padding: 0.8rem 3.3rem 0.8rem 0.8rem;
  }

  #profile-header-popup div img {
    width: 40px;
    height: 40px;
  }

  #profile-user {
    line-height: 20px;
    margin-left: 0.8rem;
  }

  #profile-user div:nth-of-type(1) {
    font-size: 1rem;
  }

  #profile-user div:nth-of-type(2) {
    font-size: 0.8rem;
  }

  #profile-guest {
    line-height: 40px;
    margin-left: 0.8rem;
    font-size: 1rem;
  }

  #profile-body-popup {
    margin-top: 0.3rem;
  }

  #profile-body-popup a {
    padding: 0.4rem 0.9rem;
    font-size: 0.8rem;
  }

  #profile-body-popup i {
    margin-right: 0.4rem;
    font-size: 1.2rem;
    width: 20px;
  }
  
  /* autocomplete popup */
  #autocomplete {
    transform: translateX(55%);
  }
}

@media (max-width: 768px) {
  /* top nav */
  #top-nav {
  margin: 0 20px 0 10px;
  }

  /* side nav */
  #follower_count {
    display: none;
  }

  aside {
    margin-top: 1rem;
    width: 45px;
  }

  /* profile nav */
  #profile-popup {
    margin: 0.2rem;
    top: 42px;
  }

  /* autocomplete popup */
  #autocomplete {
    transform: translateX(60%);
  }
}
</style>