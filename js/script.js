
//Event Listeners
document.querySelector("#zip").addEventListener("change", displayCity);
document.querySelector("#state").addEventListener("change", displayCounties);
document.querySelector("#username").addEventListener("change", checkUsername);
document.querySelector("#pwdOne").addEventListener("click", suggestPassword);
document.querySelector("#signupForm").addEventListener("submit", function(event){
	validateForm(event);
});

//Functions
//Initial function to auto-populate the state options
async function populateStates(){
	let state = document.querySelector("#state");
	let url = `https://csumb.space/api/allStatesAPI.php`;
	let response = await fetch(url);
	let data = await response.json();
	
	state.innerHTML = `<option value=""> Select One </option>`
	for(let item of data){
		state.innerHTML += `<option value=${item.usps}>${item.state}</option>`;
	}
}

//Display city from web API after entering a zip code.
async function displayCity(){
	let zipcode = document.querySelector("#zip").value;
	let zipError = document.querySelector("#zipError");
	
	if(zipcode === ""){
		zipError.innerHTML = "";
		document.querySelector("#city").innerHTML = "";
		document.querySelector("#latitude").innerHTML = "";
		document.querySelector("#longitude").innerHTML = "";
	}
	
	let url = `https://csumb.space/api/cityInfoAPI.php?zip=${zipcode}`;
	let response = await fetch(url);
	let data = await response.json();
	
	if(!data){
		zipError.innerHTML = `<strong>Error:</strong> zipcode does not exist.`
		zipError.style.color = "red";
		document.querySelector("#city").innerHTML = "";
		document.querySelector("#latitude").innerHTML = "";
		document.querySelector("#longitude").innerHTML = "";
		return;
	}else{
		zipError.innerHTML = "";
		document.querySelector("#city").innerHTML = data.city;
		document.querySelector("#latitude").innerHTML = data.latitude;
		document.querySelector("#longitude").innerHTML = data.longitude;
	}
	
	document.querySelector("#city").innerHTML = data.city;
	document.querySelector("#latitude").innerHTML = data.latitude;
	document.querySelector("#longitude").innerHTML = data.longitude;
}

async function displayCounties(){
	let state = document.querySelector("#state").value;
	if(state === ""){
		document.querySelector("#county").innerHTML = "";
		return;
	}
	
	let url = `https://csumb.space/api/countyListAPI.php?state=${state}`;
	let response = await fetch(url);
	let data = await response.json();
	let countyList = document.querySelector("#county");
	
	countyList.innerHTML = "<option> Select County </option>";
	for(let item of data){
		countyList.innerHTML += `<option> ${item.county} </option>`;
	}	
}

async function checkUsername(){
	let username = document.querySelector("#username").value;
	let usernameError = document.querySelector("#usernameError");
	if(username.length < 1){
		usernameError.innerHTML = "";
		return;
	}
	let url = `https://csumb.space/api/usernamesAPI.php?username=${username}`;
	let response = await fetch(url);
	let data = await response.json();
	if(data.available){
		usernameError.innerHTML = "Username available!";
		usernameError.style.color = "green";
	}else{
		usernameError.innerHTML = "Username taken";
		usernameError.style.color = "red";
	}
}

async function suggestPassword(){
	let url = `https://webspace.csumb.edu/~lara4594/ajax/suggestedPwd.php?length=8`;
	let response = await fetch(url);
	let data = await response.json();
	if(data){
		document.querySelector("#suggestedPwd").innerHTML = `<em>Suggested password: "<strong>${data.password}</strong></em>"`;
	}
}

function validateForm(e){
	let isValid = true;
	let username = document.querySelector("#username").value;
	if(username.length == 0){
		document.querySelector("#usernameError").innerHTML = "Username Required!";
		document.querySelector("#usernameError").style.color = "red";
		isValid = false;
	}
	
	let password1 = document.querySelector("#pwdOne");
	let password2 = document.querySelector("#pwdTwo");
	let passwordError = document.querySelector("#passwordError");
	
	if(password1.length < 6 || password1.value == ""){
		passwordError.innerHTML = "Password must be at least 6 characters long."
		passwordError.style.color = "red";
		isValid = false;
	}
	
	if(password1.value !== password2.value){
		passwordError.innerHTML = "<strong>Error:</strong> passwords do not match.";
		isValid = false;
	}
	
	if(!isValid){
		e.preventDefault();
	}
}



populateStates();