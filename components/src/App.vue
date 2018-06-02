<template>
  <div id="app" class="container-fluid">
    <div class="row" style="padding:0;border:0;">
    <router-view :endpoint="endpoint" />
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      dev: true,
      debug: true, // Displays in web console useful information for debugging purposes. IMPORTANT! Set false in production environments.
      endpoint: 'https://ptin2018.herokuapp.com/api/',
      // endpoint: 'http://localhost:3000/api/',
      trans: [],
      excludeValidation: ['/admin/login.html']
    }
  },
  methods: {
    /**
     * @author ncarmona
     * @description Getting translation strings.
     * @version S3
     */
    getLanguage: function () {
      let transFile = '/lang/' + localStorage.language + '/public.json'
      let self = this

      if (localStorage.language === null) {
        localStorage.language = 'cat'
      } else {
        axios
          .get(transFile)
          .then(function (transString) {
            self.trans = transString.data
            console.log('language file: ' + transFile)
            console.log('Website language: ' + localStorage.language)
          })
          .catch(function (error) {
            console.log(error.message)
          })
      }
    }
  },
  beforeMounted () {
    let validationNeeded = this.excludeValidation.find(url => url === window.location.pathname)
    console.log(validationNeeded)
    if (validationNeeded === undefined && !localStorage.getItem('token') === null) window.location.replace('/admin/login.html')
  }
}
</script>
