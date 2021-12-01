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

/* sortObjectsById returns an array of sorted objects by text, date and others */

function sortObjectsById(objects, property) {
  let sortObjects = [];

  if (property === 'title') {
    sortObjects = objects.sort((a, b) => a[property].localeCompare(b[property]));
  } else if (property === 'dates') {
    sortObjects = objects.sort((a, b) => new Date(b.date) - new Date(a.date));
  } else {
    sortObjects = objects.sort((a, b) => b[property] - a[property]);
  }
  return sortObjects;
}

/* getContiguousId returns an array with object's id  and its contiguous object's id */

function getContiguousId(array, attribute) {
  const lastArrayIndex = array.length - 1;
  let objectIndex = null;
  objectIndex = array.findIndex((element) => element.id === Number(attribute.value));
  const ids = {};

  switch (objectIndex) {
    case 0:
      ids.currId = attribute.value;
      ids.nextId = array[objectIndex + 1].id;
      break;
    case lastArrayIndex:
      ids.currId = attribute.value;
      ids.prevId = array[objectIndex - 1].id;
      break;
    default:
      ids.currId = attribute.value;
      ids.prevId = array[objectIndex - 1].id;
      ids.nextId = array[objectIndex + 1].id;
  }
  return ids;
}

/* getSummOn returns a summ on attributes of an objects collection */

function getSummOn(objects, attribute) {
  return objects.reduce((summ, object) => (summ + object[attribute]), 0);
}

/* createLightBox build a ligth box and select pics or videos html according to the object type */

function createLightBox(object) {
  return {
    build() {
      let htmlObject = '';
      const med = object.media;
      const idsObj = object.indexes;
      const type = med.image ? 'image' : 'video';
      const photographName = photographerName.split(' ');

      htmlObject += '<div class="image-wrapper">';

      if (Object.prototype.hasOwnProperty.call(idsObj, 'prevId')) {
        htmlObject += `<button 
                        class="prev-button" 
                        id="${idsObj.prevId}"
                        onclick="return onlightButton(event)"
                        onkeydown="return onlightButton(event)"
                        tabindex=0
                        aria-label="Image précédente">
                       </button>`;
      }

      switch (type) {
        case 'image':
          htmlObject += `<img class="light-image"
                            id="${med.id}"
                            alt="image ${med.title}"
                            tabindex=0
                            src="./media/img/${photographName[0]}/${med.image}">`;
          break;
        case 'video':
          htmlObject += `<${type} 
                            class="light-video"
                            id="${med.id}"
                            controls
                            tabindex=0>
                            aria-label=" vidéo ${med.title}">
                              <source src="./media/video/${photographName[0]}/${med.video}">
                          </${type}>`;
          break;
        default:
      }

      if (Object.prototype.hasOwnProperty.call(idsObj, 'nextId')) {
        htmlObject += `<button 
                        class="next-button" 
                        id="${idsObj.nextId}"
                        onclick="return onlightButton(event)"
                        onkeydown="return onlightButton(event)"
                        aria-label="Prochaine image"
                        tabindex=0>
                      </button>`;
      }

      htmlObject += `<button 
        class="form-close light-close"
        aria-label="Fermer dialogue"
        tabindex=0
        onclick="return onClose(event)"
        onkeydown="return onClose(event)>"
      </button>`;

      htmlObject += '</div>';
      htmlObject += `<p class="light-box-title">${med.title}</p>`;

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
                            aria-label="${object.describ}"
                            tabindex=0>`;
            break;
          case 'video':
            htmlObject += `<${type} 
                            class="gallery-video"
                            id="${object.id}"
                            onkeydown ="return onMediaSelect(event)"
                            onclick="return onMediaSelect(event)"
                            aria-label="${object.describ}"
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
                          <input 
                          class="like-input" 
                          type="checkbox"
                          tabindex="0"
                          id="input${object.id}" 
                          name="likes"
                          onclick="return onHeartCheckBox(event)"
                          onkeydown="return onHeartCheckBox(event)">
                          <label class="heart-label" for="input${object.id}" aria-label="likes">
                            <svg class="heart-svg" fill="false">
                              <use xlink:href="#heart-solid"></use>
                            </svg>
                          </label>
                      </div>
                    </div>`;
      });
      return htmlObject;
    },
  };
}

/* Is a factory.
printMedias build images or videos with calling the object factory createMediaHtml */

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
          <button 
            class="modal-button" 
            type="button"
            onclick="return openModal(event)">Contactez-moi</button>
          <img src="./media/img/Photographers ID Photos/${element.portrait}" class="profile-img-big" alt="photo de ${element.name}">
    </div>`;
  });
  cardsWrapper.innerHTML = cardhtmlModel;
}

/* printWidgets builds the widget sticked bottom right with total likes and price per day */

function printWidgets(widgetStats, wrapper) {
  const widgetWrapper = wrapper;
  let htmlObject = '';

  htmlObject += `<div class="widg-likes-wrapper">
                    <p class="widg-likes-text">${widgetStats.likes}</p>
                    <svg class="widg-heart-svg" fill="false" aria-label="likes">
                      <use xlink:href="#heart-solid"></use>
                    </svg>
                 </div>
                 <p>${widgetStats.price}€/jour</p>`;

  widgetWrapper.innerHTML = htmlObject;
}

/* printHead : prints the head title with photograph name */

function printHead(objects, wrapper) {
  const headTitle = wrapper;
  objects.forEach((element) => {
    headTitle.innerHTML = `Fisheye - photographe : ${element.name}`;
  });
}

/* printForm */

function printForm(objects, wrapper) {
  const mailForm = wrapper;
  const hidenInputId = wrapper.querySelector('#id');
  const hidenInputName = wrapper.querySelector('#name');
  objects.forEach((element) => {
    hidenInputId.setAttribute('value', `${element.id}`);
    hidenInputName.setAttribute('value', `${element.name}`);
  });
}

/* Is a factory. launches the display process according a given type */
function printObjects(objects, type, wrapper) {
  switch (type) {
    case 'medias':
      printMedias(objects, wrapper);
      break;
    case 'cards':
      printCards(objects, wrapper);
      break;
    case 'widget':
      printWidgets(objects, wrapper);
      break;
    case 'head':
      printHead(objects, wrapper);
      break;
    case 'form':
      printForm(objects, wrapper);
      break;
    default:
  }
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

/* main displaying function. gets the json file, parse it into js objects,
get photographer by id and medias belonging to the photographer
launches prints */

async function displayDynamics(url, urlParams) {
  try {
    const response = await fetch(url);
    const objects = await response.json();
    const photographersById = filterObjectsById(objects.photographers, urlParams.id, 'id');
    mediasByPhotogId = filterObjectsById(objects.media, urlParams.id, 'photographerId');
    const sortedMedias = sortObjectsById(mediasByPhotogId, 'likes');
    const summLikes = getSummOn(sortedMedias, 'likes');
    const widgetStats = {
      likes: summLikes,
      price: photographersById[0].price,
    };
    const cardsWrapper = document.querySelector('.card-wrapper');
    const mediasWrapper = document.querySelector('.medias-wrapper');
    const widgetWrapper = document.querySelector('.stats-widget');
    const headTitle = document.querySelector('head > title');
    const mailForm = document.querySelector('.contact-form');
    printObjects(photographersById, 'cards', cardsWrapper);
    printObjects(photographersById, 'head', headTitle);
    printObjects(photographersById, 'form', mailForm);
    printObjects(sortedMedias, 'medias', mediasWrapper);
    printObjects(widgetStats, 'widget', widgetWrapper);
    const cardWrapper = document.querySelector('.card-wrapper');
    const modalButton = document.querySelector('.modal-button');
    setObserver(cardWrapper, modalButton, 'not-visible');
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

/* return an object with URL parameters */

function getURLParams(urlSearchPar, params) {
  const urlParamsObject = {};
  params.forEach((param) => {
    if (typeof (urlSearchPar.get(param)) !== 'undefined') {
      urlParamsObject[param] = urlSearchPar.get(param);
    }
  });

  return urlParamsObject;
}

/* displayFormResultConsole prints form inputs values after send */

function displayFormResultConsole(urlParams, params) {
  /* uses urlParams, an object with form values sent */
  params.forEach((param) => {
    if (Object.prototype.hasOwnProperty.call(urlParams, param)) {
      console.log(urlParams[param]);
    }
  });
}

/* the primary runing function. all loading page routines are here */

function run() {
  try {
    const queryStringUrlId = window.location.search;
    const searchParamsId = new URLSearchParams(queryStringUrlId);
    const urlParams = getURLParams(searchParamsId, ['id', 'name', 'firstname', 'lastname', 'email', 'message']);
    photographerId = urlParams.id;
    photographerName = urlParams.name;
    displayDynamics('./db/photographers.json', urlParams);
    displayFormResultConsole(urlParams, ['firstname', 'lastname', 'email', 'message']);
  } catch (error) {
    alert(error.message);
  }
}

run();

/* events functions */

/* onTabInModal : intercepts tab focuses in modals
in order to navigate in modals until modals are closed by user */

const onTabInModal = (event) => {
  if (event.code === 'Tab') {
    const wrapper = event.currentTarget;
    const targElmt = event.target;
    let focusableElements = null;

    if (wrapper.className === 'light-bg') { // focusable elements changes according to the wrapper
      focusableElements = 'button, video';
    } else if (wrapper.className === 'dial-bg') {
      focusableElements = 'button, input, textarea';
    }

    // first focusable element
    const firstFocusable = wrapper.querySelectorAll(focusableElements)[0];
    // all focusable elements
    const allFocusable = wrapper.querySelectorAll(focusableElements);
    // last focusable element
    const lastFocusable = allFocusable[allFocusable.length - 1];

    if (event.shiftKey) { // If shift key pressed for shift + tab
      if (targElmt === firstFocusable) {
        lastFocusable.focus();
        event.preventDefault();
      }
    } else { // only tab key pressed
      // eslint-disable-next-line no-lonely-if
      if (targElmt === lastFocusable) {
        firstFocusable.focus();
        event.preventDefault();
      }
    }
  }
};
/* openModal */

function openModal(event) {
  if (event.code === 'Enter' || event.type === 'click') {
    const modal = document.querySelector('.dial-bg');
    modifyClassAttrList(modal, 'remove', 'not-visible');
    const firstName = modal.querySelector('input');
    modal.addEventListener('keydown', onTabInModal, true);
    firstName.focus();
  }
}

/* closeByEsc */

function closeByEsc(event) {
  if (event.code === 'Escape') {
    const elementToClose = event.target;
    elementToClose.removeEventListener('keydown', onTabInModal, true);
    modifyClassAttrList(elementToClose, 'add', 'not-visible');
  }
}

/* onRadioButtonFocus */

function onRadioButtonfocus(event) {
  if (event.code === 'ArrowDown' || event.code === 'ArrowUp' || event.type === 'click') {
    event.stopPropagation();
    const radioButton = event.target;
    const sortedMedias = sortObjectsById(mediasByPhotogId, radioButton.id);
    const mediasWrapper = document.querySelector('.medias-wrapper');
    printObjects(sortedMedias, 'medias', mediasWrapper);
  }
}

/* onHeartCheckBox adds a like and turn the heart svg attribute fill into true
if the button is checked. Do the opposite operation if the button is unchecked */

function onHeartCheckBox(event) {
  if (event.type === 'click') {
    event.stopPropagation();
    const checkButton = event.target;
    const checkLabel = checkButton.labels[0];
    const heartSVG = checkLabel.children[0];
    const likeLabel = checkButton.parentElement.children[2];
    const likesLabel = document.querySelector('.widg-likes-text');
    let likesLabelValue = Number(likesLabel.innerText);
    let likeLabelValue = Number(likeLabel.innerText);

    if (checkButton.checked) {
      heartSVG.setAttribute('fill', 'true');
      likeLabelValue += 1;
      likesLabelValue += 1;
    } else {
      heartSVG.setAttribute('fill', 'false');
      likeLabelValue -= 1;
      likesLabelValue -= 1;
    }

    likeLabel.innerText = String(likeLabelValue);
    likesLabel.innerText = String(likesLabelValue);
  }
}

/* onMediaFocus : activates the light box on click or on tab */

function onMediaSelect(event) {
  if (event.code === 'Enter' || event.type === 'click') {
    event.preventDefault();
    event.stopPropagation();
    const media = event.target;
    const mediaInDb = filterObjectsById([...mediasByPhotogId], media.id, 'id');
    const attribute = {
      type: 'id',
      value: media.id,
    };
    const mediaAdjId = getContiguousId([...mediasByPhotogId], attribute);
    const mediaPack = {
      media: mediaInDb[0],
      indexes: mediaAdjId,
    };
    const targetedWrapper = document.querySelector('.light-box');
    const targetedWrapperBg = document.querySelector('.light-bg');
    printObjects(mediaPack, 'medias', targetedWrapper);
    const butt = targetedWrapper.querySelector('button');
    butt.focus();
    modifyClassAttrList(targetedWrapperBg, 'remove', 'not-visible');
    targetedWrapperBg.addEventListener('keydown', onTabInModal, true);
  }
}

/* onlightButton  for previous and next media navigation into the light */

function onlightButton(event) {
  if (event.code === 'Enter' || event.type === 'click') {
    event.preventDefault();
    event.stopPropagation();
    const button = event.target;
    const mediaInDb = filterObjectsById([...mediasByPhotogId], button.id, 'id');
    const attribute = {
      type: 'index',
      value: button.id,
    };
    const mediaAdjIndex = getContiguousId([...mediasByPhotogId], attribute);
    const mediaPack = {
      media: mediaInDb[0],
      indexes: mediaAdjIndex,
    };
    const targetedWrapper = document.querySelector('.light-box');
    printObjects(mediaPack, 'medias', targetedWrapper);
  }
}

/* onLightClose */

function onClose(event) {
  if (event.code === 'Enter' || event.type === 'click') {
    let wrapperbg = null;
    if (event.target.className === 'form-close light-close') {
      wrapperbg = document.querySelector('.light-bg');
    } else if (event.target.className === 'form-close') {
      wrapperbg = document.querySelector('.dial-bg');
    }
    wrapperbg.removeEventListener('keydown', onTabInModal, true);
    modifyClassAttrList(wrapperbg, 'add', 'not-visible');
  }
}

/* onSubForm only tests if inputs have text and prints in the console log
if no error has been found . Else the form is not sent */

function onSubForm(event) {
  const checkArray = [];
  const valuesArray = [];
  const form = event.target;
  const inputs = form.querySelectorAll('input, textarea');

  inputs.forEach((input) => {
    if (input.value) {
      checkArray.push(true);
      valuesArray.push(input.value);
    } else {
      checkArray.push(false);
    }
  });

  if (checkArray.includes(false)) {
    event.preventDefault();
  }
}
