function getDetails(){
	var accountNumber=document.getElementById("account");
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == XMLHttpRequest.DONE) {
           if(xmlhttp.status == 200){
        	   document.getElementById("details").setAttribute(hidden, false);
               document.getElementById("myDiv").innerHTML = xmlhttp.responseText;
           }
           else if(xmlhttp.status == 400) {
              alert('There was an error 400')
           }
           else {
               alert('something else other than 200 was returned')
           }
        }
    }
	xmlhttp.open("POST", "localhost:3000/credit", true);
	xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send(JSON.stringify({"accountNumber":accountNumber.value}));
}
	/*$.ajax({
	    url: 'localhost:3000/credit' + '?' + $.param({accountNumber: "1000000001"}),
	    dataType: "jsonp",
	    jsonpCallback: "_stdout",
	    cache: false,
	    timeout: 5000,
	    success: function(data) {
	       alert("success");
	    },
	    error: function(jqXHR, textStatus, errorThrown) {
	    	alert("error");
	        handleError(data);
	    }
	});*/

//document.getElementById("account").onblur= getDetails();
