/* At loading page */

function display(datas) {
  console.log(datas);
}

async function getdatas() {
  try {
    const response = await fetch('./db/photographers.json');
    const datas = await response.json();
    display(datas);
  } catch (error) {
    alert(error.message);
  }
  return true;
}

getdatas();
console.log("LUL");
