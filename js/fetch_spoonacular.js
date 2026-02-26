const apiKey = 'c2d057f8c56142288780a4abc0b0b806';

const cardContainer = document.querySelector('.recipe-grid');
const produceContainer = document.querySelector('.slider');
console.log(cardContainer);

// Create card elements

//info pills for recipe card 
const content = document.createElement("div");     
const recipeTitle = document.createElement("div"); 
const pillRow = document.createElement("div");    

const timePill = document.createElement("span");   
const ingPill = document.createElement("span");  

// ===== RECIPE MODAL =====
const recipeModal = document.getElementById("recipeModal");
const recipeModalImage = document.getElementById("recipeModalImage");
const recipeModalTitle = document.getElementById("recipeModalTitle");
const recipeModalLink = document.getElementById("recipeModalLink");
const recipeModalClose = document.querySelector(".recipe-modal-close");


async function fetchIngredients(produceArr, targetContainer, modal = false) {
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


        // CHANGE: handle clicks only inside the produce slider
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
            await fetchIngredients([produceName], modalRecipeGrid, true);
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

function displayRecipeCards(cardsData, targetContainer) {
    if (!targetContainer) return;
    targetContainer.innerHTML = "";

    cardsData.forEach(cardData => {

        // Create card elements
        const card = document.createElement("button");
        console.log(card);
        const recipeImage = document.createElement("img");
        console.log(recipeImage);
        const recipeTitle = document.createElement("div");
        console.log(recipeTitle);

        // Add classes for styling
        card.classList.add("recipe-card");
        recipeImage.classList.add('recipe-image');
        recipeTitle.classList.add("recipe-text");

        //pill layout classes
        content.classList.add("recipe-content");
        pillRow.classList.add("recipe-pill-row");
        timePill.classList.add("recipe-pill");
        ingPill.classList.add("recipe-pill");

        // Set content dynamically
        recipeImage.src = cardData.image;
        recipeImage.alt = cardData.title;
        recipeTitle.textContent = cardData.title;

        //text for pills
        const minutes = cardData.readyInMinutes;
        const ingCount = Array.isArray(cardData.extendedIngredients)
            ? cardData.extendedIngredients.length
            : 0;

        timePill.textContent = minutes ? `⏱ ${minutes} min` : "⏱ —";
        ingPill.textContent = ingCount ? `🥬 ${ingCount} ingredients` : "🥬 —";


        //clickable recipe cards ?        
        card.dataset.title = cardData.title;
        card.dataset.image = cardData.image;
        card.dataset.link = cardData.sourceUrl || cardData.spoonacularSourceUrl || "";
        card.dataset.id = cardData.id;
                
        // title and pills 
        pillRow.appendChild(timePill);
        pillRow.appendChild(ingPill);
        content.appendChild(recipeTitle);
        content.appendChild(pillRow);

        
        // Append elements to the card, and the card to the container
        card.appendChild(recipeImage);
        card.appendChild(content);
        targetContainer.appendChild(card);

        // const link = cardData.sourceUrl || cardData.spoonacularSourceUrl;
        // if (link) {
        card.addEventListener("click", () => window.openRecipeModal(card));

        const recipePill = document.getElementById("recipeCount");
        if (recipePill) {
            recipePill.textContent = `${cardsData.length} ${cardsData.length === 1 ? "recipe" : "recipes"}`;
        }
        //}
    })
}

// Global so fetch_spoonacular.js can call it
window.openRecipeModal = function (recipeCardEl) {
      const title = recipeCardEl.dataset.title || "Recipe";
      const image = recipeCardEl.dataset.image || "";
      const link = recipeCardEl.dataset.link || "#";

      recipeModalTitle.textContent = title;
      recipeModalImage.src = image;
      recipeModalImage.alt = title;

      recipeModalLink.href = link;
      recipeModalLink.style.display = link && link !== "#" ? "inline-block" : "none";

      recipeModal.showModal();
    };

    recipeModalClose.addEventListener("click", () => recipeModal.close());

    recipeModal.addEventListener("click", (e) => {
      const rect = recipeModal.getBoundingClientRect();
      const inside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      if (!inside) recipeModal.close();
});

/* Title case function */
function toTitleCase(str) {
  return str.toLowerCase().split(' ').map(function(word) {
    return (word.charAt(0).toUpperCase() + word.slice(1));
  }).join(' ');
}
