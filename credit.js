function getDetails(){
	var fname=document.getElementById("account").value;
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
    xmlhttp.send();
}