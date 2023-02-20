import Authentication from "./js/Authentication.js";
import Writer from "./js/Writer.js";
import { downloader } from "./js/downloader.js";

const writer = new Writer();
const authentication = new Authentication(writer);

window.addEventListener("load", (e) => {
  console.log("load");

  authentication.initialize();
});

document.getElementById("create").addEventListener("click", (e) => {
  console.clear();

  writer.create(e);
});

document.getElementById("refresh").addEventListener("click", (e) => {
  console.clear();

  writer.getValues(undefined, "A1:Z100", (rows) => {
    console.log(rows);
  });
});

document.getElementById("download").addEventListener("click", (e) => {
  console.clear();

  downloader.mapping(writer.rows, (result) => {
    downloader.save("result.csv", result);
  });
});
