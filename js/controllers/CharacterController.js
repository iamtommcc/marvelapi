import Characters from '../models/Characters';
import Comics from '../models/Comics';
import CharacterViews from '../views/CharacterViews';

import find from 'lodash/find';

import kebabCase from 'lodash/kebabCase';

export default class CharacterController {

  constructor() {
    this.views = new CharacterViews();
    this.characters = new Characters();
  }

  index() {

    var indexPromise = this.characters.fetchAll();
    this.views.index(indexPromise);

  }

  showCharacter(context) {
    var showPromise = this.characters.findWhere('name', context.params.name).then(chosenCharacter => {
        return new Promise( (resolve, reject) => {
          var characterComics = new Comics();
          characterComics.queryParams = 'limit=4&orderBy=-onsaleDate&characters=' + chosenCharacter.id;
          characterComics.fetchAll().then(comics => {
            comics = comics.filter(comic => {
              return comic.thumbnail.path.indexOf('not_available') == -1;
            });
            resolve({character: chosenCharacter, characterComics: comics.slice(0, 4)});
          });
        });
    });
      var transition = false;
      if (!context.init) {
        transition = 'is-entering';
      } else {
        transition = 'is-visible';
      }
      this.views.showCharacter(showPromise, transition);
    }

}