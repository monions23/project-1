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

  fetchIngredients(region.seasons[seasonChoice] || []);
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

    const cardWidth = document.querySelector(".card").offsetWidth + 16; // Include margin

    nextBtn.addEventListener("click", () => {
        slider.scrollBy({left: cardWidth, behavior: "smooth"});
    });

    prevBtn.addEventListener("click", () => {
        slider.scrollBy({ left: -cardWidth, behavior: "smooth" });
    });

    document.querySelectorAll(".card").forEach(card => {
    card.addEventListener("click", () => {
      modalTitle.textContent = card.dataset.title;
      modalImage.src = card.dataset.image;
      modal.showModal();
    });
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