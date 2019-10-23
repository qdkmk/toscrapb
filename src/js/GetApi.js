import env from './env.js'
const axios = require('axios');

class GetApi {
  getgapi(isbn) {
    return new Promise((resolve,reject) => {

      let baseurl = "https://www.googleapis.com/books/v1/volumes?q=isbn:"
      let text = "";
      axios.get(baseurl + isbn).then(response => {
        if (!this.consistData(response.data.items)) {
          reject("Google Booksに登録されていないISBNです");
        } else {
          let item = response.data.items[0].volumeInfo;
          text = "[***** [" + item.title + "]]\n[* 著者:[" + item.authors + "]]";

          //発行日有無
          if (this.consistData(item.publishedDate)) {
            text += "\n発行日:" + item.publishedDate;
          }

          //ISBN13有無
          if (this.consistData(item.industryIdentifiers[1].identifier)) {
            text += "\nISBN:" + item.industryIdentifiers[1].identifier;
          }
          //description有無
          if (this.consistData(item.description)) {
            text += "\n説明:" + item.description;
          }
          //thumbnail有無
          if (this.consistData(item.imageLinks)　&& this.consistData(item.imageLinks.thumbnail)) {
              text += "\n[" + item.imageLinks.thumbnail + ".png]";
          }
        }
        resolve(text);
      })
    });
  }

  consistData(data) {
    if (data !== null && typeof(data) !== "undefined") return true;
  }
}
export default new GetApi()
