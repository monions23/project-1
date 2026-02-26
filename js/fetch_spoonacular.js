const apiKey = '694a823f467f4f52aaf90ebdfe079e29';

const cardContainer = document.querySelector('.recipe-grid');
const produceContainer = document.querySelector('.slider');
//storing recipes by their id 
const recipeById = new Map();
console.log(cardContainer);

// Create card elements
function updateProduceCount(count) {
    const pill = document.getElementById("produceCount");
    if (!pill) return;

    pill.textContent = `${count} ${count === 1 ? "item" : "items"}`;
 }    



// ===== RECIPE MODAL =====
const recipeModal = document.getElementById("recipeModal");
const recipeModalImage = document.getElementById("recipeModalImage");
const recipeModalTitle = document.getElementById("recipeModalTitle");
const recipeModalLink = document.getElementById("recipeModalLink");
const recipeModalClose = document.querySelector(".recipe-modal-close");

// closing modal
if (recipeModalClose) {
  recipeModalClose.addEventListener("click", () => {
    recipeModal.close();
  });
}

// Close when clicking the backdrop area (outside the modal card)
recipeModal.addEventListener("click", (e) => {
  const box = recipeModal.getBoundingClientRect();

  const clickedInside =
    e.clientX >= box.left &&
    e.clientX <= box.right &&
    e.clientY >= box.top &&
    e.clientY <= box.bottom;

  if (!clickedInside) recipeModal.close();
});


async function fetchIngredients(produceArr, targetContainer, modal = false) {
  
    produceContainer.innerHTML ="";
    updateProduceCount(produceArr.length)
  
    if (!targetContainer) targetContainer = document.getElementById("pageRecipeGrid");
    console.log('container got');
    
    // First: display produce cards
    if (!modal) {
        displayProduceCards(produceArr);
    }

    try {
        /* fetch produce and output cards */
        var produceStr = produceArr.join(",")
        var encodedProduceStr = encodeURIComponent(produceStr);
        var url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${encodedProduceStr}&\
        number=12&ranking=1`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'x-api-key': apiKey,
                'Content-Type': 'application/json'
            }
        })
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`)
        }

        var data = await response.json();
        var recipeIDs = [];
        console.log(data);
        data.forEach(recipe => {
            recipeIDs.push(recipe.id);
        })
        console.log(recipeIDs)
        fetchRecipes(recipeIDs, targetContainer);
    }
    catch (error) {
        console.error('Error fetching data:', error);
    }
}

async function fetchRecipes(recipeIDs, targetContainer) {
    /* Fetch recipes and output cards */
    try {
        console.log(recipeIDs);
        var recipeIDsStr = recipeIDs.join(",");
        console.log(recipeIDsStr);
        var url = `https://api.spoonacular.com/recipes/informationBulk?ids=${recipeIDsStr}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'x-api-key': apiKey, 
                'Content-Type': 'application/json'
            }
        })
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`)
        }

        var data = await response.json()
        console.log(data);

        // Display Recipe Cards
        displayRecipeCards(data, targetContainer);
    }
    catch (error) {
        console.error('Error fetching data:', error);
    }
}

async function displayProduceCards(produceArr) {

    try{

        // fetch the produce images for the produce cards
        const produceJSONResponse = await fetch('produce-images.json')
        if (!produceJSONResponse.ok) {
            throw new Error(`Response status: ${response.status}`)
        }
        var produceData = await produceJSONResponse.json()

        // create a card for each produce item
        produceArr.forEach(produce => {
            // Create card elements
            var card = document.createElement('button');
            var produceImage = document.createElement('img');
            var produceTitle = document.createElement('div');

            // Add classes for styling
            card.classList.add('produce-card');

            card.setAttribute('data-title', produce);
            card.setAttribute('data-image', produceData[produce]);

            produceImage.classList.add('produce-image');
            produceTitle.classList.add('produce-text');

            // Set content dynamically
            produceImage.src = produceData[produce];

            var produceCapitalized = toTitleCase(produce);
            produceImage.alt = produceCapitalized;
            produceTitle.textContent = produceCapitalized;

            // Append elements to the card, and the card to the container
            card.appendChild(produceImage);
            card.appendChild(produceTitle);
            produceContainer.appendChild(card);
        })

        // Add modal and slider functionality
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


        //handle clicks only inside the produce slider
        slider.addEventListener("click", async (e) => {
            const card = e.target.closest(".produce-card");
            if (!card) return; // not a produce card

            const produceName = toTitleCase(card.dataset.title);
            const img = card.dataset.image;

            modalTitle.textContent = produceName;
            modalImage.src = img;
            modalImage.alt = produceName;

            modal.showModal();

            // load recipes into modal grid for the clicked produce
            modalRecipeGrid.innerHTML = "<p>Loading recipes...</p>";
            await fetchRecipesForOneProduce(produceName, modalRecipeGrid, true);

            const countEl = document.getElementById("modalRecipeCount");
            if (countEl) {
                const cards = modalRecipeGrid.querySelectorAll(".recipe-card").length;
                countEl.textContent = `${cards} ${cards === 1 ? "recipe" : "recipes"}`;
                }
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
    }
    catch (error) {
        console.error('Error fetching data:', error);
    }

}
//fetch rcipes for display grid
async function fetchRecipesForOneProduce(produceName, targetContainer) {
  if (!targetContainer) return;

  targetContainer.innerHTML = "<p>Loading recipes...</p>";

  try {
    const encoded = encodeURIComponent(produceName);
    const url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${encoded}&number=12&ranking=1`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json"
      }
    });

    if (!res.ok) throw new Error(`Response status: ${res.status}`);

    const list = await res.json(); // list of {id,...}
    const ids = list.map(r => r.id);

    // reuse your existing bulk fetch:
    await fetchRecipes(ids, targetContainer);

  } catch (err) {
    console.error(err);
    targetContainer.innerHTML = "<p>Could not load recipes.</p>";
  }
}

function displayRecipeCards(cardsData, targetContainer) {
  if (!targetContainer) return;
  targetContainer.innerHTML = "";

  cardsData.forEach(cardData => {



    // Create card elements
    const card = document.createElement("button");
    const recipeImage = document.createElement("img");

    const content = document.createElement("div");
    const recipeTitle = document.createElement("div");
    const pillRow = document.createElement("div");

    const timePill = document.createElement("span");
    const ingPill = document.createElement("span");

    // Add classes for styling
    card.classList.add("recipe-card");
    recipeImage.classList.add("recipe-image");
    recipeTitle.classList.add("recipe-text");

    // pill layout classes
    content.classList.add("recipe-content");
    pillRow.classList.add("recipe-pill-row");
    timePill.classList.add("recipe-pill");
    ingPill.classList.add("recipe-pill");

    // Set content dynamically
    recipeImage.src = cardData.image;
    recipeImage.alt = cardData.title;
    recipeTitle.textContent = cardData.title;

    // text for pills
    const minutes = cardData.readyInMinutes;
    const ingCount = Array.isArray(cardData.extendedIngredients)
      ? cardData.extendedIngredients.length
      : 0;

    timePill.textContent = minutes ? `⏱ ${minutes} min` : "⏱ —";
    ingPill.textContent = ingCount ? `🥬 ${ingCount} ingredients` : "🥬 —";

    // clickable recipe cards
    card.dataset.title = cardData.title;
    card.dataset.image = cardData.image;
    card.dataset.link = cardData.sourceUrl || cardData.spoonacularSourceUrl || "";
    card.dataset.id = cardData.id;


    // Save full recipe data so modal can render without refetch
    recipeById.set(String(cardData.id), cardData);

    // title and pills
    pillRow.appendChild(timePill);
    pillRow.appendChild(ingPill);
    content.appendChild(recipeTitle);
    content.appendChild(pillRow);

    // Append elements to the card, and the card to the container
    card.appendChild(recipeImage);
    card.appendChild(content);
    targetContainer.appendChild(card);

    card.addEventListener("click", () => window.openRecipeModal(card));
  });

  const recipePill = document.getElementById("recipeCount");
  if (recipePill) {
    recipePill.textContent = `${cardsData.length} ${cardsData.length === 1 ? "recipe" : "recipes"}`;
  }
}
// Global call
window.openRecipeModal = function (recipeCardEl) {

  //basic info from the clicked card
  const id = recipeCardEl.dataset.id;
  const recipe = recipeById.get(String(id)); // look up full recipe object

  if (!recipe) {
    console.warn("Recipe not found in recipeById map");
    return;
  }

  //title + image
  recipeModalTitle.textContent = recipe.title || "Recipe";
  recipeModalImage.src = recipe.image || "";
  recipeModalImage.alt = recipe.title || "Recipe";

  //link
  const link = recipe.sourceUrl || recipe.spoonacularSourceUrl || "#";
  recipeModalLink.href = link;
  recipeModalLink.style.display =
    link && link !== "#" ? "inline-block" : "none";

  // modal element
  const timeEl = document.getElementById("recipeModalTime");
  const servingsEl = document.getElementById("recipeModalServings");
  const ingListEl = document.getElementById("recipeModalIngredients");
  const stepsEl = document.getElementById("recipeModalSteps");
  const descEl = document.getElementById("recipeModalDesc");

  //clear old content
  if (ingListEl) ingListEl.innerHTML = "";
  if (stepsEl) stepsEl.innerHTML = "";
  if (descEl) {
    descEl.textContent = "";
    descEl.style.display = "none";
  }

  // time pill
  if (timeEl) {
    const minutes = recipe.readyInMinutes;
    timeEl.textContent = minutes ? `⏱ ${minutes} min` : "⏱ —";
    timeEl.style.display = "inline-flex";
  }

  //Servings
  if (servingsEl) {
    const servings = recipe.servings;
    if (servings) {
      servingsEl.textContent = `👥 ${servings} servings`;
      servingsEl.style.display = "inline-flex";
    } else {
      servingsEl.style.display = "none";
    }
  }

  //description
  if (descEl && recipe.summary) {
    // remove HTML tags from API text
    const cleanText = recipe.summary.replace(/<[^>]*>/g, "");
    descEl.textContent = cleanText;
    descEl.style.display = "block";
  }

  //  ing list
  if (ingListEl) {
    const ingredients = recipe.extendedIngredients || [];

    if (ingredients.length === 0) {
      ingListEl.innerHTML = "<li>No ingredients listed.</li>";

    //bullet points  
    } else {
      ingredients.forEach(item => {
        const li = document.createElement("li");

        const dot = document.createElement("span");
        dot.className = "recipe-modal-dot";

        const text = document.createElement("span");
        text.textContent = item.original;

        li.appendChild(dot);
        li.appendChild(text);

        ingListEl.appendChild(li);
        });
    }
  }

  if (stepsEl) {

    let steps = [];

    // Spoonacular structure
    if (
      recipe.analyzedInstructions &&
      recipe.analyzedInstructions.length > 0
    ) {
      steps = recipe.analyzedInstructions[0].steps.map(s => s.step);
    }

    // plain instructions text
    else if (recipe.instructions) {
      const clean = recipe.instructions.replace(/<[^>]*>/g, "");
      steps = clean.split(". ").filter(s => s.trim().length > 0);
    }

    if (steps.length === 0) {
      stepsEl.innerHTML = "<li>No instructions provided.</li>";
    } else {
      steps.forEach((text, index) => {
        const li = document.createElement("li");
        li.className = "recipe-modal-step";

        const num = document.createElement("span");
        num.className = "recipe-modal-step-num";
        num.textContent = index + 1;

        const stepText = document.createElement("span");
        stepText.textContent = text;

        li.appendChild(num);
        li.appendChild(stepText);

        stepsEl.appendChild(li);
        });
    }
  }

  recipeModal.showModal();
};


/* Title case function */
function toTitleCase(str) {
  return str.toLowerCase().split(' ').map(function(word) {
    return (word.charAt(0).toUpperCase() + word.slice(1));
  }).join(' ');
}
