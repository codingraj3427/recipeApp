class SearcView {
  _parentEl = document.querySelector('.search');
  _search_btn = document.querySelector('.search__btn');
  //   #searchbtn = document.querySelector('.search__btn').
  getQuery() {
    const query = this._parentEl.querySelector('.search__field').value;
    this._clearInput();
    return query;
  }

  //For clearing the input field.
  _clearInput() {
    this._parentEl.querySelector('.search__field').value = '';
  }

  //This is a publisher model and we have to subscribe it in controller.
  addHandlerSearch(handler) {
    this._search_btn.addEventListener('click', function (e) {
      e.preventDefault();
      handler();    //This is the handler function.
    });
  }
}

export default new SearcView();
