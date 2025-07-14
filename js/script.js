
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
	
	if(zipcode === ""){
		hideElement("zipError");
		document.querySelector("#city").innerHTML = "";
		document.querySelector("#latitude").innerHTML = "";
		document.querySelector("#longitude").innerHTML = "";
	}
	
	let url = `https://csumb.space/api/cityInfoAPI.php?zip=${zipcode}`;
	let response = await fetch(url);
	let data = await response.json();
	
	if(!data){
		setError("zipError","<strong>Error:</strong> zipcode does not exist.");
		document.querySelector("#city").innerHTML = "";
		document.querySelector("#latitude").innerHTML = "";
		document.querySelector("#longitude").innerHTML = "";
		return;
	}else{
		hideElement("zipError");
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

function setError(errorID, msg){
	let error = document.querySelector("#"+errorID);
	showElement(errorID);
	error.innerHTML = msg;
	error.style.color = "red";
}

function hideElement(elementID){
	document.querySelector("#"+elementID).classList.add("d-none");
}

function showElement(elementID){
	document.querySelector("#"+elementID).classList.remove("d-none");
}

function validateForm(e){
	let isValid = true;
	let username = document.querySelector("#username").value;
	hideElement("usernameError");
	if(username.length == 0){
		setError("usernameError","Username Required!")
		isValid = false;
	}
	
	hideElement("passwordError");
	let password1 = document.querySelector("#pwdOne").value;
	let password2 = document.querySelector("#pwdTwo").value;
	
	if(password1.length < 6){
		setError("passwordError","Password must be at least 6 characters long.");
		isValid = false;
	}
	
	if(password1.value !== password2.value || password2.length < 6){
		setError("passwordError","<strong>Error:</strong> passwords do not match.");
		isValid = false;
	}
	
	hideElement("fnameError");
	hideElement("lnameError");
	let fname = document.querySelector("#fname").value;
	let lname = document.querySelector("#lname").value;
	
	if(fname.length < 1){
		setError("fnameError","Enter first name.");
		isValid = false;
	}
	
	if(lname.length < 1){
		setError("lnameError","Enter last name.");
		isValid = false;
	}
	
	
	hideElement("genderError");
	let genderOptions = document.getElementsByName("gender");
	for(let option of genderOptions){
		if(option.checked){
			if(option.value === ""){
				setError("genderError","Choose a gender");
				isValid = false;
			}
			break;
		}
	}
	
	
	hideElement("stateError");
	if(document.querySelector("#state").value === ""){
		setError("stateError", "Please select a state.");
		isValid = false;
	}
	
	
	hideElement("countyError");
	if(document.querySelector("#county").value === "Select County"){
		setError("countyError", "Please select a county.");
		isValid = false;
	}
	
	
	hideElement("zipError");
	if(document.querySelector("#zip").value === ""){
		setError("zipError", "Please enter a valid zipcode.");
		isValid = false;
	}
	
	if(!isValid){
		e.preventDefault();
	}
}



populateStates();