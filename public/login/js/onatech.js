$("#registrationForm").submit(function (e) {
    e.preventDefault();


    var name = $(this.name).val();
    var email = $(this.email).val();
    var pass = $(this.pass).val();
    var repeat_pass = $(this.repeat_pass).val();


    let data = {
        "name": name,
        "password": pass,
        "email": email

    }


    if (pass === repeat_pass) {
        let data = {
            "name": name,
            "password": pass,
            "email": email

        }

    } else {

        var alert = ""
        var alertTitle = "Wrong Password"
        var alertMessage = "Incorrect password match"
        swal(alertTitle, alertMessage, "error");
        return false
    }


    $.ajax({
        type: "POST",
        url: "users",
        dataType: "JSON",
        data: data,

        success: function (data) {

            if (data.status === false) {
                $('#alert').html('<div class="alert alert-warning alert-dismissible fade show" role="alert"><strong>Error</strong> Email already exiting <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button> </div>')
            } else {
                $(window).attr("location", "/");

            }


        }
    });
})


$('#loginForm').submit(function (e) {


    e.preventDefault();
    var email = $(this.email).val();
    var pass = $(this.pass).val();
    let login
    login = {
        "password": pass,
        "email": email

    }
    $.ajax({
        type: "POST",
        url: "/login",
        dataType: "JSON",
        data: login,

        success: function (res) {
           if(res === true){
               $(window).attr("location", "/");


           }
           $('#alert_login').html('<div class="alert alert-warning alert-dismissible fade show" role="alert"><strong>Error </strong>Incorrect email or password<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button> </div>')
      

        }
    });

})