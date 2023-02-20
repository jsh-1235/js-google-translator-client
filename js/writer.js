import { SPREAD_SHEET_ID } from "./keys.js";

import Translator from "./translator.js";

import Speaker from "./speaker.js";

export default class Writer {
  constructor() {
    this.rows = [];

    this.getValues = this.getValues.bind(this);
    this.appendValues = this.appendValues.bind(this);
    this.updateValues = this.updateValues.bind(this);
    this.deleteValues = this.deleteValues.bind(this);

    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.remove = this.remove.bind(this);

    this.createHeader = this.createHeader.bind(this);
    this.createBody = this.createBody.bind(this);
    this.display = this.display.bind(this);

    this.speaker = new Speaker();

    this.translator = new Translator();
  }

  getValues(spreadsheetId = SPREAD_SHEET_ID, range, callback) {
    try {
      window.gapi.client.sheets.spreadsheets.values
        .get({
          spreadsheetId: spreadsheetId,
          range: range,
        })
        .then((response) => {
          const result = response.result;

          const count = result.values ? result.values.length : 0;

          if (count !== 0) {
            console.log(`${count} rows retrieved.`);

            this.rows = result.values;

            this.display(this.rows);

            if (callback) callback(this.rows);
          } else {
            console.log("No values found.");

            this.display(null);
          }
        });
    } catch (err) {
      console.error(err.message);
      return;
    }
  }

  appendValues(spreadsheetId = SPREAD_SHEET_ID, range, valueInputOption, _values, callback) {
    let values = [
      [
        // Cell values ...
      ],
      // Additional rows ...
    ];

    values = _values;

    const body = {
      values: values,
    };

    try {
      window.gapi.client.sheets.spreadsheets.values
        .append({
          spreadsheetId: spreadsheetId,
          range: range,
          valueInputOption: valueInputOption,
          resource: body,
        })
        .then((response) => {
          const result = response.result;

          console.log(`${result.updates.updatedCells} cells appended.`);

          if (callback) callback(result);
        });
    } catch (err) {
      console.error(err.message);
      return;
    }
  }

  updateValues(spreadsheetId = SPREAD_SHEET_ID, range, valueInputOption, _values, callback) {
    let values = [
      [
        // Cell values ...
      ],
      // Additional rows ...
    ];

    values = _values;

    const body = {
      values: values,
    };

    try {
      window.gapi.client.sheets.spreadsheets.values
        .update({
          spreadsheetId: spreadsheetId,
          range: range,
          valueInputOption: valueInputOption,
          resource: body,
        })
        .then((response) => {
          const result = response.result;
          console.log(`${result.updatedCells} cells updated.`);
          if (callback) callback(response);
        });
    } catch (err) {
      console.error(err.message);
      return;
    }
  }

  deleteValues(spreadsheetId = SPREAD_SHEET_ID, range, callback) {
    try {
      window.gapi.client.sheets.spreadsheets.values
        .clear({
          spreadsheetId: spreadsheetId,
          range: range,
        })
        .then((response) => {
          const result = response.result;

          console.log(response);

          console.log(`${result.updatedCells} cells deleted.`);

          if (callback) callback(response);
        });
    } catch (err) {
      console.error(err.message);
      return;
    }
  }

  create(e) {
    try {
      const input = document.getElementById("writer");

      if (input.value) {
        input.setAttribute("disabled", "");
        e.target.setAttribute("disabled", "");

        this.translator.apply(input.value, ["en", "zh", "ru"], (row) => {
          this.appendValues(undefined, "A1:Z100", "USER_ENTERED", [[row.kor, row.en, row.zh, row.ru]], (result) => {
            console.log(result);

            this.getValues(undefined, "A1:Z100", (rows) => {
              console.log(rows);

              document.getElementById("content").scrollTop = document.getElementById("content").scrollHeight;

              console.log("scrollHeight", document.getElementById("content").scrollHeight);
            });

            input.removeAttribute("disabled");
            document.getElementById("create").removeAttribute("disabled");

            input.value = "";
            input.focus();
          });
        });
      } else {
        alert("No target to translate has been entered.");
      }
    } catch (err) {
      console.error(err.message);
    } finally {
    }
  }

  update(e, index) {
    if (window.gapi.client.getToken()) {
      console.clear();

      let target = prompt("Please Enter the text you want to change!", `${e.target.dataset.value}`);

      if (target != null) {
        e.target.setAttribute("disabled", "");

        this.translator.apply(target, ["en", "zh", "ru"], (row) => {
          console.log(row);

          this.updateValues(undefined, `A${index}:D${index}`, "USER_ENTERED", [[row.kor, row.en, row.zh, row.ru]], (result) => {
            console.log(result);

            e.target.removeAttribute("disabled");

            this.getValues(undefined, "A1:Z100", (rows) => {
              console.log(rows);
            });
          });
        });
      }
    } else {
      alert("Login is required.");
    }
  }

  remove(e, index) {
    if (window.gapi.client.getToken()) {
      console.clear();

      e.target.setAttribute("disabled", "");

      const filtered = this.rows.filter((row, i) => i !== index);

      this.deleteValues(undefined, "A1:Z100", (result) => {
        this.appendValues(undefined, "A1:Z100", "USER_ENTERED", filtered, (result) => {
          console.log(result);

          e.target.removeAttribute("disabled");

          this.getValues(undefined, "A1:Z100", (rows) => {
            console.log(rows);
          });
        });
      });
    } else {
      alert("Login is required.");
    }
  }

  createHeader(headers) {
    let html = "<tr>";

    headers.forEach((header) => {
      html += `<th>${header}</th>`;
    });

    html += "</tr>";

    document.querySelector("thead").innerHTML = html;
  }

  createBody(rows) {
    document.querySelector("tbody").innerHTML = rows
      .map((row, index) => {
        return `<tr>
                  <td class="cell" data-lang="ko-KR">${row[0]}</td>
                  <td class="cell" data-lang="zh-CN">${row[1]}</td>
                  <td class="cell" data-lang="en-US">${row[2]}</td>
                  <td class="cell" data-lang="ru-RU">${row[3]}</td>
                  <td><button id="update" data-index=${index} data-value=${row[0]} class="button fa-sharp fa-solid fa-pen"></button></td>
                  <td><button id="delete" data-index=${index} class="button fa-sharp fa-solid fa-trash"></button></td>
                </tr>`;
      })
      .reduce((a, b) => a + b);
  }

  display(rows) {
    this.createHeader(["korea", "english", "china", "russia", "update", "delete"]);

    if (rows) {
      this.createBody(rows);

      const elements = document.querySelector("tbody").childNodes;

      elements.forEach((element) => {
        element.childNodes.forEach((target) => {
          if (target.getElementsByTagName) {
            target.addEventListener("click", (e) => {
              if (e.target.dataset.lang) {
                this.speaker.play(e.target.dataset.lang, e.target.innerText);
              } else {
                if (e.target.dataset.index) {
                  if (e.target.id === "update") {
                    this.update(e, Number(e.target.dataset.index) + 1);
                  } else if (e.target.id === "delete") {
                    this.remove(e, Number(e.target.dataset.index));
                  }
                }
              }
            });
          }
        });
      });
    } else {
      document.querySelector("tbody").innerHTML = "";
    }
  }
}
