/*---------------------------CONST-------------------------------------------------------------------------*/
const timetableTitle = document.body.querySelector(".title--timetable");
const timetable = document.body.querySelector(".timetable");

const button_backToTimetableSelection = document.body.querySelector(".backToTimetableSelection");
const button_saveTimetable = document.body.querySelector(".saveTimetable");
const button_addTimebrick = document.body.querySelector(".addTimebrick");

//Cet object donne la structure de données nécessaire pour paramétrer une Timetable.
const timetableData_base = {
	id : 0,
	title : "title",
	data : "date",
	content : []
}

const timebrickData_base = {
	name: 'name',
	class: 'class',
	order: 0
}





/*---------------------------VAR-------------------------------------------------------------------------*/
//Contient les données de la Timetable actuelle. C'est ici que les changements sont effectués pour une sauvegarde future.
currentTimetableData = Object.create(timetableData_base);

var timebrickCounter = 0;






/*---------------------------INIT-------------------------------------------------------------------------*/
button_backToTimetableSelection.addEventListener("click", (e) => {
	document.body.setAttribute("data-page", "timetableSelection");
});

button_saveTimetable.addEventListener("click", (e) => {
	saveTimetable(currentTimetableData);
});

button_addTimebrick.addEventListener("click", (e) => {
	let newTimebrickData = Object.create(timebrickData_base);
	addTimebrick(newTimebrickData);
});





/*---------------------------FUNCTIONS-------------------------------------------------------------------------*/
//Paramètre la Timetable en fonction des données entrées en paramètre.
function setTimetable(timetableData){
	console.log("Set timetable");
	console.log(timetableData);
	timetable.innerHTML = "";
	timetableTitle.innerHTML = "Timetable " + timetableData.id;
	currentTimetableData.id = timetableData.id;
	currentTimetableData.content = [];
	for(let i = 0; i < timetableData.content.length; i++){
		addTimebrick(timetableData.content[i]);
	}
	timebrickCounter = currentTimetableData.content.length;
}


//Enregistre la Timetable dans le local storage.
function saveTimetable(timetableData){
	console.log("Save timetable");
	let currentDate = new Date();
	timetableData.date = currentDate.getDate() + "-" + currentDate.getMonth() + "-" + currentDate.getFullYear();
	let timetableListInMemory = JSON.parse(localStorage.getItem(localStorage_timetableList));
	let timetableIndexIfAlreadySaved = timetableListInMemory.findIndex((e) => {
		return timetableData.id === e.id;
	});
	if(timetableIndexIfAlreadySaved === -1){
		console.log("New memory slot");
		timetableListInMemory.push(timetableData);
		addTimetableToList(currentTimetableData);
	}
	else{
		console.log("Overwritten");
		timetableListInMemory[timetableIndexIfAlreadySaved] = timetableData;
	}
	localStorage.setItem(localStorage_timetableList, JSON.stringify(timetableListInMemory));

}


//Ajoute un Timebrick à la Timetable, correpondant aux données passées en paramètre.
function addTimebrick(timebrickData){
	console.log("Add a timebrick");

	timebrickData.order = timebrickCounter;
	currentTimetableData.content.push(timebrickData);

	let newTimebrick = document.createElement('li');
	newTimebrick.style.order = timebrickCounter;

	let button_removeTimebrick = document.createElement('button');
	button_removeTimebrick.innerHTML = 'X';
	button_removeTimebrick.addEventListener('click', (e) => {
		removeTimebrick(newTimebrick);
	});
	newTimebrick.appendChild(button_removeTimebrick);

	timetable.appendChild(newTimebrick);

	timebrickCounter += 1;
}

function removeTimebrick(timebrickToRemove){
	timetable.removeChild(timebrickToRemove);
	let timebrickToRemoveIndex = timebrickToRemove.style.order;
	currentTimetableData.content.splice(timebrickToRemoveIndex, 1);
	timebrickCounter -= 1;
}