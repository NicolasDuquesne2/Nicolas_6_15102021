/* eslint-disable no-unused-vars */
/* At loading page */

let photographerId = '';
let photographerName = '';
let mediasByPhotogId = [];

/* filterObjectsById returns objects according to porperty and id,
were id is a number */

function filterObjectsById(objects, id, property) {
  const filtPhotoArr = objects.filter((object) => object[property] === Number(id));
  return filtPhotoArr;
}

/* sortObjectsById */
function sortObjectsById(objects, property) {
  let sortObjects = [];

  if (typeof (objects[0][property]) === 'string') {
    sortObjects = objects.sort((a, b) => a[property].localeCompare(b[property]));
  } else {
    sortObjects = objects.sort((a, b) => b[property] - a[property]);
  }
  return sortObjects;
}

/* getContiguousIndex returns an array with tab indexes of an object and its contiguous objects */

function getContiguousIndex(array, attribute) {
  const lastArrayIndex = array.length - 1;
  const objectIndex = array.findIndex((element) => element.id === Number(attribute));
  const indexes = {};
  switch (objectIndex) {
    case 0:
      indexes.currIndex = objectIndex;
      indexes.nextIndex = objectIndex + 1;
      break;
    case lastArrayIndex:
      indexes.currIndex = objectIndex;
      indexes.prevIndex = objectIndex - 1;
      break;
    default:
      indexes.currIndex = objectIndex;
      indexes.prevIndex = objectIndex - 1;
      indexes.nextIndex = objectIndex + 1;
  }
  return indexes;
}

/* createLightBox */

function createLightBox(object) {
  return {
    build() {
      let htmlObject = '';
      const med = object.media[0];
      const indexesObj = object.indexes;
      const type = med.image ? 'image' : 'video';
      const photographName = photographerName.split(' ');

      if (Object.prototype.hasOwnProperty.call(indexesObj, 'prevIndex')) {
        htmlObject += `<input class="prev-button" id=${indexesObj.prevIndex} type="button">
                       <label class="prev-label" for=${indexesObj.prevIndex}></label>`;
      }

      switch (type) {
        case 'image':
          htmlObject += `<img class="gallery-image"
                            id="${med.id}"
                            src="./media/img/${photographName[0]}/${med.image}">`;
          break;
        case 'video':
          htmlObject += `<${type} 
                            class="gallery-video"
                            id="${med.id}"
                            controls>
                              <source src="./media/video/${photographName[0]}/${med.video}">
                          </${type}>`;
          break;
        default:
      }

      if (Object.prototype.hasOwnProperty.call(indexesObj, 'nextIndex')) {
        htmlObject += `<input class="next-button" id=${indexesObj.nextIndex} type="button">
                       <label class="next-label" for=${indexesObj.nextIndex}></label>`;
      }

      htmlObject += '<button class="form-close light-close" type="button"></button>';

      return htmlObject;
    },
  };
}

/* createGalleryHtml creates the right html according the type of object.
Returns a html object to build */

function createGalleryHtml(objects) {
  return {
    build() {
      let htmlObject = '';
      objects.forEach((object) => {
        const photographName = photographerName.split(' ');
        const type = object.image ? 'image' : 'video';
        htmlObject += '<div class="media-wrapper">';
        switch (type) {
          case 'image':
            htmlObject += `<img class="gallery-image"
                            id="${object.id}"
                            src="./media/img/${photographName[0]}/${object.image}"
                            onkeydown ="return onMediaSelect(event)"
                            onclick="return onMediaSelect(event)"
                            tabindex=0>`;
            break;
          case 'video':
            htmlObject += `<${type} 
                            class="gallery-video"
                            id="${object.id}"
                            controls
                            onkeydown ="return onMediaSelect(event)"
                            onclick="return onMediaSelect(event)"
                            tabindex=0>
                              <source src="./media/video/${photographName[0]}/${object.video}">
                          </${type}>`;
            break;
          default:
        }
        htmlObject += `<div class="media-text-wrapper">
                          <p class="media-title">${object.title}</p>
                          <p class="media-price">${object.price}€</p>
                          <p class="likes-text">${object.likes}</p>
                          <label class="heart-label" for="input${object.id}">
                            <svg class="heart-svg" fill="false">
                              <use xlink:href="#heart-solid"></use>
                            </svg>
                          </label>
                          <input class="like-input" type="checkbox" id="input${object.id}" name="likes" onchange="return onHeartCheckBox(event)">
                      </div>
                    </div>`;
      });
      return htmlObject;
    },
  };
}

/* printMedias build images or videos with calling the object factory createMediaHtml */

function printMedias(objects, wrapper) {
  const mediasWrapper = wrapper;
  mediasWrapper.innerHTML = '';
  let htmlMedia = null;

  switch (mediasWrapper.className) {
    case 'light-box':
      htmlMedia = createLightBox(objects);
      break;
    case 'medias-wrapper':
      htmlMedia = createGalleryHtml(objects);
      break;
    default:
  }
  mediasWrapper.innerHTML += htmlMedia.build();
}

/* print cards displays cards model in the html with datas */

function printCards(objects, wrapper) {
  const cardsWrapper = wrapper;
  let cardhtmlModel = '';
  objects.forEach((element) => {
    cardhtmlModel += `<div class="id-wrapper">
                          <div class="card">
                              <h2 class="profile-card-title">${element.name}</h2>
                              <p class="profile-loc-text">${element.city}, ${element.country}</p>
                              <p class="profile-tagline">${element.tagline}</p>
                              <nav class="profile-index-nav" id="profile-nav" role="navigation" aria-label="photogrpaher categories">
                                  <ul class="tags-list">`;
    element.tags.forEach((tag) => {
      cardhtmlModel += `<li><a href="./index.html?tag=${tag}" class="photographer-tag"><span aria-label="${tag}">#${tag}</span></a></li>`;
    });
    cardhtmlModel += `</ul>
                </nav>
          </div>
          <img src="./media/img/Photographers ID Photos/${element.portrait}" class="profile-img-big">
    </div>`;
  });
  cardsWrapper.innerHTML = cardhtmlModel;
}
/* launches the display process according type given */
function printObjects(objects, type, wrapper) {
  switch (type) {
    case 'medias':
      printMedias(objects, wrapper);
      break;
    case 'cards':
      printCards(objects, wrapper);
      break;
    default:
  }
}

/* main displaying function. gets the json file, parse it into js objects,
get photographer by id and medias belonging to the photographer
launches prints */

async function displayDynamics(url, id) {
  try {
    const response = await fetch(url);
    const objects = await response.json();
    const photographersById = filterObjectsById(objects.photographers, id, 'id');
    mediasByPhotogId = filterObjectsById(objects.media, id, 'photographerId');
    const sortedMedias = sortObjectsById(mediasByPhotogId, 'likes');
    const cardsWrapper = document.querySelector('.card-wrapper');
    const mediasWrapper = document.querySelector('.medias-wrapper');
    printObjects(photographersById, 'cards', cardsWrapper);
    printObjects(sortedMedias, 'medias', mediasWrapper);
  } catch (error) {
    alert(error.message);
  }
  return true;
}

/* modifyClassAttrList lets adding or removing class attribute */

function modifyClassAttrList(object, modifOption, atrr) {
  switch (modifOption) {
    case 'add':
      object.classList.add(atrr);
      break;
    case 'remove':
      object.classList.remove(atrr);
      break;
    default:
  }
}

/* addEventList adds event listener to html elements for the modifyClassAttrList function */

function addEventList(object, evts, params) {
  evts.forEach((evt) => {
    object.addEventListener(evt, () => {
      modifyClassAttrList(params[0], params[1], params[2]);
    });
  });
}

/* setObserver let to add or remove class attribute on modified html
from observee's viewing degree  */

function setObserver(observee, modified, modificator) {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].intersectionRatio === 0) {
      modified.classList.remove(modificator);
    } else {
      modified.classList.add(modificator);
    }
  }, { threshold: [0] });
  observer.observe(observee);
}

/* the primary runing function. all loading page routines are here */

function run() {
  try {
    const queryStringUrlId = window.location.search;
    const searchParamsId = new URLSearchParams(queryStringUrlId);
    photographerId = searchParamsId.get('id');
    photographerName = searchParamsId.get('name');
    displayDynamics('./db/photographers.json', photographerId);
    const cardWrapper = document.querySelector('.card-wrapper');
    const modalButton = document.querySelector('.modal-button');
    const modal = document.querySelector('.form-wrapper');
    const closeModal = document.querySelector('.form-close');
    setObserver(cardWrapper, modalButton, 'not-visible');
    addEventList(modalButton, ['click', 'keypress'], [modal, 'remove', 'not-visible']);
    addEventList(closeModal, ['click', 'keypress'], [modal, 'add', 'not-visible']);
  } catch (error) {
    alert(error.message);
  }
}

run();

/* events functions */

/* onRadioButtonFocus */

function onRadioButtonfocus(event) {
  event.stopPropagation();
  event.preventDefault();
  const radioButton = event.target;
  const sortedMedias = sortObjectsById([...mediasByPhotogId], radioButton.id);
  printMedias(sortedMedias);
}

/* onHeartCheckBox adds a like and turn the heart svg attribute fill into true
if the button is checked. Do the opposite operation if the button is unchecked */

function onHeartCheckBox(event) {
  event.stopPropagation();
  event.preventDefault();
  const checkButton = event.target;
  const checkLabel = checkButton.labels[0];
  const heartSVG = checkLabel.children[0];
  const likeLabel = checkButton.parentElement.children[2];
  let likeLabelValue = Number(likeLabel.innerText);

  if (checkButton.checked) {
    heartSVG.setAttribute('fill', 'true');
    likeLabelValue += 1;
  } else {
    heartSVG.setAttribute('fill', 'false');
    likeLabelValue -= 1;
  }

  likeLabel.innerText = String(likeLabelValue);
}

/* onMediaFocus */

function onMediaSelect(event) {
  if (event.code === 'Enter' || event.type === 'click') {
    event.preventDefault();
    event.stopPropagation();
    const media = event.target;
    const mediaInDb = filterObjectsById([...mediasByPhotogId], media.id, 'id');
    const mediaAdjIndex = getContiguousIndex([...mediasByPhotogId], media.id);
    const mediaPack = {
      media: mediaInDb,
      indexes: mediaAdjIndex,
    };
    const targetedWrapper = document.querySelector('.light-box');
    printObjects(mediaPack, 'medias', targetedWrapper);
  }
}
