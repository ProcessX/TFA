const btn_toPortfolio = document.querySelector('.btn--toPortfolio');
const link_toPortfolio = document.querySelector('.vCard__description--link--portfolio');
const goBack = document.querySelector('.goBack');
const portfolio = document.querySelector('.portfolio');

btn_toPortfolio.addEventListener('click', togglePortfolio);
goBack.addEventListener('click', togglePortfolio);
link_toPortfolio.addEventListener('click', togglePortfolio);

function togglePortfolio(){
	portfolio.classList.toggle('portfolio--show');
}

