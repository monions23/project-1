// ali's code:
let data = null;

fetch("data.json")
  .then(response => response.json())
  .then(json => {
    data = json;
    console.log("Data loaded:", data);
  })
  .catch(err => console.error("Failed to load data.json", err));
  

function selectProduce() {

  // CHANGE: only remove produce cards in the slider
  const slider = document.querySelector(".slider");
  document.querySelectorAll(".recipe-card").forEach(card => card.remove());

  // // CHANGE: clear the page recipe grid only (optional but recommended)
  // document.getElementById("pageRecipeGrid").innerHTML = "";
  // // Select all elements that match the CSS selector
  // const cardElements = document.querySelectorAll(".card");

  // // Iterate over the resulting NodeList and remove each element
  // for (const card of cardElements) {
  //   card.remove();
  // }

  const stateElement = document.getElementById("states-select");
  const seasonElement = document.getElementById("seasons-select");

  const stateChoice = stateElement.value;
  const seasonChoice = seasonElement.value;

  const region = data.regions.find(r =>
    r.states.includes(stateChoice)
  );

  if (!region) return [];

  console.log(region.seasons[seasonChoice] || [])

  fetchIngredients(region.seasons[seasonChoice] || []);
  return region.seasons[seasonChoice] || [];


};
