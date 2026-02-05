const RecipeApp = (() => {
    'use strict';

    // DATA
    const recipes = [
        {
            id: 1,
            title: 'Pasta',
            difficulty: 'easy',
            time: 20,
            description: 'Simple tomato pasta',
            ingredients: ['pasta', 'tomato', 'salt']
        },
        {
            id: 2,
            title: 'Burger',
            difficulty: 'medium',
            time: 30,
            description: 'Juicy veggie burger',
            ingredients: ['bun', 'patty', 'lettuce']
        },
        {
            id: 3,
            title: 'Biryani',
            difficulty: 'hard',
            time: 60,
            description: 'Spicy rice dish',
            ingredients: ['rice', 'spices', 'vegetables']
        }
    ];

    // STATE
    let currentFilter = 'all';
    let currentSort = 'none';
    let searchQuery = '';
    let favorites = JSON.parse(localStorage.getItem('recipeFavorites')) || [];
    let debounceTimer;

    // DOM
    const recipeContainer = document.querySelector('#recipe-container');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const sortButtons = document.querySelectorAll('.sort-btn');
    const searchInput = document.querySelector('#search-input');
    const clearSearchBtn = document.querySelector('#clear-search');
    const recipeCountDisplay = document.querySelector('#recipe-count');

    // FILTERS
    const filterByDifficulty = (recipes, level) =>
        recipes.filter(r => r.difficulty === level);

    const filterFavorites = recipes =>
        recipes.filter(r => favorites.includes(r.id));

    const filterBySearch = (recipes, query) => {
        if (!query.trim()) return recipes;
        const q = query.toLowerCase();
        return recipes.filter(r =>
            r.title.toLowerCase().includes(q) ||
            r.description.toLowerCase().includes(q) ||
            r.ingredients.some(i => i.toLowerCase().includes(q))
        );
    };

    // SORT
    const applySort = (recipes, type) => {
        if (type === 'title') return [...recipes].sort((a, b) => a.title.localeCompare(b.title));
        if (type === 'time') return [...recipes].sort((a, b) => a.time - b.time);
        return recipes;
    };

    // RENDER
    const createRecipeCard = recipe => {
        const isFav = favorites.includes(recipe.id);
        return `
            <div class="recipe-card">
                <button class="favorite-btn" data-id="${recipe.id}">
                    ${isFav ? '❤️' : '🤍'}
                </button>
                <h3>${recipe.title}</h3>
                <p>${recipe.description}</p>
                <p><strong>Time:</strong> ${recipe.time} mins</p>
            </div>
        `;
    };

    const renderRecipes = recipes => {
        recipeContainer.innerHTML = recipes.map(createRecipeCard).join('');
    };

    const updateCounter = (showing, total) => {
        recipeCountDisplay.textContent = `Showing ${showing} of ${total} recipes`;
    };

    const updateDisplay = () => {
        let list = filterBySearch(recipes, searchQuery);

        if (currentFilter === 'favorites') list = filterFavorites(list);
        if (['easy', 'medium', 'hard'].includes(currentFilter))
            list = filterByDifficulty(list, currentFilter);

        list = applySort(list, currentSort);

        updateCounter(list.length, recipes.length);
        renderRecipes(list);
    };

    // FAVORITES
    const toggleFavorite = id => {
        id = Number(id);
        favorites = favorites.includes(id)
            ? favorites.filter(f => f !== id)
            : [...favorites, id];

        localStorage.setItem('recipeFavorites', JSON.stringify(favorites));
        updateDisplay();
    };

    // EVENTS
    const initEvents = () => {
        filterButtons.forEach(btn =>
            btn.addEventListener('click', e => {
                currentFilter = e.target.dataset.filter;
                updateDisplay();
            })
        );

        sortButtons.forEach(btn =>
            btn.addEventListener('click', e => {
                currentSort = e.target.dataset.sort;
                updateDisplay();
            })
        );

        searchInput.addEventListener('input', e => {
            clearTimeout(debounceTimer);
            clearSearchBtn.style.display = e.target.value ? 'block' : 'none';
            debounceTimer = setTimeout(() => {
                searchQuery = e.target.value;
                updateDisplay();
            }, 300);
        });

        clearSearchBtn.addEventListener('click', () => {
            searchInput.value = '';
            searchQuery = '';
            clearSearchBtn.style.display = 'none';
            updateDisplay();
        });

        recipeContainer.addEventListener('click', e => {
            if (e.target.classList.contains('favorite-btn')) {
                toggleFavorite(e.target.dataset.id);
            }
        });
    };

    const init = () => {
        initEvents();
        updateDisplay();
        console.log('RecipeJS Ready');
    };

    return { init };
})();

RecipeApp.init();
