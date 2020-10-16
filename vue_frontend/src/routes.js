import Account from "./components/Account.vue";
import Home from "./components/Home.vue";
import Create_Forum from "./components/Create_Forum.vue";
import Search_Result from "./components/Search_Result.vue";
import Forum from "./components/Forum.vue";
import User_Posts from "./components/User_Posts.vue";
import Comments from "./components/Comments.vue";
import Post_Update from "./components/Post_Update.vue";
import Forum_Update from "./components/Forum_Update.vue";
import Change_Password from "./components/Change_Password.vue";
import Forum_Create_Post from "./components/Forum_Create_Post.vue";

export default [
  { path:'/', component:Home, meta: { title: `Home Page` } },
  { path:'/account', component:Account, meta: { title: `Account` } },
  { path:'/create_forum', component:Create_Forum, meta: { title: `Create Forum` } },
  { path:'/search', component:Search_Result, meta: { title: `Search Results` } },
  { path:'/forum/:name', component:Forum, meta: { title: `Forum` } },
  { path:'/user/:username/posts', component:User_Posts, meta: { title: `User Posts` } },
  { path:'/forum/:id/comments', component:Comments, meta: { title: `Comments` } },
  { path:'/forum/:id/update_post', component:Post_Update, meta: { title: `Update Post` } },
  { path:'/forum/:name/update_forum', component:Forum_Update, meta: { title: `Update Forum` } },
  { path:'/change_password', component:Change_Password, meta: { title: `Change Password` } },
  { path:'/forum/:name/create_post', component:Forum_Create_Post, meta: { title: `Create Post` } },
]

