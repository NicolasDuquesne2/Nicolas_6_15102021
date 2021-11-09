/* eslint-disable no-use-before-define */
/* At loading page */
let photographersArray = [];

/* merges arrays from objects and returns an array with unique values */
function mergeArraysAndGetUnique(objects) {
  let uniqueArray = [];
  objects.forEach((element) => {
    const tagsArray = element.tags;
    uniqueArray = Array.from(new Set(uniqueArray.concat(tagsArray)));
  });
  return uniqueArray;
}

/* filterByTag filters photographers by tag */

function filterByTag(tag) {
  return photographersArray.filter((photographer) => photographer.tags.includes(tag));
}

/* displayByTag */

function displayByTag(tag) {
  const photographersByTag = filterByTag(tag);
  printCards(photographersByTag);
}

/* addEventList adds event listener to html elements */

function addEventList(clas, events) {
  const tagElements = document.querySelectorAll(clas);
  tagElements.forEach((tag) => {
    events.forEach((evt) => {
      tag.addEventListener(evt, (e) => {
        displayByTag(e.currentTarget.id);
      });
    });
  });
}

/* printTags displays tags model in the html with datas */
function printTags(objects) {
  const tagHtmlUl = document.querySelector('#main-tags-list');
  let tagHtmlModel = '';
  objects.forEach((element, index) => {
    tagHtmlModel += `<li class="photographer-tag" id=${element} tabindex=${index}><span aria-label="${element}">#${element}</span></li>`;
  });
  tagHtmlUl.innerHTML = tagHtmlModel;
}

/* print cards displays cards model in the html with datas */

function printCards(objects) {
  const cardsWrapper = document.querySelector('.cards-wrapper');
  let cardhtmlModel = '';
  objects.forEach((element) => {
    cardhtmlModel += `<div class="card-wrapper">
                        <div class="card">
                            <a href="photographer.html?id=${element.id}&name=${element.name}" class="profile-link">
                                <img src="media/img/Photographers ID Photos/${element.portrait}" class="profile-img-big">
                                <h2 class="profile-card-title">${element.name}</h2>
                            </a>
                            <div class="card-text">
                                <p class="profile-loc-text">${element.city}, ${element.country}</p>
                                <p class="profile-tagline">${element.tagline}</p>
                                <p class="profile-price">${element.price}€/jour</p>
                            </div>
                            <nav class="profile-index-nav" id="profile-nav" role="navigation" aria-label="photogrpaher categories">
                                <ul class="tags-list">`;
    element.tags.forEach((tag) => {
      cardhtmlModel += `<li class="photographer-tag" id=${tag}><span aria-label="${tag}">#${tag}</span></li>`;
    });
    cardhtmlModel += '</ul></nav></div></div>';
  });
  cardsWrapper.innerHTML = cardhtmlModel;
  addEventList('.photographer-tag', ['click', 'keypress']);
}

/* lauches the display process according type given */
function printObjects(objects, type) {
  switch (type) {
    case 'tags':
      printTags(objects);
      break;
    case 'cards':
      printCards(objects);
      break;
    default:
  }
}

async function displayDynamics(url, tag) {
  try {
    const response = await fetch(url);
    const objects = await response.json();
    photographersArray = [...objects.photographers];
    let photographersInput = [];
    if (tag) {
      photographersInput = filterByTag(tag);
    } else {
      photographersInput = photographersArray;
    }
    const tags = mergeArraysAndGetUnique(photographersArray);
    printObjects(tags, 'tags');
    printObjects(photographersInput, 'cards');
    addEventList('.photographer-tag', ['click', 'keypress']);
  } catch (error) {
    alert(error.message);
  }
  return true;
}

/* observer is used to display the button to return on the top of the main
if the main title is not visible yet.
The button disappear when the title is visible  */

const observer = new IntersectionObserver((entries) => {
  const mainAnchorWrapper = document.querySelector('.main-anchor-wrapper');
  if (entries[0].intersectionRatio === 0) {
    mainAnchorWrapper.classList.remove('not-visible');
  } else {
    mainAnchorWrapper.classList.add('not-visible');
  }
}, { threshold: [0] });

displayDynamics('./db/photographers.json');

observer.observe(document.querySelector('.main-title'));

function run() {
  try {
    const queryStringUrlId = window.location.search;
    const searchParamsId = new URLSearchParams(queryStringUrlId);
    const tag = searchParamsId.get('tag');
    displayDynamics('./db/photographers.json', tag);
    observer.observe(document.querySelector('.main-title'));
  } catch (error) {
    alert(error.message);
  }
}

run();
