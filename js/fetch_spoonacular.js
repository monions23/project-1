const apiKey1 = '2f828b7f1c5e4eaf98fe8c55fd825aa0';
const apiKey2 = 'ec189335398d41cca8df74580c3d7f76';
const apiKey3 = '0d22fdea05784a548001de5aa76848e8';

const url = 'https://api.spoonacular.com/recipes/complexSearch?includeIngredients=leeks&fill\
            Ingredients=true&addRecipeInformation=true&addRecipeInstructions=true&number=12';

const cardContainer = document.querySelector('.recipe-grid');

async function fetchRecipes() {
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'x-api-key': apiKey1,
                'Content-Type': 'application/json'
            }
        })
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`)
        }

        var data = await response.json()
            .then(
                data => {
                    console.log(data.results);
                    displayCards(data.results);
                }
        );
    }
    catch (error) {
        console.error('Error fetching data:', error);
    }
}

function displayCards(cardsData) {

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


fetchRecipes();