/* At loading page */

let photographerId = '';
let photographerName = '';

/* filterObjectsByTag returns objects */

function filterObjectsById(objects, id, property) {
  const filtPhotoArr = objects.filter((object) => object[property] === Number(id));
  return filtPhotoArr;
}

/* createMediaHtml creates the right html according the type of object.
Returns a html object to build */

function createMediaHtml(type, object) {
  return {
    build() {
      let htmlObject = '';
      const photographName = photographerName.split(' ');
      htmlObject += '<div class="media-wrapper">';
      switch (type) {
        case 'image':
          htmlObject += `<img class="gallery-image" src="./media/img/${photographName[0]}/${object.image}">`;
          break;
        case 'video':
          htmlObject += `<${type} class="gallery-video" controls>
                            <source src="./media/video/${photographName[0]}/${object.video}">
                         </${type}>`;
          break;
        default:
      }
      htmlObject += `<div class="media-text-wrapper">
                        <p class="media-title">${object.title}</p>
                        <p class="media-price">${object.price}€</p>
                        <p class="likes-text">${object.likes}<i class="fas fa-heart" aria-label="likes"></i></p
                     </div>
                  </div>`;
      return htmlObject;
    },
  };
}

/* printMedias build images or videos with calling the object factory createMediaHtml */

function printMedias(objects) {
  const mediasWrapper = document.querySelector('.medias-wrapper');
  objects.forEach((element) => {
    let type = '';
    if (element.image) {
      type = 'image';
    } else if (element.video) {
      type = 'video';
    }
    const htmlMedia = createMediaHtml(type, element);
    mediasWrapper.innerHTML += htmlMedia.build();
  });
}

/* print cards displays cards model in the html with datas */

function printCards(objects) {
  const cardsWrapper = document.querySelector('.card-wrapper');
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
function printObjects(objects, type) {
  switch (type) {
    case 'medias':
      printMedias(objects);
      break;
    case 'cards':
      printCards(objects);
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
    const mediasByPhotogId = filterObjectsById(objects.media, id, 'photographerId');
    printObjects(photographersById, 'cards');
    printObjects(mediasByPhotogId, 'medias');
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
