const btn_openMenu = document.querySelector('.btn--burgerMenu');
const menu = document.querySelector('.menu');
const overlayToApp = document.querySelector('.overlayToApp');
const linksToApp = document.getElementsByClassName('toApp');

console.log(linksToApp);

btn_openMenu.addEventListener('click', (e) => {
	btn_openMenu.classList.toggle('btn--burgerMenu--open');
	menu.classList.toggle('menu--show');
});

for(let i = 0; i < linksToApp.length; i++){
	linksToApp[i].addEventListener('click', goToApp);
}

function goToApp(){
	console.log('Go To App');
	overlayToApp.classList.toggle('overlayToApp--anim');
	let timer = setTimeout((e) => {
		window.location.pathname = '/projets/tfa/project';
	}, 700);
}