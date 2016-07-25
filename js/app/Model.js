
import store from 'store';
import 'whatwg-fetch';
import find from 'lodash/find';
import es6Promise from 'es6-promise';
import kebabCase from 'lodash/kebabCase';

es6Promise.polyfill();
export default class Model {

  constructor() {
    this.fields = [];
    this.endpoint = '';
    this.queryParams = '';
    this.cache = true;
  }

  static get API_URL() {
    return 'https://gateway.marvel.com/v1/public/';
  }

  static get PUBLIC_KEY() {
    return 'c81e9d765916dfeac59c3538453e4bfc';
  }



  /**
   * Makes an API requests and if there are more results then can be retrieved
   * in a single request, keep making requests until all results have been found.
   * Local storage caching is used to avoid excessive API requests.
   * @param shouldCache {boolean} Cache results?
   * @returns {Promise}
   */
  fetchAll(shouldCache = true) {

    return new Promise((resolve, reject) => {
      var results = [];
      var requests = [];

      var query = this.endpoint + '?' + this.queryParams;

      // Check local storage first
      if (store.enabled && store.get(query) && shouldCache) {
        resolve(store.get(query));
      } else {

        // Make an initial call to get the total queries required,
        // then make a bunch of extra queries asynchronously if needed.
        Model.callAPI(query).then((json) => {
          var total = json.data.total;
          results = json.data.results;

          for (var offset = 100; offset < total; offset += 100) {
            requests.push(Model.callAPI(query + '&offset=' + offset).then((json) => {
              results = results.concat(json.data.results);

            }));
          }

          Promise.all(requests).then(() => {
            results = results.map(apiObject => {
              var newObject = {};

              this.fields.forEach(field => {
                newObject[field] = apiObject[field];
              });
              return newObject;

            });

            if (shouldCache && store.enabled) store.set(query, results);

            resolve(results);
          }).catch( () => {
            reject('There was an error communicating with the Marvel API. Please try again later.');
          });
        }).catch(() => {
          reject('Could not establish initial connection to the Marvel API. Please try again later.');
        });
      }
    });

  }

  /**
   * Finds a specific entry in the collection via property exact match.
   * @param searchKey The property which you're searching by (e.g. "id", "name")
   * @param searchValue The value you're using to search.
   * @returns {Promise}
   */
  findWhere(searchKey, searchValue) {
    return new Promise( (resolve, reject) => {
      this.fetchAll()
        .then((results) => {
          var findCharacter = find(results, result => {
            return kebabCase(result[searchKey]) == kebabCase(searchValue);
          });

          if (typeof findCharacter == 'undefined' || !findCharacter) {
            reject(`Couldn't find a ${searchKey} of ${searchValue} in ${this.endpoint}`);
          } else {
            resolve(findCharacter);
          }
        });
    });
  }


  /**
   * Given an endpoint, make an API get call.
   * @param endpoint The endpoint to use after the API URL
   * @returns {Promise}
   */
  static callAPI(endpoint) {
    return new Promise( (resolve, reject) => {


      var symbol;
      if (endpoint.indexOf('?') > -1 && endpoint.split('?')[1]) {
        symbol = '&';
      } else {
        symbol = '&';
      }
      fetch(Model.API_URL + endpoint + symbol + 'apikey=' + Model.PUBLIC_KEY)
        .then( (response) => {
          return response.json();
        }).then( (json) => {
         resolve(json);
      });
    });


  }
}