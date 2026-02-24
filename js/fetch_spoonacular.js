const apiKey = 'c2d057f8c56142288780a4abc0b0b806';

const cardContainer = document.querySelector('.recipe-grid');
const produceContainer = document.querySelector('.slider');
console.log(cardContainer);

async function fetchIngredients(produceArr) {
    
    // First: display produce cards
    displayProduceCards(produceArr);

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
        fetchRecipes(recipeIDs);
    }
    catch (error) {
        console.error('Error fetching data:', error);
    }
}

async function fetchRecipes(recipeIDs) {
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
        //displayProduceCards(data, produceArr);
        console.log(data);
        displayRecipeCards(data);
    }
    catch (error) {
        console.error('Error fetching data:', error);
    }
}

async function displayProduceCards(produceArr) {

    try{
        const produceJSONResponse = await fetch('produce-images.json')
        if (!produceJSONResponse.ok) {
            throw new Error(`Response status: ${response.status}`)
        }

        var produceData = await produceJSONResponse.json()

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

            const produceName = card.dataset.title;
            const img = card.dataset.image;

            modalTitle.textContent = produceName;
            modalImage.src = img;
            modalImage.alt = produceName;

            modal.showModal();

            // CHANGE: load recipes into modal grid for the clicked produce
            //modalRecipeGrid.innerHTML = "<p>Loading recipes...</p>";
            //await fetchIngredients([produceName], modalRecipeGrid);
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

function displayRecipeCards(cardsData) {

    cardsData.forEach(cardData => {

        // Create card elements
        const card = document.createElement("button");
        const recipeImage = document.createElement("img");
        const recipeTitle = document.createElement("div");

        // Add classes for styling
        card.classList.add("recipe-card");
        recipeImage.classList.add('recipe-image');
        recipeTitle.classList.add("recipe-text");

        // Set content dynamically
        recipeImage.src = cardData.image;
        recipeImage.alt = cardData.title;
        recipeTitle.textContent = cardData.title;


        // Append elements to the card, and the card to the container
        card.appendChild(recipeImage);
        card.appendChild(recipeTitle);
        cardContainer.appendChild(card);

        //clickable recipe cards ?
        // const link = cardData.sourceUrl || cardData.spoonacularSourceUrl;
        // if (link) {
        // card.addEventListener("click", () => window.open(link, "_blank"));
        //}
    })
}

/* Title case function */
function toTitleCase(str) {
  return str.toLowerCase().split(' ').map(function(word) {
    return (word.charAt(0).toUpperCase() + word.slice(1));
  }).join(' ');
}