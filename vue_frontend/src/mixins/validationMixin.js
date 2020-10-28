export default {
  methods: {
    validEmail(email) {
      // Email structure : (name) @ (domain) . (extension)(.second_extension)
      // Email example : (user) @ (gmail) . (com) (.au)
			let regex = /^([\w-.]+)@([a-zA-Z-]+).([a-zA-Z]{2,10})(\.[a-zA-Z]{2,10})$/;
      return regex.test(email);
		},
		validPassword(password) {
			// Password rules: contain atleast one uppercase, lowercase, special character and number
			// '?=.*' this 'look ahead' ensures that atleast one of those characters are contained for each of the specified rules
			let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d])(?=.*[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])[a-zA-Z\d!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]{8,}$/;
      return regex.test(password);
    },
    validUserSpace(username) {
      let regex = /^\w+$/;
      return regex.test(username);
    }
  }
};