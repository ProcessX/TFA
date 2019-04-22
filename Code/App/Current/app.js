/*
Version 22-04-2019
Le déplacement fonctionne, mais si le curseur est relaché hors de la zone du container, ça fout la merde.
La prochaine version devra régler ça.
*/

const blockContainer = document.body.querySelector(".container");
const button_addBlock = document.body.querySelector(".button--addBlock");
button_addBlock.addEventListener("click", addBlock);

let blockListBis = document.getElementsByClassName("activityBlock");//Puisque getElementsByClassName ne renvoit pas un array, on crée une var intermédiaire afin de recueillir les données.
var blockList = [];
for(let i = 0; i < blockListBis.length; i++){
	blockList.push(blockListBis[i]);
}

var howManyBlocks = 0;

initBlockContainer();



function setBlock(name){
	let newBlock = document.createElement("div");
	newBlock.classList.add("activityBlock");
	newBlock.setAttribute("data-activityID", "" + name);
	newBlock.innerHTML = name;

	newBlock.addEventListener("mousedown", (e) => {
		console.log("mousedown");
		justClicking = true;
		selectedBlock = e.currentTarget;
		movingTimer = setTimeout(startMovingTimer, timeBeforeClick);
	});

	newBlock.addEventListener("mouseup", (e) => {
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










//GESTION DU CLICK
//Ici ne fonctionne que si les blocs existent dès le départ.


//Temps à passer le clic enfoncé sur un bloc pour pouvoir le faire bouger.
const timeBeforeMovable = 900;
const timeBeforeClick = 100;

var justClicking = false;
var blockIsMoving = false;
var selectedBlock;
var movingTimer;

//Les events pour gérer le click. Si il ne s'agit que d'une pression rapide, on a un click simple. Si on garde le click enfoncé assez longtemps, on passe en mode Déplacement de bloc.
blockList.forEach((block) => {
	block.addEventListener("mousedown", (e) => {
		console.log("mousedown");
		justClicking = true;
		selectedBlock = e.currentTarget;
		movingTimer = setTimeout(startMovingTimer, timeBeforeClick);
	});

	block.addEventListener("mouseup", (e) => {
		console.log("mouseup");
		clearTimeout(movingTimer);
		if(justClicking){
			console.log("Just Clicking");
			console.log("Show " + selectedBlock.getAttribute("data-activityID"));
		}
		else{
			if(blockIsMoving === true){
				blockIsMoving = false;
				console.log("Stop moving");
				selectedBlock.classList.toggle("activityBlock--moving");
			}
		}
	});
});

function startMovingTimer(){
	justClicking = false;
	movingTimer = setTimeout(startMovingBlock, timeBeforeMovable);
}

function startMovingBlock(e){
	blockIsMoving = true;
	console.log("Moving " + selectedBlock.getAttribute("data-activityID"));
	selectedBlock.classList.toggle("activityBlock--moving");
}

