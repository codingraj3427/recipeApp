import { API_URL, KEY } from './config.js';
// import { getJson, sendJSON } from './helper.js';
import { AJAX } from './helper.js';
import { RESULT_PER_PAGE } from './config.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    item: [],
    resultsPerPage: RESULT_PER_PAGE,
    page: 1,
    bookmarked: false,
  },
  bookmarks: [],
};
//Creating a function

const createRecipeObject = function (data) {
  let { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrL: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }), //Only key added if required.
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}&key=${KEY}`);

    //  console.log(recipe);
    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some(bookmark => bookmark.id === id)) {
      state.recipe.bookmarked = true;
    } else {
      state.recipe.bookmarked = false;
    }
    console.log(state.recipe);
  } catch (error) {
    //Temporary error handling
    console.log(`${error.message} `);
    throw error;
  }
};
export const loadSearchResult = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    let { recipes } = data.data;
    // console.log(recipes);
    state.search.item = recipes.map(el => {
      return {
        id: el.id,
        title: el.title,
        publisher: el.publisher,
        image: el.image_url,
        ...(el.key && { key: el.key }),
      };
    });
    state.search.page = 1;
  } catch (error) {
    console.log(`${error.message} `);
    throw error;
  }
};

// loadSearchResult('Pizza');
// console.log(state);

// We only want toi display 10 results in one page and the next 20 results in the second page

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.item.slice(start, end);
};

//This is for updating the number pf servings or the number of cutomers
export const updateServings = function (newServings = state.search.servings) {
  state.recipe.ingredients.forEach(element => {
    element.quantity = (element.quantity * newServings) / state.recipe.servings;
  });

  state.recipe.servings = newServings; // This for updating the new servings in the recipe object
};

// For storing the book marks into the local storage

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  // Add bookmark
  state.bookmarks.push(recipe);

  //Mark current recipe as bookmark

  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};

export const removeBookmark = function (id) {
  //Delete bookmark
  const index = state.bookmarks.findIndex(el => el.id === id);

  state.bookmarks.splice(index, 1);
  //Mark current recipes as not bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
};

///Writing a init  function here

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};

init();

const clearBookmarks = function () {
  localStorage.clear('bookmakrs');
};

// clearBookmarks();

//For uploading the recipe by the user

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        //Storing it into an array
        const ingArr = ing[1].replaceAll(' ', '').split(',');
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient format! Please use the correct format.'
          );
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    console.log(recipe);

    const data_send = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data_send);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
