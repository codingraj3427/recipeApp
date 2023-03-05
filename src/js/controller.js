import * as model from './model.js';
import recipeview from './views/recipeView.js';
import searchview from './views/SearchView.js';
import paginationView from './views/PageView.js';
import resultView from './views/resultView.js';
import bookMark from './views/bookmarkView.js';
import addRecipeView from './views/addRecipeView.js';
import { FORM_OPEN } from './config.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

const recipeContainer = document.querySelector('.recipe');

console.log('Test');

//Old method of resolving a promise and fetch ing a data
// fetch('https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bc886')
//   .then(response => response.json())
//   .then(data => console.log(data));

//New method for gettting the data

//Using the moduel.hot fore perventinf the excerssive reload

if (module.hot) {
  module.hot.accept();
}

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    // console.log(id);

    if (!id) return;
    //Rendering the spinner
    recipeview.renderSpiner();

    //0 UPdating the recipe
    resultView.update(model.getSearchResultsPage());

    //Updating the bookmark
    bookMark.update(model.state.bookmarks);

    //1. Loading  recipe
    await model.loadRecipe(id);

    //2. Rendering recipe
    recipeview.render(model.state.recipe);
  } catch (error) {
    // console.log(error.message);
    recipeview.renderMessage();
    console.log(error);
  }
};

const controlSearchResults = async function () {
  try {
    //Displaying the result view

    resultView.renderSpiner();

    // console.log(resultView);

    //For getting the data from the input field
    // 1)Get search result.
    const query = searchview.getQuery();
    if (!query) return;

    // 2)Load search results.
    await model.loadSearchResult(query);

    // 3)Render results.

    // console.log(model.state.search.item);
    // console.log(model.getSearchResultsPage(1));
    resultView.render(model.getSearchResultsPage());

    //Render initial pafination buttons
    paginationView.render(model.state.search);
  } catch (error) {
    console.log(error);
  }
};

//For handling those buttons and for controlling them
const controlPagination = function (gotoPage) {
  resultView.render(model.getSearchResultsPage(gotoPage));

  //For rendering the pagination button again
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //Update the recipe servings (in state)
  model.updateServings(newServings);

  //Update the recipe view
  recipeview.update(model.state.recipe);
};

// Adding a bookmark controller here

const controlAddBookmark = function () {
  //Add or Remove the bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.removeBookmark(model.state.recipe.id);

  //Update the book mark here
  recipeview.update(model.state.recipe);

  //Now Display the book mark
  bookMark.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookMark.render(model.state.bookmarks);
};

//For Uploading the recipe we need to create a controller

const controlAddRecipe = async function (newRecipe) {
  // console.log(newRecipe);
  try {
    //Show loading spinner
    addRecipeView.renderSpiner();

    //Uploading new Recipe
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //Render new Recipe
    recipeview.render(model.state.recipe);

    //Success message
    addRecipeView.renderMessage();

    //Render bookmark view
    bookMark.render(model.state.bookmarks);

    //Changing the Id in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //close the Form
    setTimeout(function () {
      // addRecipeView.toggleWindow();
    }, FORM_OPEN * 1000);
  } catch (err) {
    console.log('😥😥', err);
    addRecipeView.renderError(err);
  }
};

// publisher subscripber pattern
const init = function () {
  bookMark.addHandlerRender(controlBookmarks);
  recipeview.addHandlerRender(controlRecipes);
  searchview.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  //Now this is for the handling the serving button
  recipeview.addHandlerUpdateServings(controlServings);
  recipeview.addHandlerBookmark(controlAddBookmark);
  addRecipeView.addHandlerUplaod(controlAddRecipe);
  console.log('welcome');
};

init();
