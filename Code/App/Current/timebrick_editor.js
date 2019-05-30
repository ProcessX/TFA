/*---------------------------CONST-------------------------------------------------------------------------*/
const timebrickFormContainer01 = document.querySelector('.timebrick__formContainer--01');
const timebrickForm01 = document.querySelector('.timebrick__form--01');
const timebrickParameter_name01 = document.querySelector('.timebrick__parameter--name--01');
const timebrickParameter_description01 = document.querySelector('.timebrick__parameter--description--01');
const timebrickParameter_duration01 = document.querySelector('.timebrick__parameter--duration--01');

const timebrickFormContainer02 = document.querySelector('.timebrick__formContainer--02');
const timebrickForm02 = document.querySelector('.timebrick__form--02');
const timebrickParameter_name02 = document.querySelector('.timebrick__parameter--name--02');
const timebrickParameter_description02 = document.querySelector('.timebrick__parameter--description--02');
const timebrickParameter_duration02 = document.querySelector('.timebrick__parameter--duration--02');

const button_backToTimetableEditor = document.querySelector('.buttonBackTo--TimetableEditor');
const button_addTimebrick01 = document.querySelector('.buttonAddTimebrick--01');
const button_addTimebrick02 = document.querySelector('.buttonAddTimebrick--02');
const button_nextTimebrick = document.querySelector('.nextTimebrick');
const button_previousTimebrick = document.querySelector('.previousTimebrick');
const button_addEquipment01 = document.querySelector('.addEquipment--01');
const button_addEquipment02 = document.querySelector('.addEquipment--02');

const equipmentList01 = document.querySelector('.equipment__li--01');
const equipmentList02 = document.querySelector('.equipment__li--02');



/*---------------------------VAR-------------------------------------------------------------------------*/
var currentTimebrickData = Object.create(timebrickData_base);

var currentTimebrickFormContainer = timebrickFormContainer01;
var currentTimebrickForm = timebrickForm01;
var currentTimebrickParameter_name = timebrickParameter_name01;
var currentTimebrickParameter_description = timebrickParameter_description01;
var currentTimebrickParameter_duration = timebrickParameter_duration01;
var currentEquipmentList = equipmentList01;
var currentButton__addTimebrick = button_addEquipment01;

var movingTimebrickFormContainer = timebrickFormContainer02;




/*---------------------------INIT-------------------------------------------------------------------------*/
button_backToTimetableEditor.addEventListener('click', (e) => {
	/*
	if(timebrickEditor.getAttribute('data-new') != 'yes'){
		currentTimebrickData.name = timebrickParameter_name.value;
		currentTimebrickData.description = timebrickParameter_description.value;
		currentTimebrickData.duration = parseInt(timebrickParameter_duration.value);
		currentTimebrickData.class = setTimebrickClass();
		console.log(currentTimebrickData);
		saveTimebrick();
	}
	*/
	document.body.setAttribute('data-page', 'timetableEditor');
});

button_addTimebrick01.addEventListener('click', (e) => {
	e.preventDefault();
	currentTimebrickData.name = currentTimebrickParameter_name.value;
	currentTimebrickData.description = currentTimebrickParameter_description.value;
	currentTimebrickData.duration = parseInt(currentTimebrickParameter_duration.value);
	currentTimebrickData.class = setTimebrickClass();
	console.log(currentTimebrickData);
	saveTimebrick();
});

button_addTimebrick02.addEventListener('click', (e) => {
	e.preventDefault();
	currentTimebrickData.name = currentTimebrickParameter_name.value;
	currentTimebrickData.description = currentTimebrickParameter_description.value;
	currentTimebrickData.duration = parseInt(currentTimebrickParameter_duration.value);
	currentTimebrickData.class = setTimebrickClass();
	console.log(currentTimebrickData);
	saveTimebrick();
});

button_previousTimebrick.addEventListener('click', (e) => {
	let previousIndex = parseInt(currentTimebrickData.order) - 1;
	if(previousIndex >= 0){
		changeMainForm();
		movingTimebrickFormContainer.classList.add('timebrick__formContainer--swipeRight');
		setTimebrickEditor(currentTimetableData.content[previousIndex]);
	}
});

button_nextTimebrick.addEventListener('click', (e) => {
	let nextIndex = parseInt(currentTimebrickData.order) + 1;
	if(currentTimebrickData.order < timebrickCounter - 1){
		changeMainForm();
		movingTimebrickFormContainer.classList.add('timebrick__formContainer--swipeLeft');
		setTimebrickEditor(currentTimetableData.content[nextIndex]);
	}
});

button_addEquipment01.addEventListener('click', (e) => {
	e.preventDefault();
	addEquipmentToList('');
})




/*---------------------------FUNCTIONS-------------------------------------------------------------------------*/
//Ajoute les données de la timebrick désirée.
function setTimebrickEditor(timebrickData){
	currentTimebrickData = timebrickData;
	if(currentTimebrickData.name != null){
		currentTimebrickParameter_name.value = currentTimebrickData.name;
	}

	if(currentTimebrickData.description != null){
		currentTimebrickParameter_description.value = currentTimebrickData.description;
	}

	if(currentTimebrickData.duration != null){
		currentTimebrickParameter_duration.value = parseInt(currentTimebrickData.duration);
	}
}


//Sauvegarde les données de la timebrick.
function saveTimebrick(){
	currentTimebrickData.name = currentTimebrickParameter_name.value;
	currentTimebrickData.description = currentTimebrickParameter_description.value;
	currentTimebrickData.duration = currentTimebrickParameter_duration.value;

	if(currentTimebrickData.order < timebrickCounter){
		currentTimetableData.content[currentTimebrickData.order] = currentTimebrickData;
		updateTimebrick(currentTimebrickData);
	}
	else{
		addTimebrick(currentTimebrickData);
		document.body.setAttribute('data-page', 'timetableEditor');
	}
	saveTimetable(currentTimetableData);
}


//Donne une classe à la Timebrick en fonction de sa durée. Totalement partial.
function setTimebrickClass(){
	if(currentTimebrickData.duration <= 15){
		console.log("Dure moins de quinze minutes.");
		return "timebrick--size01";
	}
	if(currentTimebrickData.duration <= 30){
		console.log("Dure entre seize et trente minutes.");
		return "timebrick--size02";
	}
	if(currentTimebrickData.duration <= 45){
		console.log("Dure entre trente-et-une et quarante-cinq minutes.");
		return "timebrick--size03";
	}
	if(currentTimebrickData.duration > 45){
		console.log("Dure plus de quarante-cinq minutes.");
		return "timebrick--size04";
	}
}

//Ajoute un li à la liste de matériel.
function addEquipmentToList(equipmentData){
	console.log(equipmentData);

	let newEquipment = document.createElement('li');
	newEquipment.classList.add('equipment__el');

	let newEquipment_text = document.createElement('input');
	newEquipment_text.classList.add('timebrick__parameter','timebrick__parameter--equipment');
	newEquipment_text.select();

	newEquipment.appendChild(newEquipment_text);

	equipmentList01.appendChild(newEquipment);
}


//Change le formulaire dont on récupérera les informations.
function changeMainForm(){

	if(timebrickFormContainer01.classList.contains('timebrick__formContainer--current')){
		currentTimebrickFormContainer = timebrickFormContainer02;
		currentTimebrickForm = timebrickForm02;
		currentTimebrickParameter_name = timebrickParameter_name02;
		currentTimebrickParameter_description = timebrickParameter_description02;
		currentTimebrickParameter_duration = timebrickParameter_duration02;
		currentEquipmentList = equipmentList02;
		movingTimebrickFormContainer = timebrickFormContainer01;
	}
	else{
		currentTimebrickFormContainer = timebrickFormContainer01;
		currentTimebrickForm = timebrickForm01;
		currentTimebrickParameter_name = timebrickParameter_name01;
		currentTimebrickParameter_description = timebrickParameter_description01;
		currentTimebrickParameter_duration = timebrickParameter_duration01;
		currentEquipmentList = equipmentList01;
		movingTimebrickFormContainer = timebrickFormContainer02;
	}

	timebrickFormContainer01.classList.toggle('timebrick__formContainer--moving');
	timebrickFormContainer02.classList.toggle('timebrick__formContainer--moving');

	timebrickFormContainer01.classList.toggle('timebrick__formContainer--current');
	timebrickFormContainer02.classList.toggle('timebrick__formContainer--current');

	currentTimebrickFormContainer.classList.remove('timebrick__formContainer--swipeLeft', 'timebrick__formContainer--swipeRight');
}