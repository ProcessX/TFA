/*---------------------------CONST-------------------------------------------------------------------------*/
const timetableList = document.body.querySelector(".timetable__li");

const button_createNewTimetable = document.body.querySelector(".createNewTimetable");

const localStorage_timetableList = "timetableList";






/*---------------------------VAR-------------------------------------------------------------------------*/

var timetableCounter;






/*---------------------------INIT-------------------------------------------------------------------------*/

button_createNewTimetable.addEventListener("click", (e) => {
	let newTimetableData = Object.create(timetableData_base);
	newTimetableData.id = timetableCounter;//Possiblement va changer.
	newTimetableData.content = [];
	setTimetable(newTimetableData);
	document.body.setAttribute("data-page", "timetableEditor");
});

setTimetableList();







/*---------------------------FUNCTIONS-------------------------------------------------------------------------*/
//Demande l'ajout des Timetables présentent en mémoire dans le DOM (appelé une fois à l'ouverture de la page).
function setTimetableList(){
	let timetableListInMemory = JSON.parse(localStorage.getItem(localStorage_timetableList));
	timetableCounter = 0;
	if(timetableListInMemory === null){
		localStorage.setItem(localStorage_timetableList, "[]");
	}
	else{
		console.log("Set timetable list");
		let i;
		for(i = 0; i < timetableListInMemory.length; i++)
			addTimetableToList(timetableListInMemory[i]);
		if(timetableListInMemory.length > 0)
			timetableCounter = timetableListInMemory[i-1].id + 1;
	}
}


//Ajoute une Timetable dans le DOM, correspondante aux données passées en paramètre.
function addTimetableToList(timetableData){
	console.log("Add a timetable");
	timetableCounter += 1;

	let newTimetable = document.createElement("li");
	newTimetable.innerHTML = timetableData.id;
	newTimetable.setAttribute("data-timetable-id", timetableData.id);
	newTimetable.addEventListener("click", (e) => {
		let timetableId = parseInt(e.target.getAttribute("data-timetable-id"));
		let newTimetableData = getTimetableById(timetableId);
		setTimetable(newTimetableData);
		document.body.setAttribute("data-page", "timetableEditor");
	});

	let button_removeTimetable = document.createElement("button");
	button_removeTimetable.innerHTML = "X";
	button_removeTimetable.addEventListener("click", (e) => {
		e.stopPropagation();
		removeTimetableFromList(newTimetable);
	});
	newTimetable.appendChild(button_removeTimetable);

	timetableList.appendChild(newTimetable);
}


//Retire une Timetable du DOM et de la mémoire, correspondante aux données passées en paramètre.
function removeTimetableFromList(timetableToRemove){
	console.log("Remove a timetable");
	timetableList.removeChild(timetableToRemove);
	let timetableToRemoveId = timetableToRemove.getAttribute("data-timetable-id");
	let timetableListInMemory = JSON.parse(localStorage.getItem(localStorage_timetableList));
	timetableListInMemory = timetableListInMemory.filter((e) => {
		return e.id != timetableToRemoveId;
	});
	localStorage.setItem(localStorage_timetableList, JSON.stringify(timetableListInMemory));
}


//Prépare les données pour mettre en place la nouvelle Timetable, et les passe à la fonction chargée de la mise en place de ladite Timetable.
function createNewTimetable(){
	console.log("Create a new timetable");
}


//Retourne les données de la Timetable présente dans la mémoire, selon l'id entré en paramètre.
function getTimetableById(id){
	let timetableListInMemory = JSON.parse(localStorage.getItem("timetableList"));
	for(let i = 0; i < timetableListInMemory.length; i++){
		if(timetableListInMemory[i].id === id){
			return timetableListInMemory[i];
		}
	}
}