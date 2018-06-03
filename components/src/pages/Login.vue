<template>
  <div class="login">
    <div class="col-md-offset-4 col-md-4" id="login">
      <div id="header-login">
        Panel de administrador
      </div>
      <div id="content-login">
      <form action="#">
        <div class="form-group">
          <label><i class="fas fa-user"></i> Usuario</label>
          <input type="text" class="form-control" id="username" placeholder="Nombre de usuario ..." v-on:keyup="formValidation" v-model="username">
        </div>
        <div class="form-group">
          <label><i class="fas fa-key"></i> Clave</label>
          <input type="password" class="form-control" id="password" placeholder="Clave de usuario ..." v-on:keyup="formValidation" v-model="password">
        </div>
        <button class="btn btn-primary" id="validation-button" v-on:click="validating" disabled="disabled">
          <i class="fas fa-unlock-alt"></i> Validar
        </button>
          <span id="form-error">
            <strong><i class="fas fa-exclamation-triangle"></i></strong>
            La clave es incorrecta.
          </span>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'AdminDevices',
  props: ['endpoint'],
  data () {
    return {
      username: '',
      password: ''
    }
  },
  mounted () {
    if (localStorage.getItem('token') !== null) window.location.href = '/admin/devices.html'
  },
  methods: {
    /**
     * @author ncarmona
     * @description Calls validation method from server side.
     * @version S2
    */
    validating: function () {
      console.log('prueba')
      this.waitingValidationButton()
      // eslint-disable-next-line
      self = this
      axios.post(this.endpoint + 'auth/signin', {
        username: this.username,
        password: this.password
      }).then(function (response) {
        if (response.data.token !== 'undefined') {
          localStorage.username = response.data.data.username
          localStorage.token = response.data.data.token
          localStorage.language = self.int2lang(response.data.data.language)
          localStorage.userID = response.data.data._id
          window.location.replace('/admin/#/devices')
        } else {
          self.displayError('Error inesperado al validar el usuario.')
        }
      }).catch((error) => {
        console.log(error)
      })

      // Restore form
      document.getElementById('username').value = ''
      document.getElementById('password').value = ''
      document.getElementById('username').focus()
      self.disableValidation()
      self.restoreValidationButton()
    },

    /**
     * @author ncarmona
     * @description parse int to name lang.
     * @version S3
     */
    int2lang: function (intnum) {
      let lang = 'cat'

      if (intnum === 2) lang = 'es'
      else if (intnum === 3) lang = 'en'

      return lang
    },
    /**
     * @author ncarmona
     * @description parse lang to int number.
     * @version S3
     */
    lang2int: function (lang) {
      let intnum = 'cat'

      if (lang === 'es') intnum = 2
      else if (lang === 'en') intnum = 3

      return intnum
    },
    /**
     * @author ncarmona
     * @description Remove token and username from localstorage
     * @version S2.
     */
    logout: function () {
      if (this.debugging) console.log('Cerrando sesión')
      if (localStorage.token) {
        this.username = null
        this.token = null
        localStorage.token = null
        localStorage.username = null
        localStorage.language = null

        window.location.replace('../index.html')
      }
    },

    /**
     * @author ncarmona
     * @description Changes button from "validation" to "validate ..."
     * @version S2.
     */
    waitingValidationButton: function () {
      document.getElementById('validation-button').innerHTML = '<i class="fas fa-spinner fa-spin"></i> Validando ...'
    },

    /**
     * @author ncarmona
     * @description Changes buttom from "validating ..." to "validate".
     * @version S2.
     */
    restoreValidationButton: function () {
      document.getElementById('validation-button').innerHTML = '<i class="fas fa-unlock-alt"></i> Validar'
    },

    /**
     * @author ncarmona
     * @description Make error div visible.
     * @version S2 - add transition.
     */
    displayError: function (msg) {
      let formError = document.getElementById('form-error')
      formError.style.display = 'block'
      formError.innerHTML = msg
    },

    /**
     * @author ncarmona
     * @description HIde error div.
     * @version S2 - add transition.
     */
    hideError: function () {
      document.getElementById('form-error').style.display = 'none'
    },

    /**
     * @author ncarmona
     * @description Enable validation button.
     * @version S2
     */
    enableValidation: function () {
      document.getElementById('validation-button').disabled = false
    },

    /**
     * @author ncarmona
     * @description Enable validation button.
     * @version S2
     */
    disableValidation: function () {
      document.getElementById('validation-button').disabled = true
    },

    /**
     * @author ncarmona
     * @description Checks if user and password fields are empty or not and then enable or disable validation button.
     * @version S2
     */
    formValidation: function () {
      this.enableValidation()

      if (document.getElementById('username').value.length > 0 && document.getElementById('password').value.length > 0) {
        this.enableValidation()
      } else {
        this.disableValidation()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#login {

  margin-top: 100px;

  #header-login{
    background-color: #7A7979;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    padding:15px 10px 15px 10px;
    text-align: center;
    color: white;
    font-size: large;
  }

  #content-login {
    background-color:#FAFAFA;
    padding: 20px;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    border: 1px solid #ccc;
    color: #7A7979;

    #form-error {
      font-style: italic;
      font-size: small;
      font-weight: initial;
      padding-left: 15px;
      color:#a94442;
      display: none;
    }
  }
}
</style>
