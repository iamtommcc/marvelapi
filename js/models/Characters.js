import Model from '../app/Model';

export default class Characters extends Model {


  constructor() {
    super();
    this.fields = ['id', 'name', 'description', 'thumbnail', 'urls'];
    this.endpoint = 'characters';
    this.queryParams = 'limit=100';
  }

}