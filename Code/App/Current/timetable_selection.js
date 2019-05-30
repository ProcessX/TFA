/*---------------------------CONST-------------------------------------------------------------------------*/
const timetableList = document.querySelector(".timetable__li");

const button_createNewTimetable = document.querySelector(".buttonAdd--createNewTimetable");

const localStorage_timetableList = "timetableList";

const monthAbbreviation = ['JAN', 'FEV', 'MAR', 'AVR', 'MAI', 'JUN', 'JUL', 'AOU', 'SEP', 'OCT', 'NOV', 'DEC'];



/*---------------------------VAR-------------------------------------------------------------------------*/

var timetableCounter;
var timetableListDOM = [];




/*---------------------------INIT-------------------------------------------------------------------------*/

button_createNewTimetable.addEventListener("click", (e) => {
	let newTimetableData = Object.create(timetableData_base);
	newTimetableData.id = timetableCounter;//Possiblement va changer.
	newTimetableData.content = [];
	newTimetableData.title = "Ma timetable " + timetableCounter;
	setTimetable(newTimetableData);
	timetableSetter.classList.remove('timetable__setter--hidden');
	console.log(timetableSetter.classList);
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
		let i;
		for(i = 0; i < timetableListInMemory.length; i++)
			addTimetableToList(timetableListInMemory[i]);
		if(timetableListInMemory.length > 0)
			timetableCounter = timetableListInMemory[i-1].id + 1;
	}
}


//Ajoute une Timetable dans le DOM, correspondante aux données passées en paramètre.
function addTimetableToList(timetableData){
	timetableCounter += 1;

	let newTimetable = document.createElement("li");
	newTimetable.classList.add("timetable__el");
	newTimetable.setAttribute("data-timetable-id", timetableData.id);
	newTimetable.addEventListener("click", (e) => {
		let timetableId = parseInt(e.target.getAttribute("data-timetable-id"));
		let newTimetableData = getTimetableById(timetableId);
		setTimetable(newTimetableData);
		document.body.setAttribute("data-page", "timetableEditor");
	});

	let newTimetable__dateEmplacement = document.createElement('div');
	newTimetable__dateEmplacement.classList.add('timetable__dateEmplacement');

	let newTimetable__date = document.createElement('p');
	newTimetable__date.classList.add('timetable__date');
	let timetableYear = timetableData.date.slice(0,4);
	let timetableMonth = monthAbbreviation[parseInt(timetableData.date.slice(5,7)) - 1];
	let timetableDay = timetableData.date.slice(8,10);
	newTimetable__date.innerHTML = `<span class='timetable__date__day'>${timetableDay} </span><span class='timetable__date__month'>${timetableMonth} </span>${timetableYear}`;

	newTimetable__dateEmplacement.appendChild(newTimetable__date);	
	newTimetable.appendChild(newTimetable__dateEmplacement);

	let newTimetable__condensation = document.createElement('div');
	newTimetable__condensation.classList.add('timetable__condensation');

	let newTimetable__duration = document.createElement('p');
	newTimetable__duration.classList.add('timetable__duration');
	newTimetable__duration.innerHTML = timetableData.startTime + ' - ' + timetableData.endTime;
	newTimetable__condensation.appendChild(newTimetable__duration);

	let newTimetable__detail = document.createElement('div');
	newTimetable__detail.classList.add('timetable__detail');

	let newTimetable__age = document.createElement('p');
	newTimetable__age.classList.add('timetable__age');
	newTimetable__age.innerHTML = timetableData.ageMin + ' - ' + timetableData.ageMax + ' ans';
	newTimetable__detail.appendChild(newTimetable__age);

	let newTimetable__theme = document.createElement('p');
	newTimetable__theme.classList.add('timetable__theme');
	newTimetable__theme.innerHTML = timetableData.theme;;
	newTimetable__detail.appendChild(newTimetable__theme);

	newTimetable__condensation.appendChild(newTimetable__detail);

	let newTimetable__summary = document.createElement('p');
	newTimetable__summary.classList.add('timetable__summary');
	newTimetable__summary.innerHTML = timetableData.summary;

	newTimetable__condensation.appendChild(newTimetable__summary);

	newTimetable.appendChild(newTimetable__condensation);

	let button_removeTimetable = document.createElement("button");
	button_removeTimetable.innerHTML = "X";
	button_removeTimetable.classList.add('buttonRemove', 'buttonRemove--timetable')
	button_removeTimetable.addEventListener("click", (e) => {
		e.stopPropagation();
		removeTimetableFromList(newTimetable);
	});
	newTimetable.appendChild(button_removeTimetable);

	timetableList.appendChild(newTimetable);

	timetableListDOM.push(newTimetable);
}


//Retire une Timetable du DOM et de la mémoire, correspondante aux données passées en paramètre.
function removeTimetableFromList(timetableToRemove){
	timetableList.removeChild(timetableToRemove);
	let timetableToRemoveId = timetableToRemove.getAttribute("data-timetable-id");
	let timetableListInMemory = JSON.parse(localStorage.getItem(localStorage_timetableList));
	timetableListInMemory = timetableListInMemory.filter((e) => {
		return e.id != timetableToRemoveId;
	});
	localStorage.setItem(localStorage_timetableList, JSON.stringify(timetableListInMemory));

	timetableListDOM = timetableListDOM.filter((e) =>{
		return e != timetableToRemove;
	})
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


function updateTimetable(timetableData){
	console.log(timetableData);
	let timetableYear = timetableData.date.slice(0,4);
	let timetableMonth = monthAbbreviation[parseInt(timetableData.date.slice(5,7)) - 1];
	let timetableDay = timetableData.date.slice(8,10);

	timetableListDOM.forEach((e) => {
		if (parseInt(e.getAttribute('data-timetable-id')) === timetableData.id) {
			//Update les données;
			let timetableChild = e.childNodes;
			let timetableGrandchild;
			timetableChild.forEach((child) => {
				timetableGrandchild = child.childNodes;
				if(child.classList.contains('timetable__dateEmplacement')){
					timetableGrandchild.forEach((grandchild) => {
						if(grandchild.classList.contains('timetable__date')){
							grandchild.innerHTML = `<span class='timetable__date__day'>${timetableDay} </span><span class='timetable__date__month'>${timetableMonth} </span>${timetableYear}`;
						}
					});
				}

				if(child.classList.contains('timetable__condensation')){
					timetableGrandchild.forEach((grandchild) => {
						if(grandchild.classList.contains('timetable__duration')){
							grandchild.innerHTML = timetableData.startTime + ' - ' + timetableData.endTime;
						}
						if(grandchild.classList.contains('timetable__detail')){
							let timetableGrandgrandchild = grandchild.childNodes;
							timetableGrandgrandchild.forEach((grandgrandchild) => {
								if(grandgrandchild.classList.contains('timetable__age')){
									grandgrandchild.innerHTML = timetableData.ageMin + ' - ' + timetableData.ageMax + ' ans';
								}
								if(grandgrandchild.classList.contains('timetable__theme')){
									grandgrandchild.innerHTML = timetableData.theme;
								}
							})
						}
						if(grandchild.classList.contains('timetable__summary')){
							grandchild.innerHTML = timetableData.summary;
						}
					});
				}

			})
			//Supprimer l'élement de la liste DOM.
		}
	});
}