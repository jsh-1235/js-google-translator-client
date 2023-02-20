import { API_KEY } from "./keys.js";

export default class Translator {
  constructor() {
    this.apply = this.apply.bind(this);
    this.translate = this.translate.bind(this);
  }

  apply(source, languages, callback) {
    try {
      console.clear();

      const row = {};

      row["kor"] = source;

      languages.forEach((language, index) => {
        this.translate("ko", language, source, (target, translatedText) => {
          row[target] = translatedText;

          if (Object.keys(row).length == languages.length + 1) {
            console.log(row, Object.keys(row).length);

            callback(row);
          }
        });
      });
    } catch (error) {
      console.log(error);
    }
  }

  translate(from, to, source, callback) {
    let url = `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`;
    url += "&q=" + encodeURI(source);
    url += `&source=${from}`;
    url += `&target=${to}`;

    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((result) => {
        const translatedText = result.data.translations?.[0]?.translatedText;

        callback(to, translatedText);
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
