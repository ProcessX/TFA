/*---------------------------CONST-------------------------------------------------------------------------*/
const timetableTitle = document.querySelector(".title--timetable");
const timetable = document.querySelector(".timetable");
const timetableEditor = document.querySelector(".timetableEditor");

const button_backToTimetableSelection = document.querySelector(".backToTimetableSelection");
//const button_saveTimetable = document.querySelector(".saveTimetable");
const button_setTimebrick = document.querySelector(".setTimebrick");

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
	description: 'description',
	duration: 5,
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
var currentClientX;
var currentClientY;
var mouseStartX = -1;
var mouseStartY = -1;
var mouseOffsetX;
var mouseOffsetY;
var mouseOffsetYCorrection;

var timebrickListDOM = [];





/*---------------------------INIT-------------------------------------------------------------------------*/
button_backToTimetableSelection.addEventListener("click", (e) => {
	saveTimetable(currentTimetableData);
	document.body.setAttribute("data-page", "timetableSelection");
});

/*
button_saveTimetable.addEventListener("click", (e) => {
	saveTimetable(currentTimetableData);
});
*/

button_setTimebrick.addEventListener("click", (e) => {
	let newTimebrickData = Object.create(timebrickData_base);
	//newTimebrickData.name = "" + timebrickCounter;
	newTimebrickData.order = timebrickCounter;
	setTimebrickEditor(newTimebrickData);
	document.body.setAttribute('data-page', 'timebrickEditor');
	//addTimebrick(newTimebrickData);
});

setBrickDisplacementSystem();






/*---------------------------FUNCTIONS-------------------------------------------------------------------------*/
//Paramètre la Timetable en fonction des données entrées en paramètre.
function setTimetable(timetableData){
	timebrickCounter = 0;
	timetable.innerHTML = "";
	timetableTitle.innerHTML = timetableData.title;
	currentTimetableData.id = timetableData.id;
	currentTimetableData.content = [];
	for(let i = 0; i < timetableData.content.length; i++){
		addTimebrick(timetableData.content[i]);
	}
}


//Enregistre la Timetable dans le local storage.
function saveTimetable(timetableData){
	console.log("Save timetable");
	timetableData.title = timetableTitle.innerHTML;
	let currentDate = new Date();
	timetableData.date = currentDate.getDate() + "-" + currentDate.getMonth() + "-" + currentDate.getFullYear();
	let timetableListInMemory = JSON.parse(localStorage.getItem(localStorage_timetableList));
	let timetableIndexIfAlreadySaved = timetableListInMemory.findIndex((e) => {
		return timetableData.id === e.id;
	});
	if(timetableIndexIfAlreadySaved === -1){
		timetableListInMemory.push(timetableData);
		addTimetableToList(currentTimetableData);
	}
	else{
		timetableListInMemory[timetableIndexIfAlreadySaved] = timetableData;
	}
	localStorage.setItem(localStorage_timetableList, JSON.stringify(timetableListInMemory));
	console.log(timetableData);
}


//Ajoute un Timebrick à la Timetable, correpondant aux données passées en paramètre.
function addTimebrick(timebrickData){

	currentTimetableData.content.push(timebrickData);

	let newTimebrick = document.createElement('li');
	newTimebrick.style.order = timebrickData.order;
	newTimebrick.classList.add("timebrick");
	newTimebrick.classList.add(timebrickData.class);

	let newTimebrick__interface = document.createElement('div');
	newTimebrick__interface.classList.add("timebrick__interface")
	newTimebrick__interface.addEventListener("mouseover", (e) => {
		if(isMoving){
			getNewOffsetY(e.target.parentNode);
			changeOrderWith(e.target.parentNode);
			saveTimetable(currentTimetableData);
		}
	});
	newTimebrick__interface.addEventListener('touchstart', (e) => {
		if(isMoving){
			e.preventDefault();
			e.target.dispatchEvent(e);
			console.log(e.target);
		}
	});

	newTimebrick__name = document.createElement('h2');
	newTimebrick__name.classList.add('timebrick__name');
	newTimebrick__name.innerHTML = timebrickData.name;
	newTimebrick__interface.appendChild(newTimebrick__name);
	

	let button_removeTimebrick = document.createElement('button');
	button_removeTimebrick.innerHTML = 'X';
	button_removeTimebrick.classList.add('timebrick__remove');
	button_removeTimebrick.addEventListener('click', (e) => {
		removeTimebrick(newTimebrick);
	});
	newTimebrick__interface.appendChild(button_removeTimebrick);

	newTimebrick.appendChild(newTimebrick__interface);

	timetable.appendChild(newTimebrick);

	timebrickListDOM.push(newTimebrick);

	timebrickCounter += 1;
}


//Retire la brique désirée du DOM et de la mémoire.
function removeTimebrick(timebrickToRemove){
	timetable.removeChild(timebrickToRemove);
	let timebrickToRemoveIndex = timebrickToRemove.style.order;
	currentTimetableData.content.splice(timebrickToRemoveIndex, 1);
	timebrickCounter -= 1;
	timebrickListDOM.splice(timebrickToRemoveIndex, 1);

	for(let i = 0; i < timebrickCounter; i++){
		currentTimetableData.content[i].order = i;
		timebrickListDOM[i].style.order = i;
	}
	saveTimetable(currentTimetableData);
}


//Met en place le système de déplacement des Timebricks.
function setBrickDisplacementSystem(){
	
	timetableEditor.oncontextmenu = function(event) {
	     event.preventDefault();
	     event.stopPropagation();
	     return false;
	};


	timetableEditor.addEventListener("mousedown", selectTimebrick);
	timetableEditor.addEventListener('mouseup', dropTimebrick);
	timetableEditor.addEventListener("mousemove", moveTimebrick);

	timetableEditor.addEventListener('touchstart', selectTimebrick);
	timetableEditor.addEventListener('touchend', dropTimebrick);
	timetableEditor.addEventListener('touchmove', moveTimebrick);
}


function selectTimebrick(e){
	e.preventDefault();

	if(e.target.classList.contains("timebrick__interface")){
		isClicking = true;
		movingBrickInterface = e.target;
		movingBrickInterface.style.transition = '0s';
		movingBrick = movingBrickInterface.parentNode;
		/*
		clickHoldingTimer = setTimeout((e) => {
			clickHoldingTimer = setTimeout((e) => {
				isMoving = true;
				movingBrickInterface.classList.toggle("timebrick__interface--moving");
			}, timeBeforeOpeningBrick - 100);
		}, 100);
		*/
		clickHoldingTimer = setTimeout((e) => {
			isMoving = true;
			movingBrickInterface.classList.toggle("timebrick__interface--moving");
		}, timeBeforeOpeningBrick - 100);
	}
}


function dropTimebrick(e){
	e.preventDefault();

	if(isClicking){
		isClicking = false;
		if(isMoving){
			isMoving = false;
			movingBrickInterface.classList.toggle("timebrick__interface--moving");
			movingBrickInterface.style.transform = 'translate(0px)';
			movingBrickInterface.style.transition = '1s';
			mouseStartX = -1;
			mouseStartY = -1;
		}else{
			clearTimeout(clickHoldingTimer);
			let timebrickToEdit = currentTimetableData.content[movingBrick.style.order];
			setTimebrickEditor(timebrickToEdit);
			document.body.setAttribute('data-page', 'timebrickEditor');
		}
	}
}


function moveTimebrick(e){
	e.preventDefault();

	if(isMoving){
		if(e.type === 'mousemove'){
			currentClientX = e.clientX;
			currentClientY = e.clientY;
		}
		else{
			currentClientX = e.touches[0].clientX;
			currentClientY = e.touches[0].clientY;
		}

		checkTimebricksCoord();

		if(mouseStartX === -1){
			mouseStartX = currentClientX;
			mouseStartY = currentClientY;
			mouseOffsetYCorrection = mouseStartY - movingBrick.getBoundingClientRect().top;
		}
		mouseOffsetX = currentClientX - mouseStartX;
		mouseOffsetY = currentClientY - mouseStartY;
		//A ajouter plus tard : un scale. Faire gaffe, parce que ça fout complètement la merde dans les calculs de positions.
		movingBrickInterface.style.transform = `translate(${mouseOffsetX}px,${mouseOffsetY}px)`;
	}
}



//Échange l'ordre de la Timebrick passée en paramètre avec celui de la Timebrick en mouvement.
function changeOrderWith(brickToChangeWith){
	let movingBrickOrder = movingBrick.style.order;
	let brickToChangeWithOrder = brickToChangeWith.style.order;
	movingBrick.style.order = brickToChangeWithOrder;
	brickToChangeWith.style.order = movingBrickOrder;

	let movingBrickData = currentTimetableData.content[movingBrickOrder];
	movingBrickData.order = brickToChangeWithOrder;
	currentTimetableData.content[movingBrickOrder] = currentTimetableData.content[brickToChangeWithOrder];
	currentTimetableData.content[movingBrickOrder].order = movingBrickOrder;
	currentTimetableData.content[brickToChangeWithOrder] = movingBrickData;

	timebrickListDOM[movingBrickOrder] = brickToChangeWith;
	timebrickListDOM[brickToChangeWithOrder] = movingBrick;
}


//Calcule le nouvel offsetY lors d'un échange de places.
//Version actuelle : toutes les bricks ont les mêmes margins top et bottom, mais des hauteurs différentes sont autorisées.
function getNewOffsetY(brickToChangeWith){
	let movingBrickStyle = movingBrick.currentStyle || window.getComputedStyle(movingBrick);
	let brickToChangeWithStyle = brickToChangeWith.currentStyle || window.getComputedStyle(brickToChangeWith);
	let mouseDirection = Math.sign(brickToChangeWith.style.order - movingBrick.style.order);
	let mouseCorrection = mouseOffsetYCorrection;
	let heightDifference = brickToChangeWith.offsetHeight - movingBrick.offsetHeight;
	//let marginDifference = (parseInt(brickToChangeWithStyle.marginTop) - parseInt(movingBrickStyle.marginTop)) + (parseInt(brickToChangeWithStyle.marginBottom) - parseInt(movingBrickStyle.marginBottom));

	if(mouseDirection < 0){
		mouseCorrection = movingBrick.offsetHeight - mouseOffsetYCorrection;
	}
	mouseStartY = currentClientY + (mouseCorrection * mouseDirection);
	mouseStartY += heightDifference * mouseDirection;
	//mouseStartY += marginDifference * mouseDirection;

}


//Permet de modifier un élément du DOM sans le supprimer ou le recréer.
function updateTimebrick(timebrickData){
	let timebrickToUpdate = timebrickListDOM[timebrickData.order];
	timebrickToUpdate.childNodes[0].childNodes[0].innerHTML = timebrickData.name;
	timebrickToUpdate.className = "";
	timebrickToUpdate.classList.add("timebrick");
	timebrickToUpdate.classList.add(timebrickData.class);
}


function checkTimebricksCoord(){
	let timebrickCoord;
	timebrickListDOM.forEach((e) => {
		if(e != movingBrick){
			timebrickCoord = e.getBoundingClientRect();
			console.log(timebrickCoord.top + ', ' + currentClientY);

			if(currentClientY >= timebrickCoord.top || currentClientY <= timebrickCoord.bottom){
				console.log('HAHAHAHAHAHAHAHAHAHAHA');
			}
		}
	});
}