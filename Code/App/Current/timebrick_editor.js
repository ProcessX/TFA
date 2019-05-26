/*---------------------------CONST-------------------------------------------------------------------------*/
const timebrickForm = document.querySelector('.timebrickForm');
const timebrickForm_name = document.querySelector('.timebrickForm__name');
const timebrickForm_description = document.querySelector('.timebrickForm__description');
const timebrickForm_duration = document.querySelector('.timebrickForm__duration');

const button_backToTimetableEditor = document.querySelector('.backToTimetableEditor');
const button_addTimebrick = document.querySelector('.addTimebrick');
const button_nextTimebrick = document.querySelector('.nextTimebrick');
const button_previousTimebrick = document.querySelector('.previousTimebrick');






/*---------------------------VAR-------------------------------------------------------------------------*/
var currentTimebrickData = Object.create(timebrickData_base);






/*---------------------------INIT-------------------------------------------------------------------------*/
button_backToTimetableEditor.addEventListener('click', (e) => {
	document.body.setAttribute('data-page', 'timetableEditor');
});

button_addTimebrick.addEventListener('click', (e) => {
	e.preventDefault();
	currentTimebrickData.name = timebrickForm_name.value;
	currentTimebrickData.description = timebrickForm_description.value;
	currentTimebrickData.duration = parseInt(timebrickForm_duration.value);
	currentTimebrickData.class = setTimebrickClass();
	console.log(currentTimebrickData);
	saveTimebrick();
});

button_previousTimebrick.addEventListener('click', (e) => {
	let previousIndex = parseInt(currentTimebrickData.order) - 1;
	if(previousIndex >= 0){
		setTimebrickEditor(currentTimetableData.content[previousIndex]);
	}
});

button_nextTimebrick.addEventListener('click', (e) => {
	let nextIndex = parseInt(currentTimebrickData.order) + 1;
	if(currentTimebrickData.order < timebrickCounter - 1){
		setTimebrickEditor(currentTimetableData.content[nextIndex]);
	}
});






/*---------------------------FUNCTIONS-------------------------------------------------------------------------*/
//Ajoute les données de la timebrick désirée.
function setTimebrickEditor(timebrickData){
	currentTimebrickData = timebrickData;
	if(currentTimebrickData.name != null){
		timebrickForm_name.value = currentTimebrickData.name;
	}

	if(currentTimebrickData.description != null){
		timebrickForm_description.value = currentTimebrickData.description;
	}

	if(currentTimebrickData.duration != null){
		console.log(currentTimebrickData);
		timebrickForm_duration.value = parseInt(timebrickData.duration);
	}
}


//Sauvegarde les données de la timebrick.
function saveTimebrick(){
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