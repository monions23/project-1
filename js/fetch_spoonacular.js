const apiKey = 'c2d057f8c56142288780a4abc0b0b806';

// const cardContainer = document.querySelector('.recipe-grid');
//console.log(cardContainer);

async function fetchIngredients(produceArr, targetContainer) {
    if (!targetContainer) targetContainer = document.getElementById("pageRecipeGrid");
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
        //displayProduceCards(data, produceArr);
        console.log(data);
        displayRecipeCards(data, targetContainer);
    }
    catch (error) {
        console.error('Error fetching data:', error);
    }
}

// function displayProduceCards(produceData, produceArr) {


//     // Create card elements
//     var card = document.createElement('div');
//     var recipeImage = document.createElement('img');
//     var recipeTitle = document.createElement('div');

//     // Add classes for styling
//     card.classList.add('card');
//     card.classList.add('recipe');
//     recipeImage.classList.add('recipe-image');
//     recipeTitle.classList.add('recipe-text');

//     // Set content dynamically
//     recipeImage.src = produceData.image;
//     recipeImage.alt = produceData.title;
//     recipeTitle.textContent = produceData.title;

//     // Append elements to the card, and the card to the container
//     card.appendChild(recipeImage);
//     card.appendChild(recipeTitle);
//     cardContainer.appendChild(card);
// }

function displayRecipeCards(cardsData, targetContainer) {
    if (!targetContainer) return;
    targetContainer.innerHTML = "";

    cardsData.forEach(cardData => {

        // Create card elements
        const card = document.createElement("button");
        const recipeImage = document.createElement("img");

        //info pills for recipe card 
        const content = document.createElement("div");     
        const recipeTitle = document.createElement("div"); 
        const pillRow = document.createElement("div");    

        const timePill = document.createElement("span");   
        const ingPill = document.createElement("span");    

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