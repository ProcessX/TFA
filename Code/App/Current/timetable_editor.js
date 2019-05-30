/*---------------------------CONST-------------------------------------------------------------------------*/
const timetableTitle = document.querySelector(".title--timetableEditor");
const timetable = document.querySelector(".timetable");
const timetableEditor = document.querySelector(".timetableEditor");
const timetableSetter = document.querySelector('.timetable__setter');
const timetableParameterAgeDisplay = document.querySelector('.timetable__parameter__age__display');
const timebrickEditor = document.querySelector('.timebrickEditor');

const button_backToTimetableSelection = document.querySelector(".buttonBackTo--TimetableSelection");
const button_setTimebrick = document.querySelector(".buttonAdd--setTimebrick");
const button_revealForm = document.querySelector('.buttonRevealForm');
const button_validateForm = document.querySelector('.buttonValidateForm');

const timetableParameter_date = document.querySelector('.timetable__parameter--date');
const timetableParameter_durationMin = document.querySelector('.timetable__parameter--duration--min');
const timetableParameter_durationMax = document.querySelector('.timetable__parameter--duration--max');
const timetableParameter_ageMin = document.querySelector('.timetable__parameter--age--min');
const timetableParameter_ageMax = document.querySelector('.timetable__parameter--age--max');
const timetableParameter_theme = document.querySelector('.timetable__parameter--theme');
const timetableParameter_summary = document.querySelector('.timetable__parameter--summary');

//Cet object donne la structure de données nécessaire pour paramétrer une Timetable.
const timetableData_base = {
	id : 0,
	title : "title",
	date : "date",
	ageMin : 4,
	ageMax : 18,
	startTime : '08:30',
	endTime : '23:00',
	theme : 'theme',
	summary : 'summary',
	content : []
}

const timebrickData_base = {
	name: 'name',
	class: 'class',
	description: 'description',
	duration: 5,
	equipment: [],
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
	if(currentTimetableData.content.length >= 1)
		saveTimetable();
	timetableSetter.classList.add('timetable__setter--hidden');
	document.body.setAttribute("data-page", "timetableSelection");
	timebrickEditor.setAttribute('data-new', 'yes');
});

button_setTimebrick.addEventListener("click", (e) => {
	let newTimebrickData = Object.create(timebrickData_base);
	newTimebrickData.order = timebrickCounter;
	setTimebrickEditor(newTimebrickData);
	document.body.setAttribute('data-page', 'timebrickEditor');
});

button_revealForm.addEventListener('click', (e) => {
	timetableSetter.classList.toggle('timetable__setter--hidden');
});

button_validateForm.addEventListener('click', (e) => {
	e.preventDefault();
	currentTimetableData.date = timetableParameter_date.value;
	currentTimetableData.startTime = timetableParameter_durationMin.value;
	currentTimetableData.endTime = timetableParameter_durationMax.value;
	currentTimetableData.ageMin = timetableParameter_ageMin.value;
	currentTimetableData.ageMax = timetableParameter_ageMax.value;
	currentTimetableData.theme = timetableParameter_theme.value;
	currentTimetableData.summary = timetableParameter_summary.value;
	timetableSetter.classList.toggle('timetable__setter--hidden');
});

timetableParameter_ageMin.addEventListener('input', checkAgeParameter);
timetableParameter_ageMax.addEventListener('input', checkAgeParameter);
timetableParameter_date.addEventListener('input', (e) => {
	setTimetableTitle(timetableParameter_date.value);
})

setBrickDisplacementSystem();






/*---------------------------FUNCTIONS-------------------------------------------------------------------------*/
//Paramètre la Timetable en fonction des données entrées en paramètre.
function setTimetable(timetableData){
	timebrickCounter = 0;
	timetable.innerHTML = "";
	//timetableTitle.innerHTML = timetableData.title;
	setTimetableTitle(timetableData.date);
	currentTimetableData.id = timetableData.id;
	currentTimetableData.date = timetableData.date;
	currentTimetableData.startTime = timetableData.startTime;
	currentTimetableData.endTime = timetableData.endTime;
	currentTimetableData.ageMin = timetableData.ageMin;
	currentTimetableData.ageMax = timetableData.ageMax;
	currentTimetableData.theme = timetableData.theme;
	currentTimetableData.summary = timetableData.summary;

	setTimetableForm();

	currentTimetableData.content = [];
	for(let i = 0; i < timetableData.content.length; i++){
		addTimebrick(timetableData.content[i]);
	}
}


function setTimetableForm(){
	console.log(currentTimetableData.date);
	if(currentTimetableData.date != 'date')
		timetableParameter_date.value = currentTimetableData.date;
	else
		timetableParameter_date.value = '';

	timetableParameter_durationMin.value = currentTimetableData.startTime;
	timetableParameter_durationMax.value = currentTimetableData.endTime;
	timetableParameter_ageMin.value = currentTimetableData.ageMin;
	timetableParameter_ageMax.value = currentTimetableData.ageMax;
	timetableParameterAgeDisplay.innerHTML = currentTimetableData.ageMin + '-' + currentTimetableData.ageMax + ' ans';
	timetableParameter_theme.value = currentTimetableData.theme;
	timetableParameter_summary.value = currentTimetableData.summary;
}


//Enregistre la Timetable dans le local storage.
function saveTimetable(){
	console.log("Save timetable");

	currentTimetableData.date = timetableParameter_date.value;
	currentTimetableData.startTime = timetableParameter_durationMin.value;
	currentTimetableData.endTime = timetableParameter_durationMax.value;
	currentTimetableData.ageMin = timetableParameter_ageMin.value;
	currentTimetableData.ageMax = timetableParameter_ageMax.value;
	currentTimetableData.theme = timetableParameter_theme.value;
	currentTimetableData.summary = timetableParameter_summary.value;

	let timetableListInMemory = JSON.parse(localStorage.getItem(localStorage_timetableList));
	let timetableIndexIfAlreadySaved = timetableListInMemory.findIndex((e) => {
		return currentTimetableData.id === e.id;
	});
	if(timetableIndexIfAlreadySaved === -1){
		timetableListInMemory.push(currentTimetableData);
		addTimetableToList(currentTimetableData);
	}
	else{
		updateTimetable(currentTimetableData);
		timetableListInMemory[timetableIndexIfAlreadySaved] = currentTimetableData;
	}
	localStorage.setItem(localStorage_timetableList, JSON.stringify(timetableListInMemory));
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
			saveTimetable();
		}
	});
	newTimebrick__interface.addEventListener('touchstart', (e) => {
		if(isMoving){
			e.preventDefault();
			e.target.dispatchEvent(e);
			console.log(e.target);
		}
	});
	
	let newTimebrick__duration = document.createElement('p');
	newTimebrick__duration.classList.add('timebrick__duration');
	newTimebrick__duration.innerHTML = timebrickData.duration + ' min';
	newTimebrick__interface.appendChild(newTimebrick__duration);

	let newTimebrick__name = document.createElement('p');
	newTimebrick__name.classList.add('timebrick__name');
	newTimebrick__name.innerHTML = timebrickData.name;
	newTimebrick__interface.appendChild(newTimebrick__name);

	let button_removeTimebrick = document.createElement('button');
	button_removeTimebrick.innerHTML = 'X';
	button_removeTimebrick.classList.add('buttonRemove');
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
	saveTimetable();
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
	//e.preventDefault();

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
			timebrickEditor.setAttribute('data-new', 'no');
			document.body.setAttribute('data-page', 'timebrickEditor');
		}
	}
}


function moveTimebrick(e){
	//e.preventDefault();

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
	let timebrickToUpdate_content = timebrickToUpdate.childNodes[0].childNodes;

	for (let i = 0; i < timebrickToUpdate_content.length; i++) {
		if(timebrickToUpdate_content[i].classList.contains('timebrick__duration')){
			timebrickToUpdate_content[i].innerHTML = timebrickData.duration + ' min';
		}
		if(timebrickToUpdate_content[i].classList.contains('timebrick__name')){
			timebrickToUpdate_content[i].innerHTML = timebrickData.name;
		}
	}
	
	timebrickToUpdate.className = "";
	timebrickToUpdate.classList.add("timebrick");
	timebrickToUpdate.classList.add(timebrickData.class);
	
}


function checkTimebricksCoord(){
	let timebrickCoord;
	timebrickListDOM.forEach((e) => {
		if(e != movingBrick){
			timebrickCoord = e.getBoundingClientRect();

			if(currentClientY >= timebrickCoord.top || currentClientY <= timebrickCoord.bottom){
			}
		}
	});
}


function checkAgeParameter(){
	let currentAgeMin = parseInt(timetableParameter_ageMin.value);
	let currentAgeMax = parseInt(timetableParameter_ageMax.value);
	timetableParameterAgeDisplay.innerHTML = currentAgeMin + '-' + currentAgeMax + ' ans';
}

function setTimetableTitle(timetableDate){
	let timetableYear = timetableDate.slice(0,4);
	let timetableMonth = timetableDate.slice(5,7);
	let timetableDay = timetableDate.slice(8,10);

	timetableTitle.innerHTML = timetableDay + '/' + timetableMonth + '/' + timetableYear;
}