import { API_URL } from './config.js';
import { getJson } from './helper.js';
import { RESULT_PER_PAGE } from './config.js';


//Defining a object state for storing the the fetched data.
export const state = {
  recipe: {},
  search: {
    query: '',
    item: [],
    resultsPerPage: RESULT_PER_PAGE,
    page: 1,
    bookmarked:false,
  },
  bookmarks:[],
};


//Extracting the url from and sending it back to the controller for handling the recipies and all.

export const loadRecipe = async function (id) {
  try {
    const data = await getJson(`${API_URL}${id}`);

    let { recipe } = data.data;
     
    //  console.log(recipe);
    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrL: recipe.source_url,
      image: recipe.image_url,
      ingredients: recipe.ingredients,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
    };
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
    const data = await getJson(`${API_URL}?search=${query}`);
    let { recipes } = data.data;
    // console.log(recipes);
    state.search.item = recipes.map(el => {
      return {
        id: el.id,
        title: el.title,
        publisher: el.publisher,
        image: el.image_url,
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


export const addBookmark=function(recipe)
{  // Add bookmark
   state.bookmarks.push(recipe);

   //Mark current recipe as bookmark
    
   if(recipe.id === state.recipe.id) state.recipe.bookmarked=true;
    
}



