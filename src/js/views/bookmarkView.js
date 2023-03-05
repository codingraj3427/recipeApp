import View from './View.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';

class bookmarksView extends View {
  _parentEl = document.querySelector('.bookmarks__list');
  _errorMessage =
    'No bookmarks yet😥😥😥😥.Find a new recipe and book mark it.';
  _message = '';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkup() {
    console.log(this._data);
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
}

export default new bookmarksView();
