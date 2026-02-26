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

  // Reset produce cards and recipe cards upon each load
  document.querySelectorAll(".recipe-card").forEach(card => card.remove());
  document.querySelectorAll(".produce-card").forEach(card => card.remove());

  const stateElement = document.getElementById("states-select");
  const seasonElement = document.getElementById("seasons-select");

  const stateChoice = stateElement.value;
  const seasonChoice = seasonElement.value;

  const region = data.regions.find(r =>
    r.states.includes(stateChoice)
  );

  if (!region) return [];

  console.log(region.seasons[seasonChoice] || [])

  fetchIngredients(region.seasons[seasonChoice] || [], document.getElementById("pageRecipeGrid"));
  return region.seasons[seasonChoice] || [];


};
