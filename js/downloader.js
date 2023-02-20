export const downloader = {
  mapping: function (rows, callback) {
    let result = "";

    for (const header of ["korea", "english", "china", "russia"]) {
      result += header + ",";
    }

    result += "\n";

    rows.forEach((row) => {
      for (const cell in row) {
        result += row[cell] + ",";
      }

      result += "\n";
    });

    return callback(result);
  },
  save: function (filename, contents) {
    const BOM = "\uFEFF";
    contents = BOM + contents;
    const blob = new Blob([contents], { type: "text/csv" });
    const link = document.createElement("a");
    link.download = filename;
    link.href = window.URL.createObjectURL(blob);
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
  },
};
