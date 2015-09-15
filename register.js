var validate=function() {
	var fname=document.getElementById("fname").value;
	if(!(fname.match(/[a-z]/i))){
		document.getElementById('spanfname').innerHTML="*Insert proper name*";
		return false;
	}
}
