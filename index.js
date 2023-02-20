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

  if (window.gapi.client.getToken()) {
    writer.create(e);
  } else {
    alert("Login is required.");
  }
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
    downloader.save(`result_${Date.now()}.csv`, result);
  });
});

document.getElementById("clear").addEventListener("click", (e) => {
  console.clear();

  if (confirm("Are you sure you want to delete all data?") == true) {
    writer.deleteValues(undefined, "A1:Z100", (result) => {
      console.log(result);

      writer.getValues(undefined, "A1:Z100", (rows) => {
        console.log(rows);
      });
    });
  }
});
