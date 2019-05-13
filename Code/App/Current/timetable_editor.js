/*---------------------------CONST-------------------------------------------------------------------------*/
const timetableTitle = document.body.querySelector(".title--timetable");
const timetable = document.body.querySelector(".timetable");
const timetableEditor = document.body.querySelector(".timetableEditor");

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

const timeBeforeOpeningBrick = 1000;




/*---------------------------VAR-------------------------------------------------------------------------*/
//Contient les données de la Timetable actuelle. C'est ici que les changements sont effectués pour une sauvegarde future.
var currentTimetableData = Object.create(timetableData_base);

var timebrickCounter = 0;
var isClicking = false;
var isMoving = false;
var clickHoldingTimer = 0;
var movingBrick;
var movingBrickInterface;
var mouseStartX;
var mouseStartY;
var mouseOffsetX;
var mouseOffsetY;





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

setBrickDisplacementSystem();






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
	newTimebrick.classList.add("timebrick");

	let newTimebrick__interface = document.createElement('div');
	newTimebrick__interface.classList.add("timebrick__interface")
	newTimebrick__interface.addEventListener("mouseover", (e) => {
		if(isMoving){
			changeOrderWith(e.target.parentNode);
		}
	});
	//For test purpose
	newTimebrick__interface.innerHTML = timebrickCounter;

	let button_removeTimebrick = document.createElement('button');
	button_removeTimebrick.innerHTML = 'X';
	button_removeTimebrick.addEventListener('click', (e) => {
		removeTimebrick(newTimebrick);
	});
	newTimebrick__interface.appendChild(button_removeTimebrick);

	newTimebrick.appendChild(newTimebrick__interface);

	timetable.appendChild(newTimebrick);

	timebrickCounter += 1;
}


//Retire la brique désirée du DOM et de la mémoire.
function removeTimebrick(timebrickToRemove){
	timetable.removeChild(timebrickToRemove);
	let timebrickToRemoveIndex = timebrickToRemove.style.order;
	currentTimetableData.content.splice(timebrickToRemoveIndex, 1);
	timebrickCounter -= 1;
}


//Met en place le système de déplacement des Timebricks.
function setBrickDisplacementSystem(){
	timetableEditor.addEventListener("mousedown", (e) => {
		console.log(e.clientX);
		if(e.target.classList.contains("timebrick__interface")){
			isClicking = true;
			movingBrickInterface = e.target;
			movingBrick = movingBrickInterface.parentNode;
			console.log("Is clicking");
			clickHoldingTimer = setTimeout((e) => {
				clickHoldingTimer = setTimeout((e) => {
					isMoving = true;
					//mouseStartX = e.clientX;
					//mouseStartY = e.clientY;
					console.log("Moving");
					movingBrickInterface.classList.toggle("timebrick__interface--moving");
				}, timeBeforeOpeningBrick - 100);
			}, 100);
		}
	});

	timetableEditor.addEventListener("mouseup", (e) => {
		if(isClicking){
			isClicking = false;
			console.log("Is no longer clicking");
			if(isMoving){
				isMoving = false;
				movingBrickInterface.classList.toggle("timebrick__interface--moving");
			}else{
				clearTimeout(clickHoldingTimer);
				console.log("Just clicking");
			}
		}
	});

	timetableEditor.addEventListener("mousemove", (e) => {
		if(isMoving){
			//mouseOffsetX = e.clientX - 
		}
	})
}


//Échange l'ordre de la Timebrick passée en paramètre avec celui de la Timebrick en mouvement.
function changeOrderWith(brickToChangeWith){
	let movingBrickOrder = movingBrick.style.order;
	let brickToChangeWithOrder = brickToChangeWith.style.order;
	console.log("Change order between " + movingBrickOrder + " and " + brickToChangeWithOrder);
	movingBrick.style.order = brickToChangeWithOrder;
	brickToChangeWith.style.order = movingBrickOrder;
}