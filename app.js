document.addEventListener('DOMContentLoaded', function () {
    // Function to toggle the search bar
    const toggleSearch = (search, button) => {
        const searchBar = document.getElementById(search);
        const searchButton = document.getElementById(button);

        searchButton.addEventListener('click', () => {
            searchBar.classList.toggle('show-search');
        });
    };
    toggleSearch('search-bar', 'search-button');

    // Function to fetch a random meal from the API using Axios
    const fetchRandomMeal = () => {
        axios.get('https://www.themealdb.com/api/json/v1/1/random.php')
            .then(response => {
                const meal = response.data.meals[0];

                // Set the name of the dish on the button
                const popupButton = document.getElementById('popupButton');
                popupButton.textContent = meal.strMeal;

                // Set the random meal image
                const randomMealImage = document.getElementById('randomMealImage');
                randomMealImage.src = meal.strMealThumb;

                // Display only the ingredients in the popup after button click
                popupButton.addEventListener('click', function () {
                    const popup = document.getElementById('popup');
                    const popupMealImage = document.getElementById('popupMealImage');
                    const ingredientsParagraph = document.getElementById('ingredients');

                    // Add some top margin to ingredientsParagraph
                    ingredientsParagraph.style.marginTop = '20px'; 

                    popupMealImage.src = meal.strMealThumb; 
                    ingredientsParagraph.innerHTML = `<h3>${meal.strMeal}</h3><ul>${getIngredientsList(meal)}</ul>`;
                    popup.style.display = 'block';
                });
            })
            .catch(error => console.error('Error fetching data:', error));
    };

    // Function to get the ingredients list from the meal object
    const getIngredientsList = (meal) => {
        const ingredients = [];
        for (let i = 1; i <= 20; i++) {
            const ingredient = meal[`strIngredient${i}`];
            const measure = meal[`strMeasure${i}`];

            if (ingredient && measure) {
                ingredients.push(`<li>${measure} ${ingredient}</li>`);
            } else if (ingredient) {
                ingredients.push(`<li>${ingredient}</li>`);
            }
        }
        return ingredients.join('');
    };

    // Function to close the modal
    const closeModalFunction = () => {
        const popup = document.getElementById('popup');
        popup.style.display = 'none';
    };

    // Close modal when clicking on the close button
    const closePopup = document.getElementById('closePopup');
    closePopup.addEventListener('click', closeModalFunction);

    // Close modal when clicking outside the popup
    window.addEventListener('click', function (event) {
        const popup = document.getElementById('popup');
        if (event.target === popup) {
            closeModalFunction();
        }
    });

    // Function to fetch meals for a specific category
    const btn = document.getElementById('search-button');
    let apiCalled = false;
    btn.onclick = () => {
        if (!apiCalled) {
            apiCalled = true;

            const x = document.getElementById('search-input').value;
            const getResult = document.getElementById('result');

            axios
                .get(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${x}`)
                .then((res) => {
                    const listOfMeals = res.data.meals;

                    if (listOfMeals) {
                        getResult.innerHTML = ''; // Clear previous results

                        listOfMeals.forEach((meal) => {
                            const getMeal = document.createElement('div');
                            getMeal.setAttribute('class', 'meal');

                            const title = document.createElement('h3');
                            const img = document.createElement('img');

                            title.innerText = meal.strMeal;
                            img.setAttribute('src', meal.strMealThumb);

                            img.addEventListener('click', () => {
                                // Show the popup with meal details
                                showMealDetailsPopup(meal);
                            });

                            getMeal.append(img);
                            getMeal.append(title);

                            getResult.append(getMeal);
                        });
                    } else {
                        getResult.innerHTML = '';
                    }
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                    getResult.innerHTML = 'Error fetching data.';
                })
                .finally(() => {
                    apiCalled = false;
                });
        }
    };

    // Fetch a random meal when the page loads
    fetchRandomMeal();
});

function showMealDetailsPopup(meal) {
    // Fetch additional details using the meal ID
    axios
        .get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`)
        .then((res) => {
            const details = res.data.meals[0];

            // Create a popup container
            const popupContainer = document.createElement('div');
            popupContainer.setAttribute('class', 'popup-container');

            // Create elements for meal details
            const popupImage = document.createElement('img');
            popupImage.setAttribute('src', details.strMealThumb);

            const popupTitle = document.createElement('h2');
            popupTitle.textContent = details.strMeal;

            const popupIngredientsHeading = document.createElement('h3');
            popupIngredientsHeading.textContent = 'Ingredients';

            const popupIngredients = document.createElement('ul');
            popupIngredients.innerHTML = getIngredientsList(details);

            const popupInstructionsHeading = document.createElement('h3');
            popupInstructionsHeading.textContent = 'Instructions';

            const popupInstructions = document.createElement('p');
            popupInstructions.textContent = details.strInstructions;

            // Append elements to the popup container
            popupContainer.append(popupImage);
            popupContainer.append(popupTitle);
            popupContainer.append(popupIngredientsHeading);
            popupContainer.append(popupIngredients);
            popupContainer.append(popupInstructionsHeading);
            popupContainer.append(popupInstructions);

            // Append the popup container to the body
            document.body.appendChild(popupContainer);

            // Add a click event listener to close the popup when clicked outside
            popupContainer.addEventListener('click', () => {
                document.body.removeChild(popupContainer);
            });
        })
        .catch((error) => {
            console.error('Error fetching additional details:', error);
        });
}

// Function to get ingredients list
function getIngredientsList(meal) {
    let ingredientsList = '';
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ingredient && measure) {
            ingredientsList += `<li>${measure} ${ingredient}</li>`;
        } else if (ingredient) {
            ingredientsList += `<li>${ingredient}</li>`;
        }
    }
    return ingredientsList;
}
