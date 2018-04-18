window.addEventListener('load', function () {
    new Vue({
        el: '#vue',

        data: {
            base_url_api: 'https://ptin2018.herokuapp.com/api/',
            debugging: true,
            userInputValue: '',
            passwordInputValue: '',
            token: localStorage.token,
            username: ''
        },
        mounted: function () {

            if(localStorage.username == null)
                this.username = "Invitado"
            else
                this.username = localStorage.username
                
            if(document.getElementById("user")){
                this.userInputValue = document.getElementById("user").value
                this.passwordInputValue = document.getElementById("password").value
            }
            if(this.debugging) console.log("Usuario:" + this.username +"\nToken:" + this.token)
        },
        methods: {
            /**
             * @author ncarmona
             * @description Calls validation method from server side.
             * @version S2
             */            
            validating: function(){
                this.waitingValidationButton()
                self = this
                axios.post(this.base_url_api + 'auth/signin', {
                    username: self.userInputValue,
                    password: self.passwordInputValue
                  })
                  .then(function (response) {
                    if(response.data.token != 'undefined'){                        
                        localStorage.username = response.data.data.username
                        localStorage.token = response.data.token
                        window.location.replace("/admin/dashboard.html")
                    }

                    else
                        self.displayError("Error inesperado al validar el usuario.")
                  })
                  .catch(function (error) {
                      if(error.response.status == "400")
                        self.displayError("Usuario o clave incorrectos.")
                  });

                  // Restore form
                  self.userInputValue = ""
                  self.passwordInputValue = ""
                  document.getElementById("user").focus()
                  self.disableValidation()
                  self.restoreValidationButton()
            },

            /**
             * @author ncarmona
             * @description Remove token and username from localstorage
             * @version S2.
             */               
            logout: function(){
                if(this.debugging) console.log("Cerrando sesión")
                if(localStorage.token) {
                    this.username = null
                    this.token = null
                    localStorage.token = null
                    localStorage.username = null
                    
                    window.location.replace("../index.html")
                }
            },

            /**
             * @author ncarmona
             * @description Changes button from "validation" to "validate ..."
             * @version S2.
             */            
            waitingValidationButton: function(){
                document.getElementById("validation-button").innerHTML='<i class="fas fa-spinner fa-spin"></i> Validando ...'
            },

            /**
             * @author ncarmona
             * @description Changes buttom from "validating ..." to "validate".
             * @version S2.
             */
            restoreValidationButton: function(){
                document.getElementById("validation-button").innerHTML='<i class="fas fa-unlock-alt"></i> Validar'
            },

            /**
             * @author ncarmona
             * @description Make error div visible.
             * @version S2 - add transition.
             */
            displayError: function(msg){
                let form_error = document.getElementById("form-error")
                form_error.style.display="block"
                form_error.innerHTML=msg
            },

            /**
             * @author ncarmona
             * @description HIde error div.
             * @version S2 - add transition.
             */
            hideError: function(){
                document.getElementById("form-error").style.display="none"
            },

            /**
             * @author ncarmona
             * @description Enable validation button.
             * @version S2
             */
            enableValidation: function(){
                document.getElementById("validation-button").disabled = false
            },

            /**
             * @author ncarmona
             * @description Enable validation button.
             * @version S2
             */
            disableValidation: function(){
                document.getElementById("validation-button").disabled = true
            },

            /**
             * @author ncarmona
             * @description Checks if user and password fields are empty or not and then enable or disable validation button.
             * @version S2
             */            
            formValidation: function(){
                if(this.debugging){
                    console.log("Usuario:" + this.userInputValue + "("+ this.userInputValue.length +")")
                    console.log("Clave:" + this.passwordInputValue + "("+ this.passwordInputValue.length +")")
                }

                this.enableValidation()

                if(this.userInputValue.length > 0 && this.passwordInputValue.length > 0 ){
                    console.log("valid")
                    this.enableValidation()
                }else{
                    console.log("invalid")
                    this.disableValidation()
                }
            }
        }
    }) 
})