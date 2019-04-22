/*
Version 22-04-2019
Pour arranger le problème du clic relaché hors limite, on va placer tous les éléments dans une section.
Et c'est sur cette section que l'on va placer le addEventListener. Ensuite on vérifie si la cible de l'évenement est de class activityBlock.
*/

const myEvening = document.body.querySelector(".myEvening");
const blockContainer = document.body.querySelector(".container");
const button_addBlock = document.body.querySelector(".button--addBlock");
button_addBlock.addEventListener("click", addBlock);

let blockListBis = document.getElementsByClassName("activityBlock");//Puisque getElementsByClassName ne renvoit pas un array, on crée une var intermédiaire afin de recueillir les données.
var blockList = [];
for(let i = 0; i < blockListBis.length; i++){
	blockList.push(blockListBis[i]);
}

var howManyBlocks = 0;

const timeBeforeMovable = 900;
const timeBeforeClick = 100;

var justClicking = false;
var blockIsMoving = false;
var selectedBlock;
var movingTimer;

setMyEvening();
initBlockContainer();


function setMyEvening(){
	myEvening.addEventListener("mousedown", (e) => {
		if(e.target.classList.contains("activityBlock")){
			console.log("mousedown");
			justClicking = true;
			selectedBlock = e.target;
			movingTimer = setTimeout(startMovingTimer, timeBeforeClick);
		}
	});

	myEvening.addEventListener("mouseup", (e) => {
		console.log("mouseup");
		clearTimeout(movingTimer);
		if(justClicking){
			console.log("Just Clicking");
			console.log("Show block " + selectedBlock.getAttribute("data-activityID"));
		}
		else{
			if(blockIsMoving === true){
				blockIsMoving = false;
				console.log("Stop moving");
				selectedBlock.classList.toggle("activityBlock--moving");
			}
		}
	});
}


function setBlock(name){
	let newBlock = document.createElement("div");
	newBlock.classList.add("activityBlock");
	newBlock.setAttribute("data-activityID", "" + name);
	newBlock.innerHTML = name;

	//Pour échanger la place du bloc sélectionné et celui sous la souris.
	newBlock.addEventListener("mouseover", (e) => {
		if(blockIsMoving && e.currentTarget != selectedBlock){
			let selectedBlockOrder = selectedBlock.style.order;
			selectedBlock.style.order = e.currentTarget.style.order
			e.currentTarget.style.order = selectedBlockOrder;
		}
	});

	return newBlock;
}


function initBlockContainer(){
	for(let i = 0; i < 3; i++){
		addBlock();
	}
}


function addBlock(){
	howManyBlocks += 1;
	let newBlock = setBlock(howManyBlocks);
	newBlock.style.order = howManyBlocks;
	blockContainer.appendChild(newBlock);
}


function startMovingTimer(){
	justClicking = false;
	movingTimer = setTimeout(startMovingBlock, timeBeforeMovable);
}

function startMovingBlock(e){
	blockIsMoving = true;
	console.log("Moving " + selectedBlock.getAttribute("data-activityID"));
	selectedBlock.classList.toggle("activityBlock--moving");
}

