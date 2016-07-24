import Model from '../app/Model';

export default class Comics extends Model {


  constructor() {
    super();
    this.fields = ['id', 'title', 'description', 'urls', 'dates', 'thumbnail'];
    this.endpoint = 'comics';
    this.queryParams = 'limit=100';
  }

}