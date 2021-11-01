/* At loading page */

/* merges arrays from objects and returns an array with unique values */
function mergeArraysAndGetUnique(objects) {
  let uniqueArray = [];
  objects.forEach((element) => {
    const tagsArray = element.tags;
    uniqueArray = Array.from(new Set(uniqueArray.concat(tagsArray)));
  });
  return uniqueArray;
}

/* printTags displays tags model in the html with datas */
function printTags(objects) {
  const tagHtmlUl = document.querySelector('#main-tags-list');
  let tagHtmlModel = '';
  objects.forEach((element) => {
    tagHtmlModel += `<li><a href="html/hashtags/${element}.html" class="main-tag-link"><span aria-label="${element}">#${element}</span></a></li>`;
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
                            <a href="photographer.html" class="profile-link">
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
      cardhtmlModel += `<li><a href="html/hashtags/${element.tag}.html" class="lower-tag-link"><span aria-label="${tag}">#${tag}</span></a></li>`;
    });

    cardhtmlModel += '</ul></nav></div></div>';
  });
  cardsWrapper.innerHTML = cardhtmlModel;
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

async function displayDynamics(url) {
  try {
    const response = await fetch(url);
    const objects = await response.json();
    const tags = mergeArraysAndGetUnique(objects.photographers);
    printObjects(tags, 'tags');
    printObjects(objects.photographers, 'cards');
  } catch (error) {
    alert(error.message);
  }
  return true;
}

displayDynamics('./db/photographers.json');
