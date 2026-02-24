const apiKey = 'c2d057f8c56142288780a4abc0b0b806';

const cardContainer = document.querySelector('.recipe-grid');
console.log(cardContainer);

async function fetchIngredients(produceArr) {
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