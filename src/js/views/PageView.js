import view from './View.js';
import icons from 'url:../../img/icons.svg';

class paginationView extends view {
  _parentEl = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentEl.addEventListener('click', function (e) {
      //This is the evenet delegation in javaScript
      const btn = e.target.closest('.btn--inline');
      if(!btn) return;
      const gotoPage=+btn.dataset.goto;
    
      handler(gotoPage);
    });
  }

  _generateMarkup() {
    const curPage = this._data.page;
    const numpages = Math.ceil(
      this._data.item.length / this._data.resultsPerPage
    );
    console.log(curPage);
    console.log(numpages);
    // Only page 1 id there and no other pages are preent
    if (curPage === 1 && numpages > 1) {
      return `<button data-goto="${
        curPage + 1
      }" class="btn--inline pagination__btn--next">
      <span>Page${curPage + 1}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button>`;
    }

    if (curPage === numpages && numpages > 1) {
      return `<button data-goto="${
        curPage - 1
      }"class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>Page${curPage - 1}</span>
    </button>`;
    }

    if (curPage < numpages) {
      return `<button data-goto="${
        curPage - 1
      }" class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>Page ${curPage - 1}</span>
    </button>
    <button data-goto="${
      curPage + 1
    }" class="btn--inline pagination__btn--next">
      <span>Page ${curPage + 1}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button> 
    `;
    }

    //Page 1 and there are no other pages

    return 'only page 1';
  }
}

export default new paginationView();
