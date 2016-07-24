import View from '../app/View';
import Handlebars from 'hbsfy/runtime';
import kebabCase from 'lodash/kebabCase';
import sortBy from 'lodash/sortBy';
import Fuse from 'fuse.js';

import indexTemplate from './templates/characterIndex.hbs';
import showTemplate from './templates/characterShow.hbs';
import loadingTemplate from './templates/loading.hbs';

export default class CharacterViews extends View {

  constructor() {
    super();
    this.characters = [];
    this.bindings();
    Handlebars.registerHelper("kebabCase", function(s) {
      return kebabCase(s);
    });
  }


  bindings() {
    document.querySelector('.js-index-search').addEventListener('input', this.indexFilterCharacters.bind(this));
  }

  /**
   * Filter the current view based on user inputs
   */
  indexFilterCharacters() {
    var fuzzySearch = new Fuse(this.characters, { threshold: 0.2, keys: ["name"] });
    var nameFilter = document.querySelector('.js-index-search').value;

    var filteredCharacters = (nameFilter == '' ? this.characters : fuzzySearch.search(nameFilter));

    this.render('.js-page-content', indexTemplate({characters: filteredCharacters}));
    return this;
  }

  /**
   * Index view (main list of all Marvel characters)
   * @param data
   */
  index(promise) {
    var characterProfile = document.querySelector('.js-character-modal');
    var mainPage = document.querySelector('.js-main-page');

    if (characterProfile.classList.contains('is-visible') || characterProfile.classList.contains('is-entering')) {
      characterProfile.classList.remove('is-visible');
      characterProfile.classList.remove('is-entering');
      characterProfile.classList.add('is-exiting');
    }
    mainPage.classList.remove('is-covered');

  document.querySelector('.js-page-content').innerHTML = loadingTemplate();

    promise.then(characters => {
      characters = sortBy(characters, character => character.name);
      this.characters = characters;

      this.render('.js-page-content', indexTemplate({characters: this.characters}));
      var event = document.createEvent('HTMLEvents');
      event.initEvent('input', true, false);
      document.querySelector('.js-index-search').dispatchEvent(event);
    });


  }

  /**
   * Individual character modal.
   * @param promise {Promise}
   * @param transition Should the modal slide in or out?
   */
  showCharacter(promise, transition = false) {
    var query = '.js-character-modal';
    var characterProfile = document.querySelector(query);
    var mainPage = document.querySelector('.js-main-page');
    characterProfile.classList.remove('is-exiting');
    characterProfile.classList.remove('is-visible');


    characterProfile.innerHTML = loadingTemplate();
    if (transition != 'is-visible') {
      window.setTimeout(() => {
        mainPage.classList.add('is-covered');
        characterProfile.classList.remove(transition);
        characterProfile.classList.add('is-visible');
      }, 700);

    }

    characterProfile.classList.add(transition);


    promise.then(data => {
      this.render(query, showTemplate(data));
    })



  }
}