
export default class View {
  render(querySelector, markup) {

    var element = document.querySelector(querySelector);

    if (element === null) {
      alert('Error rendering template: could not find ' + querySelector + ' anywhere on page.');
      return true;
    } else {
      element.innerHTML = markup;
      return false;
    }

  }
}