/*---------------------------CONST-------------------------------------------------------------------------*/
const timebrickFormContainer01 = document.querySelector('.timebrick__formContainer--01');
const timebrickForm01 = document.querySelector('.timebrick__form--01');
const timebrickParameter_name01 = document.querySelector('.timebrick__parameter--name--01');
const timebrickParameter_description01 = document.querySelector('.timebrick__parameter--description--01');
const timebrickParameter_duration01 = document.querySelector('.timebrick__parameter--duration--01');
const timebrickDurationDisplay01 = document.querySelector('.duration__display--01');

const timebrickParameterList01 = document.getElementsByClassName('timebrick__parameter--01');

const timebrickFormContainer02 = document.querySelector('.timebrick__formContainer--02');
const timebrickForm02 = document.querySelector('.timebrick__form--02');
const timebrickParameter_name02 = document.querySelector('.timebrick__parameter--name--02');
const timebrickParameter_description02 = document.querySelector('.timebrick__parameter--description--02');
const timebrickParameter_duration02 = document.querySelector('.timebrick__parameter--duration--02');
const timebrickDurationDisplay02 = document.querySelector('.duration__display--02');

const timebrickParameterList02 = document.getElementsByClassName('timebrick__parameter--02');

const button_backToTimetableEditor = document.querySelector('.buttonNavigation--backTo--TimetableEditor');
const button_addTimebrick01 = document.querySelector('.buttonValidateForm--timebrick--01');
const button_addTimebrick02 = document.querySelector('.buttonValidateForm--timebrick--02');
const button_nextTimebrick = document.querySelector('.buttonNavThroughTimebricks--next');
const button_previousTimebrick = document.querySelector('.buttonNavThroughTimebricks--previous');
const button_addEquipment01 = document.querySelector('.addEquipment--01');
const button_addEquipment02 = document.querySelector('.addEquipment--02');

const button_confirmQuitTimebrickEditor = document.querySelector('.buttonConfirm--quitTimebrickEditorPage');
const button_cancelQuitTimebrickEditor = document.querySelector('.buttonCancel--quitTimebrickEditorPage');

const equipmentList01 = document.querySelector('.equipment__li--01');
const equipmentList02 = document.querySelector('.equipment__li--02');

const alertQuitTimebrickEditor = document.querySelector('.alert--quitTimebrickEditorPage');



/*---------------------------VAR-------------------------------------------------------------------------*/
var currentTimebrickData = Object.create(timebrickData_base);

var currentTimebrickFormContainer = timebrickFormContainer01;
var currentTimebrickForm = timebrickForm01;
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
		document.body.setAttribute('data-page', 'timetableEditor');
	}
});

button_addTimebrick01.addEventListener('click', (e) => {
	e.preventDefault();
	currentTimebrickData.name = currentTimebrickParameter_name.value;
	currentTimebrickData.description = currentTimebrickParameter_description.value;
	currentTimebrickData.duration = parseInt(currentTimebrickParameter_duration.value);
	currentTimebrickData.class = setTimebrickClass();
	saveTimebrick();
	document.body.setAttribute('data-page', 'timetableEditor');
});

button_addTimebrick02.addEventListener('click', (e) => {
	e.preventDefault();
	currentTimebrickData.name = currentTimebrickParameter_name.value;
	currentTimebrickData.description = currentTimebrickParameter_description.value;
	currentTimebrickData.duration = parseInt(currentTimebrickParameter_duration.value);
	currentTimebrickData.class = setTimebrickClass();
	saveTimebrick();
	document.body.setAttribute('data-page', 'timetableEditor');
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
	saveTimebrick();
});

button_addEquipment02.addEventListener('click', (e) => {
	e.preventDefault();
	addEquipmentToList('');
	saveTimebrick();
});

button_confirmQuitTimebrickEditor.addEventListener('click', (e) => {
	timebrickEditor.setAttribute('data-new', 'no');
	alertQuitTimebrickEditor.classList.toggle('alert--hidden');
	document.body.setAttribute('data-page', 'timetableEditor');
});

button_cancelQuitTimebrickEditor.addEventListener('click', (e) => {
	alertQuitTimebrickEditor.classList.toggle('alert--hidden');
});


for(let i = 0; i < timebrickParameterList01.length; i++){
	timebrickParameterList01[i].addEventListener('input', (e) => {
		if(currentTimebrickFormContainer === timebrickFormContainer01)
			saveTimebrick();
	});
}

for(let i = 0; i < timebrickParameterList02.length; i++){
	timebrickParameterList02[i].addEventListener('input', (e) => {
		if(currentTimebrickFormContainer === timebrickFormContainer02)
			saveTimebrick();
	});
}




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

	currentTimebrickDurationDisplay.innerHTML = currentTimebrickData.duration + ' min';

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

	if(timebrickFormContainer01.classList.contains('timebrick__formContainer--current')){
		currentTimebrickFormContainer = timebrickFormContainer02;
		currentTimebrickForm = timebrickForm02;
		currentTimebrickParameter_name = timebrickParameter_name02;
		currentTimebrickParameter_description = timebrickParameter_description02;
		currentTimebrickParameter_duration = timebrickParameter_duration02;
		currentEquipmentList = equipmentList02;
		currentTimebrickDurationDisplay = timebrickDurationDisplay02;
		movingTimebrickFormContainer = timebrickFormContainer01;
	}
	else{
		currentTimebrickFormContainer = timebrickFormContainer01;
		currentTimebrickForm = timebrickForm01;
		currentTimebrickParameter_name = timebrickParameter_name01;
		currentTimebrickParameter_description = timebrickParameter_description01;
		currentTimebrickParameter_duration = timebrickParameter_duration01;
		currentEquipmentList = equipmentList01;
		currentTimebrickDurationDisplay = timebrickDurationDisplay01;
		movingTimebrickFormContainer = timebrickFormContainer02;
	}

	timebrickFormContainer01.classList.toggle('timebrick__formContainer--moving');
	timebrickFormContainer02.classList.toggle('timebrick__formContainer--moving');

	currentTimebrickFormContainer.classList.remove('timebrick__formContainer--swipeLeft', 'timebrick__formContainer--swipeRight');

	timebrickFormContainer01.classList.toggle('timebrick__formContainer--current');
	timebrickFormContainer02.classList.toggle('timebrick__formContainer--current');

}