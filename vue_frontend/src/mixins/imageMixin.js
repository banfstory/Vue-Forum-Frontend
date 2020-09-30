export default {
  methods: {
    user_image(image_name) {
      return `${this.domain_name_api}user/image/${image_name}`;
    },
    forum_image(image_name) {
      return `${this.domain_name_api}forum/image/${image_name}`;
    }
  }
};