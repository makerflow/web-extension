var auth_token = null;

chrome.storage.local.get(["auth_token"], function(result) {
  if (typeof result.auth_token != "undefined" && result.auth_token != "") {
    auth_token = result.auth_token;
  }
})


 $(function () {
  chrome.storage.local.get(["auth_token","default_domains"], function(result) {
    if (typeof result.auth_token != "undefined" && result.auth_token != "") {
      auth_token = result.auth_token;
      $('#token').val(auth_token)
    }else{
      $('#token').val('')
    }

    if (typeof result.default_domains != "undefined" && result.default_domains.length > 0) {
        appendDomains(result.default_domains);
    }

    $(document).on('click', '.remove-domain', function() {
      var deleteDomainUrl = $(this).closest('li.list-group-item').attr('data-domain-name');
       chrome.storage.local.get(["default_domains"], function(result) {
        if (typeof result.default_domains != "undefined" && result.default_domains.length > 0) {
            var alreadyUrl = result.default_domains.findIndex((x)=>{return x == deleteDomainUrl})
            if (alreadyUrl > -1) {
                result.default_domains.splice(alreadyUrl,1);
                chrome.storage.local.set({default_domains:result.default_domains});
                toastr["success"]("Deleted successfully.");
                appendDomains(result.default_domains);
            }
            return false;
        }

       })

    });
  })

     $("#settings").on('show.bs.collapse', function () {
         $("#settings-arrow").html("<i class='fa fa-arrow-down'></i>")
     })

     $("#settings").on('hide.bs.collapse', function () {
         $("#settings-arrow").html("<i class='fa fa-arrow-right'></i>")
     })

     $(".begin-flow").on("click", function (e) {
         e.preventDefault();
         if (auth_token) {
             $(".loading-flow-mode").show();
             $.post(apiBaseUrl + 'flow-mode/ongoing?api_token=' + auth_token, function() {
                 $(".loading-flow-mode").hide();
                 $(".begin-flow").hide();
             });
         }
     });

 });

var appendText = '';

$("#set_token").validate({
    rules: {
        token: {
            required: true,
        }
    },
    errorPlacement: function(error, element) {
            error.insertAfter(element);
        },
    submitHandler: function() {
      setToken()
      return false;
    }
});

function setToken() {
  auth_token = $.trim($('#token').val());

  $('.set-api-token').text('Verfying').attr('disabled',true)

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {

        if (this.readyState == 4 && this.status == 200 ) {

          if (this.responseURL.indexOf('/login') == -1) {
              chrome.storage.local.set({auth_token:auth_token});
            toastr["success"]("Token saved successfully.");
          } else {
             toastr["error"]("Invalid token.");
          }
          $('.set-api-token').text('Set').attr('disabled',false)
            return false;

        }
    };
    xhttp.open("GET", apiBaseUrl+'flow-mode/ongoing?api_token='+auth_token, true);
    xhttp.send();
}


$("#add_domain").validate({
    rules: {
        domain: {
            required: true
        }
    },
    errorPlacement: function(error, element) {
            error.insertAfter(element);
        },
    submitHandler: function() {
      addDomain()
      return false;
    }
});

function addDomain() {
  var newDomain = $.trim($('#domain').val());

  if(newDomain.indexOf('.') == -1){
      toastr["error"]("Invalid domain name");
      return false;
  }else if (newDomain.indexOf('http://') == -1) {
    newDomain = 'http://'+newDomain;
  }else if(newDomain.indexOf('https://') == -1){
     newDomain = 'https://'+newDomain;
  }

  newDomain = new URL(newDomain);
  newDomain = newDomain.host;

   chrome.storage.local.get(["default_domains"], function(result) {
    if (typeof result.default_domains != "undefined" && result.default_domains.length > 0) {
        var alreadyUrl = result.default_domains.findIndex((x)=>{return x == newDomain})
       // alert(alreadyUrl)
        if (alreadyUrl == -1) {
            result.default_domains.push(newDomain);
            chrome.storage.local.set({default_domains:result.default_domains});
            toastr["success"]("New domain added successfully.");
            appendDomains(result.default_domains)
            $('#domain').val('');
        }else{

           toastr["error"]("Domain already exists.");
           $('#domain').focus();
        }

        return false;
    }else{
        result.default_domains.push(newDomain);
        chrome.storage.local.set({default_domains:result.default_domains});
        toastr["success"]("New domain added successfully.");
        appendDomains(result.default_domains)
        $('#domain').val('');

    }

   })
  return false;
}

function appendDomains(allDOm) {
   $('.domain_list').html('')
   allDOm.forEach(function (oD) {
    var odH = ` <li data-domain-name="`+oD+`" class="list-group-item">
                <span class="float-left">`+oD+`</span>
                <button class="float-right btn btn-outline-danger remove-domain"><i class="fa fa-remove"></i></button>
            </li>`;

    $('.domain_list').append(odH)
  })
}
