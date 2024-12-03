const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

// Configuración del servidor Express
const app1 = express();
const server = http.createServer(app1);
const PORT = 3005;

// WebSocket Server
const wss = new WebSocket.Server({ noServer: true });




wss.on('connection', (ws) => {
  console.log('Cliente conectado');
  const interval = setInterval(() => {
    // Generar datos simulados
    const simulatedTemperatures = Array.from({ length: 10 }, () =>
      parseFloat((Math.random() * (40 - 20) + 20).toFixed(1))
    );
    const averageTemp = simulatedTemperatures.reduce((sum, temp) => sum + temp, 0) / simulatedTemperatures.length;

    console.log('Enviando temperatura promedio:', averageTemp);
    ws.send(JSON.stringify({ averageTemperature: averageTemp }));
  }, 2500);

  ws.on('close', () => {
    console.log('Cliente desconectado');
    clearInterval(interval);
  });
});

// Configuración del servidor para manejar WebSockets
server.on('upgrade', (req, socket, head) => {
  wss.handleUpgrade(req, socket, head, (ws) => {
    wss.emit('connection', ws, req);
  });
});

// Servir la carpeta 'scripts' como archivos estáticos
app1.use('/scripts', express.static('scripts'));

// Configurar Express para servir archivos estáticos (si es necesario)
app1.use(express.static('public'));

// Parsear cuerpo de la solicitud como JSON
app1.use(express.json());

// Endpoint para guardar los datos
app1.post('/save', (req, res) => {
  const newData = req.body;

  // Leer los datos existentes o inicializar un array vacío
  const filePath = path.join(__dirname, 'temperature_data.json');
  const existingData = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath)) : [];

  // Agregar los nuevos datos
  existingData.push(newData);

  // Guardar los datos actualizados
  fs.writeFile(filePath, JSON.stringify(existingData, null, 2), (err) => {
    if (err) {
      console.error("Error al guardar los datos:", err);
      res.status(500).json({ error: 'Error al guardar los datos' });
    } else {
      res.status(200).json({ message: 'Datos guardados exitosamente' });
    }
  });
});
// Endpoint para borrar los datos guardados
app1.delete('/delete', (req, res) => {
  const filePath = path.join(__dirname, 'temperature_data.json');

  // Escribir un array vacío en el archivo
  fs.writeFile(filePath, '[]', (err) => {
    if (err) {
      console.error("Error al borrar los datos:", err);
      res.status(500).json({ error: 'Error al borrar los datos' });
    } else {
      console.log("Datos borrados y archivo reiniciado correctamente");
      res.status(200).json({ message: 'Datos borrados y archivo reiniciado correctamente' });
    }
  });
});


// Endpoint para cargar los datos
app1.get('/load', (req, res) => {
  const filePath = path.join(__dirname, 'temperature_data.json');
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, 'utf8');
    res.status(200).json(JSON.parse(data));
  } else {
    res.status(404).json({ error: 'Archivo no encontrado' });
  }
});

// Iniciar el servidor
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
