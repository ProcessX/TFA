/*---------------------------CONST-------------------------------------------------------------------------*/
const timebrickFormContainer01 = document.querySelector('.setterContainer--timebrick--01');
const timebrickParameter_name01 = document.querySelector('.textInput--timebrick--name--01');
const timebrickParameter_description01 = document.querySelector('.textareaInput--timebrick--description--01');
const timebrickParameter_duration01 = document.querySelector('.rangeInput--timebrick--duration--01');
const timebrickDurationDisplay01 = document.querySelector('.setter__parameterDisplay--duration--01');

const timebrickFormContainer02 = document.querySelector('.setterContainer--timebrick--02');
const timebrickParameter_name02 = document.querySelector('.textInput--timebrick--name--02');
const timebrickParameter_description02 = document.querySelector('.textareaInput--timebrick--description--02');
const timebrickParameter_duration02 = document.querySelector('.rangeInput--timebrick--duration--02');
const timebrickDurationDisplay02 = document.querySelector('.setter__parameterDisplay--duration--02');

const button_backToTimetableEditor = document.querySelector('.buttonNavigation--backTo--TimetableEditor');
const button_addTimebrick01 = document.querySelector('.buttonValidateSetter--timebrick--01');
const button_addTimebrick02 = document.querySelector('.buttonValidateSetter--timebrick--02');
const button_nextTimebrick = document.querySelector('.buttonNavThroughTimebricks--next');
const button_previousTimebrick = document.querySelector('.buttonNavThroughTimebricks--previous');
const button_addEquipment01 = document.querySelector('.buttonAddEquipment--01');
const button_addEquipment02 = document.querySelector('.buttonAddEquipment--02');

const button_confirmQuitTimebrickEditor = document.querySelector('.buttonConfirm--quitTimebrickEditorPage');
const button_cancelQuitTimebrickEditor = document.querySelector('.buttonCancel--quitTimebrickEditorPage');

const equipmentList01 = document.querySelector('.equipment__li--01');
const equipmentList02 = document.querySelector('.equipment__li--02');

const alertQuitTimebrickEditor = document.querySelector('.alert--quitTimebrickEditorPage');



/*---------------------------VAR-------------------------------------------------------------------------*/
var currentTimebrickData = Object.create(timebrickData_base);
currentTimetableData.name = ''

var currentTimebrickFormContainer = timebrickFormContainer01;
var currentTimebrickParameter_name = timebrickParameter_name01;
var currentTimebrickParameter_description = timebrickParameter_description01;
var currentTimebrickParameter_duration = timebrickParameter_duration01;
var currentEquipmentList = equipmentList01;
var currentButton__addTimebrick = button_addEquipment01;
var currentTimebrickDurationDisplay = timebrickDurationDisplay01;

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
	if(timebrickEditor.getAttribute('data-new') === 'yes'){
		alertQuitTimebrickEditor.classList.toggle('alert--hidden');
	}
	else{
		saveTimebrick();
		document.body.setAttribute('data-page', 'timetableEditor');
	}
});

button_addTimebrick01.addEventListener('click', (e) => {
	e.preventDefault();
	currentTimebrickData.name = currentTimebrickParameter_name.value;
	currentTimebrickData.description = currentTimebrickParameter_description.value;
	currentTimebrickData.duration = parseInt(currentTimebrickParameter_duration.value);
	currentTimebrickData.class = setTimebrickClass();
	currentTimetableData.order = timebrickCounter;
	saveTimebrick();
	document.body.setAttribute('data-page', 'timetableEditor');

	timebrickEditor.setAttribute('data-new', 'no');
});

button_addTimebrick02.addEventListener('click', (e) => {
	e.preventDefault();
	currentTimebrickData.name = currentTimebrickParameter_name.value;
	currentTimebrickData.description = currentTimebrickParameter_description.value;
	currentTimebrickData.duration = parseInt(currentTimebrickParameter_duration.value);
	currentTimebrickData.class = setTimebrickClass();
	currentTimetableData.order = timebrickCounter;
	saveTimebrick();
	document.body.setAttribute('data-page', 'timetableEditor');
});

button_previousTimebrick.addEventListener('click', (e) => {
	let previousIndex = parseInt(currentTimebrickData.order) - 1;
	if(previousIndex >= 0){
		saveTimebrick();
		changeMainForm();
		movingTimebrickFormContainer.classList.add('setterContainer--timebrick--swipeRight');
		setTimebrickEditor(currentTimetableData.content[previousIndex]);
	}
});

button_nextTimebrick.addEventListener('click', (e) => {
	let nextIndex = parseInt(currentTimebrickData.order) + 1;
	if(currentTimebrickData.order < timebrickCounter - 1){
		saveTimebrick();
		changeMainForm();
		movingTimebrickFormContainer.classList.add('setterContainer--timebrick--swipeLeft');
		setTimebrickEditor(currentTimetableData.content[nextIndex]);
	}
});

button_addEquipment01.addEventListener('click', (e) => {
	e.preventDefault();
	addEquipmentToList('');
});

button_addEquipment02.addEventListener('click', (e) => {
	e.preventDefault();
	addEquipmentToList('');
});

button_confirmQuitTimebrickEditor.addEventListener('click', (e) => {
	timebrickEditor.setAttribute('data-new', 'no');
	alertQuitTimebrickEditor.classList.toggle('alert--hidden');
	document.body.setAttribute('data-page', 'timetableEditor');
});

button_cancelQuitTimebrickEditor.addEventListener('click', (e) => {
	alertQuitTimebrickEditor.classList.toggle('alert--hidden');
});

timebrickParameter_duration01.addEventListener('input', (e) => {
	currentTimebrickDurationDisplay.innerHTML = currentTimebrickParameter_duration.value + ' min';
	saveTimebrick();
});

timebrickParameter_duration02.addEventListener('input', (e) => {
	currentTimebrickDurationDisplay.innerHTML = currentTimebrickParameter_duration.value + ' min';
	saveTimebrick();
});

timebrickParameter_name01.addEventListener('input', (e) => {
	saveTimebrick();
});

timebrickParameter_name02.addEventListener('input', (e) => {
	saveTimebrick();
});



/*---------------------------FUNCTIONS-------------------------------------------------------------------------*/
//Ajoute les données de la timebrick désirée.
function setTimebrickEditor(timebrickData){
	currentTimebrickData = timebrickData;
	if(currentTimebrickData.name != ''){
		currentTimebrickParameter_name.value = currentTimebrickData.name;
	}
	else{
		currentTimebrickParameter_name.value = 'Mon activité (' + timebrickCounter + ')';
	}

	if(currentTimebrickData.description != null){
		currentTimebrickParameter_description.value = currentTimebrickData.description;
	}

	if(currentTimebrickData.duration != null){
		currentTimebrickParameter_duration.value = parseInt(currentTimebrickData.duration);
	}

	currentTimebrickDurationDisplay.innerHTML = currentTimebrickParameter_duration.value + ' min';

	currentEquipmentList.innerHTML = '';
	timebrickData.equipment.forEach((e) => {
		addEquipmentToList(e);
	});
}


//Sauvegarde les données de la timebrick.
function saveTimebrick(){
	currentTimebrickData.name = currentTimebrickParameter_name.value;
	currentTimebrickData.description = currentTimebrickParameter_description.value;
	currentTimebrickData.duration = currentTimebrickParameter_duration.value;
	currentTimebrickData.equipment = [];
	for(let i = 0; i < currentEquipmentList.childNodes.length; i++){
		if(currentEquipmentList.childNodes[i].childNodes[0].value != '')
			currentTimebrickData.equipment.push(currentEquipmentList.childNodes[i].childNodes[0].value);
	}

	if(currentTimebrickData.order < timebrickCounter){
		currentTimetableData.content[currentTimebrickData.order] = currentTimebrickData;
		updateTimebrick(currentTimebrickData);
	}
	else{
		addTimebrick(currentTimebrickData);
		setTimebrickHour();
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
	let newEquipment = document.createElement('li');
	newEquipment.classList.add('equipment__el');

	let newEquipment_text = document.createElement('input');
	newEquipment_text.classList.add('timebrick__parameter','timebrick__parameter--equipment');
	newEquipment_text.select();
	newEquipment_text.value = equipmentData;
	newEquipment_text.placeholder = 'Équipement';
	newEquipment_text.addEventListener('input', saveTimebrick);

	newEquipment.appendChild(newEquipment_text);

	let button_removeEquipment = document.createElement('button');
	button_removeEquipment.innerHTML = 'X';
	button_removeEquipment.addEventListener('click', (e) =>{
		currentEquipmentList.removeChild(newEquipment);
		saveTimebrick();
	});
	newEquipment.appendChild(button_removeEquipment);

	currentEquipmentList.appendChild(newEquipment);
}


//Change le formulaire dont on récupérera les informations.
function changeMainForm(){

	if(timebrickFormContainer01.classList.contains('setterContainer--timebrick--current')){
		currentTimebrickFormContainer = timebrickFormContainer02;
		currentTimebrickParameter_name = timebrickParameter_name02;
		currentTimebrickParameter_description = timebrickParameter_description02;
		currentTimebrickParameter_duration = timebrickParameter_duration02;
		currentEquipmentList = equipmentList02;
		currentTimebrickDurationDisplay = timebrickDurationDisplay02;
		movingTimebrickFormContainer = timebrickFormContainer01;
	}
	else{
		currentTimebrickFormContainer = timebrickFormContainer01;
		currentTimebrickParameter_name = timebrickParameter_name01;
		currentTimebrickParameter_description = timebrickParameter_description01;
		currentTimebrickParameter_duration = timebrickParameter_duration01;
		currentEquipmentList = equipmentList01;
		currentTimebrickDurationDisplay = timebrickDurationDisplay01;
		movingTimebrickFormContainer = timebrickFormContainer02;
	}

	timebrickFormContainer01.classList.toggle('setterContainer--timebrick--moving');
	timebrickFormContainer02.classList.toggle('setterContainer--timebrick--moving');

	currentTimebrickFormContainer.classList.remove('setterContainer--timebrick--swipeLeft', 'setterContainer--timebrick--swipeRight');

	timebrickFormContainer01.classList.toggle('setterContainer--timebrick--current');
	timebrickFormContainer02.classList.toggle('setterContainer--timebrick--current');

}