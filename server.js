// const express = require('express');
// const app = express();
// const PORT = 3000;

// let data = []; // Array to store generated data

// app.use(express.json());

// // Route to receive and store data from the client
// app.post('/data', (req, res) => {
//   const newData = req.body;
//   data.push(newData);
//   console.log('Data received:', newData);
//   res.sendStatus(200);
// });

// // Route to send the stored data to the client
// app.get('/data', (req, res) => {
//   res.json(data);
// });

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server listening on port ${PORT}`);
// });


// const express = require('express');
// const Chart = require('chart.js');

// const app = express();
// const PORT = 3000;

// // Generate random data
// function generateData() {
//   return Math.floor(Math.random() * 100);
// }

// // Store generated data
// const dataStore = [];

// // Generate and store data every second
// setInterval(() => {
//   const data = {
//     timestamp: new Date().toLocaleTimeString(),
//     value: generateData(),
//   };
//   dataStore.push(data);
// }, 1000);

// // Serve the client-side code
// app.use(express.static('public'));

// // API endpoint to send data to the client
// app.get('/api/data', (req, res) => {
//   res.json(dataStore);
// });

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });






// const express = require('express');
// const http = require('http');
// const socketIO = require('socket.io');
// const Chart = require('chart.js');

// const app = express();
// const server = http.createServer(app);
// const io = socketIO(server);

// const PORT = 3000;

// // Generate random data
// function generateData() {
//   return Math.floor(Math.random() * 100);
// }

// // Store generated data
// const dataStore = [];

// // Generate and store data every second
// setInterval(() => {
//   const data = {
//     timestamp: new Date().toLocaleTimeString(),
//     value: generateData(),
//   };
//   dataStore.push(data);

//   // Emit data to connected clients
//   io.emit('data', data);
// }, 1000);

// // Serve the client-side code
// app.use(express.static('public'));

// // Start the server
// server.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });



// generatig data and showing only latest & previous one gets shifted


const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const Chart = require('chart.js');
const Chance = require('chance');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = 3000;
const dataFilePath = 'data.csv';
const chance = new Chance();

// Generate random data for machine sensors
function generateMachineData() {
  return {
    timestamp: new Date().toLocaleString(),
    temperature: chance.floating({ min: 20, max: 400, fixed: 2 }),
    humidity: chance.floating({ min: 40, max: 700, fixed: 2 }),
    pressure: chance.floating({ min: 800, max: 1200, fixed: 2 }),
  };
}

// Store generated data
let dataStore = [];

// Load existing data from CSV file
if (fs.existsSync(dataFilePath)) {
  const csvData = fs.readFileSync(dataFilePath, 'utf8');
  const lines = csvData.split('\n');
  lines.forEach((line) => {
    if (line) {
      const [timestamp, temperature, humidity, pressure] = line.split(',');
      dataStore.push({
        timestamp,
        temperature: parseFloat(temperature),
        humidity: parseFloat(humidity),
        pressure: parseFloat(pressure),
      });
    }
  });
}

// Generate and store data every second
setInterval(() => {
  const data = generateMachineData();
  dataStore.push(data);

  // Emit data to connected clients
  io.emit('data', data);

  // Save data to CSV file
  const csvRow = `${data.timestamp},${data.temperature},${data.humidity},${data.pressure}\n`;
  fs.appendFileSync(dataFilePath, csvRow);
}, 1000);

// Serve the client-side code
app.use(express.static('public'));

// API endpoint to send data to the client
app.get('/api/data', (req, res) => {
  res.json(dataStore);
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});




// similar to above but user can see the previous data also by clicking on a button


// const express = require('express');
// const http = require('http');
// const socketIO = require('socket.io');
// const fs = require('fs');
// const csvWriter = require('csv-writer').createObjectCsvWriter;
// const Chance = require('chance');

// const chance = new Chance();

// const app = express();
// const server = http.createServer(app);
// const io = socketIO(server);

// const dataFilePath = 'data.csv';

// // Create a new CSV file and write the header row
// fs.writeFileSync(dataFilePath, 'timestamp,temperature,humidity,pressure\n');

// // Generate and store new data every second
// setInterval(() => {
//   const timestamp = new Date().toISOString();
//   const temperature = chance.integer({ min: 20, max: 400 });
//   const humidity = chance.integer({ min: 30, max: 700 });
//   const pressure = chance.integer({ min: 800, max: 1200 });

//   const newData = `${timestamp},${temperature},${humidity},${pressure}\n`;

//   // Append the new data to the CSV file
//   fs.appendFileSync(dataFilePath, newData);

//   // Emit the new data to connected clients
//   io.emit('data', { timestamp, temperature, humidity, pressure });
// }, 1000);

// // Serve static files from the "public" directory
// app.use(express.static('public'));

// // API endpoint to fetch the latest data
// app.get('/api/data', (req, res) => {
//   // Read the CSV file and send the data as JSON response
//   const csvData = fs.readFileSync(dataFilePath, 'utf-8');
//   const rows = csvData.trim().split('\n');
//   const header = rows.shift().split(',');

//   const data = rows.map((row) => {
//     const values = row.split(',');
//     const item = {};
//     header.forEach((key, index) => {
//       item[key] = values[index];
//     });
//     return item;
//   });

//   res.json(data);
// });

// // API endpoint to fetch previous data
// app.get('/api/previous-data', (req, res) => {
//   // Read the CSV file and send the data as JSON response
//   const csvData = fs.readFileSync(dataFilePath, 'utf-8');
//   const rows = csvData.trim().split('\n');
//   const header = rows.shift().split(',');

//   const data = rows.map((row) => {
//     const values = row.split(',');
//     const item = {};
//     header.forEach((key, index) => {
//       item[key] = values[index];
//     });
//     return item;
//   });

//   res.json(data);
// });

// // Start the server
// const port = process.env.PORT || 3000;
// server.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });


