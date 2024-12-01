const fs = require('fs');

function getData() {
  fs.readFile('temperature.txt', 'utf8', (err, data) => {
    if (err) {
      console.error("Error al leer el archivo:", err);
    } else {
      console.log("Datos cargados desde el archivo:", data);
    }
  });
}

module.exports = getData;
