export default {
  methods: {
    time_ago(date) {
      let date_object = new Date(date);
      let diff_time = (new Date().getTime() - date_object.getTime()) / 1000;
      if(diff_time < 60) {
        return `${Math.floor(diff_time)} seconds ago`;
      }
      diff_time /= 60;
      if(diff_time < 60) {
        return `${Math.floor(diff_time)} minutes ago`;
      }
      diff_time /= 60;
      if(diff_time < 24) {
        return `${Math.floor(diff_time)} hours ago`;
      }
      diff_time /= 24;
      if(diff_time < 7) {
        return `${Math.floor(diff_time)} days ago`;
      }
      if(diff_time < 30) {
        return `${Math.floor(diff_time / 7)} weeks ago`;
      }
      diff_time /= 30
      if(diff_time < 365) {
        return `${Math.floor(diff_time)} months ago`;
      }
      return `${Math.floor(diff_time / 12)} years ago`;
    },
    normal_date_format(date) {
      let date_object = new Date(date);
      return `${date_object.getDate()}-${date_object.getMonth() + 1}-${date_object.getFullYear()}`;
    }
  }
  /* FILTER VERSION OF DATE_TIME
  filters: {
    'time-ago': function(value) {
      console.log('date changed');
      let date_object = new Date(value);
      let diff_time = (new Date().getTime() - date_object.getTime()) / 1000;
      if(diff_time < 60) {
        return `${Math.floor(diff_time)} seconds ago`;
      }
      diff_time /= 60;
      if(diff_time < 60) {
        return `${Math.floor(diff_time)} minutes ago`;
      }
      diff_time /= 60;
      if(diff_time < 24) {
        return `${Math.floor(diff_time)} hours ago`;
      }
      diff_time /= 24;
      if(diff_time < 7) {
        return `${Math.floor(diff_time)} days ago`;
      }
      if(diff_time < 30) {
        return `${Math.floor(diff_time / 7)} weeks ago`;
      }
      diff_time /= 30
      if(diff_time < 365) {
        return `${Math.floor(diff_time)} months ago`;
      }
      return `${Math.floor(diff_time / 12)} years ago`;
    },
    'normal-date-format': function(value) {
      let date_object = new Date(value);
      return `${date_object.getDate()}-${date_object.getMonth() + 1}-${date_object.getFullYear()}`;
    }
  }
  */
};