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
    tagHtmlModel += `<li><a href="index.html" class="main-tag-link"><span aria-label="${element}">#${element}</span></a></li>`;
  });
  tagHtmlUl.innerHTML = tagHtmlModel;
}

/* lauches the display process according type given */
function printObjects(objects, type) {
  switch (type) {
    case 'tags':
      printTags(objects);
      break;
    case 'photographers':
      //printPhotographers(objects);
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
    //printObjects(objects.photographers, 'photographers');
  } catch (error) {
    alert(error.message);
  }
  return true;
}

displayDynamics('./db/photographers.json');
console.log('LUL');
