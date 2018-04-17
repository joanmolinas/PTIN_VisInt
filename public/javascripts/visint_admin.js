window.addEventListener('load', function () {
    new Vue({
        el: '#login',

        data: {
            debugging: true,
            userInputValue: document.getElementById("user").value,
            passwordInputValue: document.getElementById("password").value
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
                axios.post('/api/auth/signin', {
                    email: self.userInputValue,
                    password: self.passwordInputValue
                  })
                  .then(function (response) {
                    if(response.data.status == 404)
                        self.displayError("El usuario o la clave son incorrectas.")
                    else if(response.data.status == 200)
                        window.location.replace("/admin/dashboard.html")
                    else
                        self.displayError("Error inesperado al validar el usuario.")
                  })
                  .catch(function (error) {
                    self.displayError("El usuario o clave son incorrectos.")
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