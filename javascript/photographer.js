/* At loading page */

let photographerId = '';
let photographerName = '';

/* filterObjectsByTag returns objects */

function filterObjectsById(objects, id, property) {
  const filtPhotoArr = objects.filter((object) => object[property] === Number(id));
  return filtPhotoArr;
}

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

/* printMedias */

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
          <button class="modal-button"><span>c<span>ontactez-moi</button>
          <img src="./media/img/Photographers ID Photos/${element.portrait}" class="profile-img-big">
    </div>`;
  });
  cardsWrapper.innerHTML = cardhtmlModel;
}
/* lauches the display process according type given */
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

function run() {
  try {
    const queryStringUrlId = window.location.search;
    const searchParamsId = new URLSearchParams(queryStringUrlId);
    photographerId = searchParamsId.get('id');
    photographerName = searchParamsId.get('name');
    displayDynamics('./db/photographers.json', photographerId);
  } catch (error) {
    alert(error.message);
  }
}

run();
