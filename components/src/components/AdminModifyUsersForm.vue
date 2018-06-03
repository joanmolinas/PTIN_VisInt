<template>
    <div id="modify-user" class="col-md-10">
        <h2 id="usernameTitle"></h2>
        <form id="UsersModifyForm">
            <div class="row">
                <div class="col-md-6">
                    <div class="form-group">
                        <label>Nombre de usuario</label>
                        <input type="text" class="form-control" id="username" placeholder="Inserta el nombre de usuario" v-model="username">
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-group">
                        <label>Repetir ombre de usuario</label>
                        <input type="text" class="form-control" id="username1" placeholder="Repite el nombre de usuario" v-model="username1" v-on:keyup="validateUser">
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6">
                    <div class="form-group">
                        <label>Clave del usuario</label>
                        <input type="password" class="form-control" id="password" v-model="password" placeholder="Inserta la clave de usuario">
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-group">
                        <label>Repetir clave del usuario</label>
                        <input type="password" class="form-control" id="password1" v-model="password1" placeholder="Repite la clave de usuario" v-on:keyup="validatePassword">
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6">
                    <div class="form-group">
                        <label for="exampleSelect1">Idioma</label>
                        <select class="form-control" v-model="language">
                            <option value="1" id="lang-1">Català</option>
                            <option value="2" id="lang-2">Español</option>
                            <option value="3" id="lang-3">English</option>
                        </select>
                    </div>
                </div>
                <div class="col-md-6">
                    <button type="button" class="btn btn-secondary visint-button" id="submitModifyUser" v-on:click="modifyUserData"><i class="fas fa-edit"></i> Modificar usuario</button>
                    <input type="hidden" id="id"  v-bind:value="$route.params.id"/>
                </div>
            </div>
            <div class="row">
                <div id="error">
                    <i class="fas fa-exclamation-triangle" id="error-icon"></i> <span class="msg"></span><a href="#cerrar" id="close-notification" class="pull-right" v-on:click="closeNotification"><i class="fas fa-times"></i></a>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'AdminModifyUsersForm',
  props: ['endpoint'],
  data () {
    return {
      username: '',
      username1: '',
      password: '',
      password1: '',
      language: ''
    }
  },
  mounted () {
    let userID = document.getElementById('id').value
    axios.get(this.endpoint + 'users/' + userID).then((user) => {
      this.username = user.data.username
      this.username1 = user.data.username
      this.password = user.data.password
      this.password1 = user.data.password
      this.language = user.data.preferences.language
    }).catch((e) => {
      console.log('Error de conexión con el servidor.')
    })
  },
  methods: {
    /**
     * @author ncarmona
     * @description Allows to close notification message.
     * @version S4
     */
    closeNotification: function () {
      document.getElementById('error').style.display = 'none'
    },
    /**
     * @author ncarmona
     * @description Display a notification message.
     * @param String msg Display msg as notification message.
     * @version S4
     */
    displayNotification: function (msg) {
      document.getElementById('error').innerHTML = '<i class="fas fa-exclamation-triangle" id="error-icon"></i> <span class="msg">' + msg + '</span><a href="#cerrar" id="close-notification" class="pull-right" v-on:click="closeNotification"><i class="fas fa-times"></i></a>'
      document.getElementById('error').style.display = 'block'
    },
    /**
     * @author ncarmona
     * @description Validate user textfields (both user fields must contain the sale value and can not be empty)
     * @version S4
     */
    validateUser: function () {
      let username = document.getElementById('username').value
      let username1 = document.getElementById('username1').value
      if (username !== username1 || username.length === 0) {
        this.displayNotification('Los campos de usuario deben coincidir y no pueden estar vacíos.')
      } else {
        this.closeNotification()
      }
    },
    /**
     * @author ncarmona
     * @description Validate password textfields (both password fields must contain the sale value and can not be empty)
     * @version S4
     */
    validatePassword: function () {
      let password = document.getElementById('password').value
      let password1 = document.getElementById('password1').value
      if (password !== password1 || password.length === 0) {
        this.displayNotification('Los campos de clave deben coincidir y no pueden estar vacíos.')
      } else {
        this.closeNotification()
      }
    },
    modifyUserData: function () {
      console.log('token' + localStorage.token)
      let getID = document.getElementById('id').value
      axios.put(this.endpoint + 'users/' + getID, {
        username: this.username,
        password: this.password,
        language: this.language
      }, {
        headers: {Authorization: 'bearer ' + localStorage.token}
      }).then(() => {
        console.log('Updating user with ID:' + getID + ' username: ' + this.username + ' password: ' + this.password)
      }).catch((e) => {
        console.log(e)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.visint-button {
    background-color: #0D47A1;
    color: white;
    margin-top: 25px;
    font-weight: bolder;
}
#error {
    display: none;
    border-radius: 5px;
    background-color: #ff6666;
    border: 1px solid #FF3232;
    color: white;
    padding: 20px;
    margin: 15px;
    font-weight: bolder;
    #error-icon {
        color: whitesmoke;
        font-weight: bolder;
        font-size: 30px;
        margin-right: 10px;
    }
    #close-notification {
        color: white;
        text-decoration: none;
        margin-top: -10px;
        font-size: 12px;
    }
}
</style>
