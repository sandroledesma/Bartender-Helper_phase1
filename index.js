/*

PROJECT OUTLINE (derived from FRIDGE RECIPE)

Title: Bartender Helper
Objective: Generate cocktail recipes based on various prompts

INITIAL PROMPTS: 
> Bartender can choose Liquor Type (or Non-Alcoholic) and generate a Random Cocktail
> Bartender can choose Liquor Type and Flavor Profile (Sweet, Dry) and generate a random cocktail

JAVASCRIPT GENERATORS: 
> (~~complete~~) Bartender Helper will show ingredients (with images) = SUBMIT 
  > FUNCTION: randomCocktail = submit event listener when input form type=submit (GENERATE) is submitted
> (~~incomplete~~) Bartender Helper will allow to generate another cocktail if the random cocktail does not suffice = KEYDOWN 
  > FUNCTION: nextCocktail = keyDown event listener to next cocktail with the same liquor type/flavor profile
> (~~complete~~) Bartender Helper can increase serving size = CLICK
  > FUNCTION: cocktailServingSize = cocktails.ingredients.amount.value * servingSize
> (~~complete~~) Bartender Helper will show type of glass to use (with image) = MOUSEOVER (EXTRA)
  > FUNCTION: glassCocktail = mouseover event listener to show image of glass when mouse is over the cocktails.glass 
> (~~complete~~) If Bartender chooses Non-Alcoholic, Bartender Helper will return a list of soft-drinks and a note to take care of their intoxicated friends = WINDOW.LOAD (EXTRA)
  > FUNCTION: nonAlcCocktail = figure out how to generate a pop up within the page to show offering of organic sodas (with X to exit in-window pop up)

ITERATE = FILTER or FOR EACH 

CSS DESIGN: 
> Black Background, simple design, mobile friendly, dark mode/light mode

*/

document.addEventListener('DOMContentLoaded', () => {

// FUNCTION: getCocktail = submit event listener when input form type=submit (GENERATE) is submitted
function getCocktail(liquorType, flavorProfile) {
  fetch("http://localhost:3000/cocktails")
  .then((response) => response.json())
  .then(cocktails => { // this is where we iterate the information from JSON to JS/HTML
    const filteredCocktail = cocktails.filter(cocktail => 
      cocktail['liquor-type'].includes(liquorType) &&
      cocktail['flavor-profile'] === flavorProfile
    );
    if (filteredCocktail.length > 0) { // function to filter and match cocktails via a specified criteria (liquor-type & flavor-profile)
      const randomIndex = Math.floor(Math.random() * filteredCocktail.length); // 
      const randomCocktail = filteredCocktail[randomIndex]; // retrieves a random cocktail based on the criteria
      displayCocktail(randomCocktail); // displays the random cocktail 
    } else { displayNoCocktailMessage(); // If no cocktail matches the criteria, display an error message
    }
    });
  };

function displayNoCocktailMessage() {
  const cocktailList = document.getElementById('cocktail-container');
  cocktailList.innerHTML = "No Cocktail found with your criteria.";
  cocktailList.style.display = 'block';
};

document.getElementById('cocktail-finder').addEventListener('submit', function(event) {
    event.preventDefault();
    const liquorType = document.getElementById('liquor-type').value;
    const flavorProfile = document.getElementById('flavor-profile').value;

    if (liquorType === "Non-Alcoholic") {
      displaySodaImage();
    }
    else if (liquorType.trim() !== '' && flavorProfile.trim() !== '') { // Check if both liquor type and flavor profile are selected
        getCocktail(liquorType, flavorProfile);
    } else { displayCriteriaMessage(); // If either liquor type or flavor profile is not selected, display an error message  
    }
  });

function displaySodaImage() {
    // FUNCTION: displaySodaImage = figure out how to generate a pop up within the page to show offering of organic sodas
  const cocktailList = document.getElementById('cocktail-container');
  const img = document.createElement('img');
  img.src = './images/soda-image.jpeg';
  img.alt = 'Soda Image';
  img.height = 150;
  cocktailList.innerHTML = ''; 
  cocktailList.appendChild(img);
  cocktailList.classList.add("soda-image");
  
  const sodaText = document.createElement('p');
  sodaText.textContent = "Enjoy a selection of organic sodas brought to you by Organics by Red Bull."
  cocktailList.appendChild(sodaText);
  
  cocktailList.style.display = 'block';
};

function displayCriteriaMessage() {
  const cocktailList = document.getElementById('cocktail-container');
  cocktailList.innerHTML = "Please select both liquor type and flavor profile.";
  cocktailList.style.display = 'block';
};

function displayCocktail(cocktail) {
    const cocktailList = document.getElementById('cocktail-container');
    const liquorType = Array.isArray(cocktail['liquor-type']) ? cocktail['liquor-type'].join(', ') : cocktail['liquor-type'];
    const servingSize = 1;

    // Dev Deliverable: Do not make the cocktail-container div show up until after type=submit GENERATE is clicked
    // Below Code is building HTML within JavaScript - hence the back tick usage and no color differentiation. String interpolation is being used for pulling info from db.json
    const cocktailHTML = `
        <h2>${cocktail.name}</h2>
        <label for="serving-size">Serving Size:</label>
        <input type="number" id="serving-size" value="${servingSize}" style="width: 30px; text-align: center">
        <button id="update-serving-size">Update</button>
        <p><strong>Ingredients:</strong></p>
        <ul>
            ${cocktail.ingredients.map(ingredient => `<li>${ingredient.amount.value} ${ingredient.amount.unit} ${ingredient.name}</li>`).join('')} 
        </ul>
        <p><strong>Instructions:</strong> <br /> ${cocktail.instructions}</p>
        <div class="cocktail-container">
        <div class="left-column"> <p><strong>Liquor Type:</strong> <br /> ${cocktail['liquor-type'].join(', ')}</p> </div>
        <div class="mid-column"> <p><strong>Flavor Profile:</strong> <br /> ${cocktail['flavor-profile']}</p> </div>
        <div class="right-column"> <p><strong>Glass:</strong> <br>${cocktail.glass}</p> </div>
        </div>
    `;
    cocktailList.innerHTML = cocktailHTML;
    cocktailList.style.display = 'block';
    
    // FUNCTION: servingSize = cocktails.ingredients.amount.value * servingSize
    const updateButton = document.getElementById('update-serving-size');
    updateButton.addEventListener('click', function() {
      const servingSize = document.getElementById('serving-size');
      const newServingSize = parseInt(servingSize.value);

      const ingredientList = document.querySelector('#cocktail-container ul');
      cocktail.ingredients.forEach((ingredient, index) => {
          const ingredientItem = ingredientList.children[index];
          const amountElement = ingredientItem.firstChild;
          amountElement.textContent = `${ingredient.amount.value * newServingSize} ${ingredient.amount.unit} ${ingredient.name}`
      });
    });
};

function displayGlassImage(glassType) {
  const glassImage = document.createElement('img');
  glassImage.src = `./images/glass/${glassType.toLowerCase().replace(/\s+/g, '-')}.png`;;
  glassImage.alt = '${glassType} Glass';
  glassImage.classList.add('glass-image');
  document.getElementById('cocktail-container').appendChild(glassImage);
};

document.getElementById('cocktail-container').addEventListener('mouseover', function(event) {
  // FUNCTION: glassCocktail = mouseover event listener to show image of glass when mouse is over the cocktails.glass 
  // images are contained in img src = ./images/glass/...
  const target = event.target;
  if (target.tagName === 'P' && target.innerText.startsWith('Glass:')) {
    const glassType = target.innerText.split(':')[1].trim();
    displayGlassImage(glassType);
  }
});

document.getElementById('cocktail-container').addEventListener('mouseout', function(event) {
  const glassImage = document.querySelector('.glass-image');
  if (glassImage) {
      glassImage.remove();
  }
});

document.addEventListener('keyDown', function() {
  // FUNCTION: nextCocktail = keyDown event listener to next cocktail with the same liquor type/flavor profile
  // image src = ./images/keydown-image.png
  const nextCocktail =  "";
});

});