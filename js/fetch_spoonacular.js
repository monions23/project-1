const apiKey1 = '2f828b7f1c5e4eaf98fe8c55fd825aa0';
const apiKey2 = 'ec189335398d41cca8df74580c3d7f76';
const apiKey3 = '0d22fdea05784a548001de5aa76848e8';

const cardContainer = document.querySelector('.recipe-grid');

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
                'x-api-key': apiKey2,
                'Content-Type': 'application/json'
            }
        })
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`)
        }

        var data = await response.json()
            .then(
                data => {
                    var recipeIDs = [];
                    console.log(data);
                    data.forEach(recipe => {
                        recipeIDs.push(recipe.id);
                    })
                    //displayProduceCards(data, produceArr);
                    fetchRecipes(data, recipeIDs);
                }
        );
    }
    catch (error) {
        console.error('Error fetching data:', error);
    }
}

async function fetchRecipes(data, recipeIDs) {
    /* Fetch recipes and output cards */
    try {
        console.log(recipeIDs);
        let recipeIDsStr = recipeIDs.join(",");
        console.log(recipeIDsStr);
        var url = `https://api.spoonacular.com/recipes/informationBulk?ids=${recipeIDsStr}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'x-api-key': apiKey2,
                'Content-Type': 'application/json'
            }
        })
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`)
        }

        var data = await response.json()
            .then(
                data => {
                    console.log(data);
                    displayRecipeCards(data);
                }
        );
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
    var card = document.createElement('div');
    var recipeImage = document.createElement('img');
    var recipeTitle = document.createElement('div');

    // Add classes for styling
    card.classList.add('card');
    card.classList.add('recipe');
    recipeImage.classList.add('recipe-image');
    recipeTitle.classList.add('recipe-text');

    // Set content dynamically
    recipeImage.src = cardData.image;
    recipeImage.alt = cardData.title;
    recipeTitle.textContent = cardData.title;

    // Append elements to the card, and the card to the container
    card.appendChild(recipeImage);
    card.appendChild(recipeTitle);
    cardContainer.appendChild(card);
  })
}