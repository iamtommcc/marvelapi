import page from 'page';



import CharacterController from './controllers/CharacterController';

class App {
  constructor() {
    this.store = {};
    this.controllers = {
      character: new CharacterController()
    }
  }

    route() {
      page('/', () => { this.controllers.character.index() });
      page('/:name', (context, next) => {

        this.controllers.character.showCharacter(context, next)

      });
      page({hashbang: true});

      page.start();
    }


}

window.app = new App();
window.app.route();