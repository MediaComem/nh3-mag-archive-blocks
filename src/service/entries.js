const API_TOKEN = require('../../.nh3-api-token.json');
const API_URL = 'http://localhost:666'
const TRUE_API_URL = 'https://dev2.notrehistoire.ch/api/v1'

// Required headers for all requests.
const headers = (() => {
  var defaultHeaders = new Headers();
  defaultHeaders.append("Authorization", `Bearer ${API_TOKEN}`);
  return defaultHeaders;
})();

const API_ENDPOINT = '/entries';

/**
 * Fetch an NH3 entry based on its hash value, including its media and its user.
 * @param {String} hash The entry hash
 * @returns {Promise} A promise of a JSON representation of the fetched entry
 */
export function getEntriesByHash(hash) {
  return fetch(`${API_URL}${API_ENDPOINT}?filter[hash_id]=${hash}&include=media,user`,
    {
      headers
    })
    .then(result => result.json());
}

/**
 * Fetch an NH3 entry based on the ID of its media, including its media and its user.
 * @param {Number} mediaId The entry's media ID
 * @returns {Promise} A promise of a JSON representation of the fetched entry
 */
export function getEntriesByMediaId(mediaId) {
  return fetch(`${API_URL}${API_ENDPOINT}?filter[media_id]=${mediaId}&include=media,user`,
    { headers })
    .then(result => result.json());
}