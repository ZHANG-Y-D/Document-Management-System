/**
 * Login management
 */

(function() { // avoid variables ending up in the global scope

  document.getElementById("submitbutton").addEventListener('click', (e) => {
    var form = e.target.closest("form");
    if (form.checkValidity()) {
      makeCall("POST", 'Register', e.target.closest("form"),
        function(req) {
          if (req.readyState == XMLHttpRequest.DONE) {
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