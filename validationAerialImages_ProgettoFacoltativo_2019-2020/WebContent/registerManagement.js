/**
 * Login management
 */

(function() { // avoid variables ending up in the global scope

  document.getElementById("submitbutton").addEventListener('click', (e) => {

    let pwd = document.getElementsByName("pwd")[0].value;
    let confrimPwd = document.getElementsByName("confirmpwd")[0].value;
    if (pwd !== confrimPwd){
      document.getElementById("errormessage").textContent =
          "Notice from client side: Password and confirm password must be the same.";
      return;
    }
    let email = document.getElementsByName("email")[0].value;
    // let re = new RegExp("^(\\S+)\\@(\\S+).(\\S+)$");
    let re = new RegExp("^(\\S+)\\@(\\S+).(\\S+)$");
    if(!re.test(email)){
      document.getElementById("errormessage").textContent =
          "The syntactic of the email address is not valid.";
      return;
    }

    var form = e.target.closest("form");
    if (form.checkValidity()) {
      makeCall("POST", 'Register', e.target.closest("form"),
        function(req) {
          if (req.readyState === XMLHttpRequest.DONE) {
            var message = req.responseText;
            switch (req.status) {
              case 200:
                window.location.href = "loginPage.html";
                break;
              case 406: // data non acceptable
                document.getElementById("errormessage").textContent = message;
                break;
              case 500: // server error
            	document.getElementById("errormessage").textContent = message;
                break;
            }
          }
        }
      );
    } else {
    	 form.reportValidity();
    }
  });

})();
