import icons from 'url:../../img/icons.svg';

export default class View {
  _data;

  /**
   * Render the received object to the DOM
   * @param {Object | Object[]} data  The data to be rendered(e.g. Recipe) 
   * @param {boolean} [render=true]  If false,Create markup string instead of rendering to the DOM  
   * @returns {undefined | string} A markup string is returned if render=false
   * @this View instance 
   * @author Rajrshi Chakraborty
   * @todo Finish implementation  
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;
    const markup = this._generateMarkup();

    // THis is writing only for generating a string here.
    if (!render) return markup;

    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;
    const newMarkup = this._generateMarkup();
    //Creating a virtual Dom here.
    const newDom = document.createRange().createContextualFragment(newMarkup);
    //Converting the node list into an array
    const newElements = Array.from(newDom.querySelectorAll('*'));
    const curElements = Array.from(this._parentEl.querySelectorAll('*'));
    // console.log(curElements);
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      // console.log(curEl, newEl.isEqualNode(curEl));

      //We need the exact text from that particular element

      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        // console.log('😁', newEl.firstChild?.nodeValue.trim());
        curEl.textContent = newEl.textContent;
      }

      //Updates changed by Attributes
      if (!newEl.isEqualNode(curEl))
        // console.log(Array.from(newEl.attributes));
        Array.from(newEl.attributes).forEach(element => {
          curEl.setAttribute(element.name, element.value);
        });
    });
  }

  _clear() {
    this._parentEl.innerHTML = '';
  }

  renderSpiner() {
    const markup = `<div class="spinner">
         <svg>
           <use href='${icons}#icon-loader'></use>
         </svg>
       </div>`;
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }
  //Creating the new error

  renderError(message = this._errorMessage) {
    const markup = `<div class="error">
        <div>
          <svg>
            <use href= "${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>`;
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  //Creating the new message
  renderMessage(message = this._message) {
    const markup = `<div class="message">
                  <div>
                    <svg>
                      <use href= " ${icons}#icon-smile"></use>
                    </svg>
                  </div>
                  <p>${message}</p>
                </div>`;
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }
}
