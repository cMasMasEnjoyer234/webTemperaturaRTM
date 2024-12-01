const fs = require('fs');

function saveData(temperature) {
  const data = `Timestamp: ${Date.now()}, Temperatura Promedio: ${temperature}\n`;  // Guardar como texto

  // Escribir los datos al final del archivo 'temperature.txt'
  fs.appendFile('temperature.txt', data, (err) => {
    if (err) {
      console.error("Error al guardar los datos:", err);
    } else {
      console.log("Datos guardados en temperature.txt");
    }
  });
}

module.exports = saveData;
