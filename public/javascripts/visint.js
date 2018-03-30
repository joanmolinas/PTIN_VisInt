$( document ).ready(function() {

    /*Hide sidebar.*/
    $('a[role="hide-devices"]').click(function(){
        $("#sidebar").hide()
        $("#sidebar").removeClass('col-md-6')
        $("#content").removeClass('col-md-6')
        $("#content").removeClass('col-md-12')    
        $("#content").css('height', '100vh')    
    })

});