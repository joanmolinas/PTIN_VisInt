window.addEventListener('load', function () {
    new Vue({
        el: '#login',

        data: {
            debugging: true,
            userInputValue: document.getElementById("user").value,
            passwordInputValue: document.getElementById("password").value
        },

        methods: {
            validating: function(){
                this.waitingValidationButton()
            },
            waitingValidationButton: function(){
                document.getElementById("validation-button").innerHTML='<i class="fas fa-spinner fa-spin"></i> Validando ...'
            },
            restoreValidationButton: function(){
                document.getElementById("validation-button").innerHTML='<i class="fas fa-unlock-alt"></i> Validar'
            },
            displayError: function(msg){
                let form_error = document.getElementById("form-error")
                form_error.style.display="block"
                form_error.innerHTML=msg
            },
            hideError: function(){
                document.getElementById("form-error").style.display="none"
            },
            enableValidation: function(){
                document.getElementById("validation-button").disabled = false
            },
            disableValidation: function(){
                document.getElementById("validation-button").disabled = true
            },
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