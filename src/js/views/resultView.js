import View from './View.js';
import icons from 'url:../../img/icons.svg';
import previewView from './previewView.js';

class ResultView extends View {
  _parentEl = document.querySelector('.results');
  _errorMessage = 'No recipes found. Please try again .😥😥😥😥';
  _message = '';

  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new ResultView();
