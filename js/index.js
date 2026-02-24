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
slider.querySelectorAll(".produce-card").forEach(card => card.remove());

// CHANGE: clear the page recipe grid only (optional but recommended)
document.getElementById("pageRecipeGrid").innerHTML = "";
  // Select all elements that match the CSS selector
  const cardElements = document.querySelectorAll(".card");

  // Iterate over the resulting NodeList and remove each element
  for (const card of cardElements) {
    card.remove();
  }

  const stateElement = document.getElementById("states-select");
  const seasonElement = document.getElementById("seasons-select");

  const stateChoice = stateElement.value;
  const seasonChoice = seasonElement.value;

  const region = data.regions.find(r =>
    r.states.includes(stateChoice)
  );

  if (!region) return [];

  console.log(region.seasons[seasonChoice] || [])

  fetchIngredients(region.seasons[seasonChoice] || [], document.querySelector(".recipe-grid"));
  return region.seasons[seasonChoice] || [];


};

document.addEventListener("DOMContentLoaded", function () {

    const slider = document.querySelector(".slider");
    const nextBtn = document.querySelector(".next-btn");
    const prevBtn = document.querySelector(".prev-btn");

    const modal = document.getElementById("produceModal");
    const modalImage = document.getElementById("modalImage");
    const modalTitle = document.getElementById("modalTitle");
    const closeBtn = document.querySelector(".modal-close");

    const cardWidth = document.querySelector(".produce-card").offsetWidth + 16; // Include margin

    nextBtn.addEventListener("click", () => {
        slider.scrollBy({left: cardWidth, behavior: "smooth"});
    });

    prevBtn.addEventListener("click", () => {
        slider.scrollBy({ left: -cardWidth, behavior: "smooth" });
    });

    const modalRecipeGrid = document.getElementById("modalRecipeGrid");

  // CHANGE: handle clicks only inside the produce slider
  slider.addEventListener("click", async (e) => {
    const card = e.target.closest(".produce-card");
    if (!card) return; // not a produce card

    const produceName = card.dataset.title;
    const img = card.dataset.image;

    modalTitle.textContent = produceName;
    modalImage.src = img;
    modalImage.alt = produceName;

    modal.showModal();

    // CHANGE: load recipes into modal grid for the clicked produce
    modalRecipeGrid.innerHTML = "<p>Loading recipes...</p>";
    await fetchIngredients([produceName], modalRecipeGrid);
  });
 

  closeBtn.addEventListener("click", () => modal.close());

  modal.addEventListener("click", (e) => {
    const rect = modal.getBoundingClientRect();
    const inside =
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom;

    if (!inside) modal.close();
  });
});