require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { Client, Message } = require('azure-iot-device');

const app = express();
const port = process.env.PORT || 8080;

// Azure IoT Hub connection string
const connectionString = process.env.IOT_HUB_CONNECTION_STRING;
const client = Client.fromConnectionString(connectionString, require('azure-iot-device-mqtt').Mqtt);

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Endpoint to receive data from React Native app
app.post('/sendData', (req, res) => {
    const data = req.body;

    // Convert data to JSON
    const message = new Message(JSON.stringify(data));

    // Send the message to Azure IoT Hub
    client.sendEvent(message, (err) => {
        if (err) {
            console.error('Error sending message to Azure IoT Hub:', err.toString());
            res.status(500).send('Internal Server Error');
        } else {
            console.log('Message sent to Azure IoT Hub');
            res.status(200).send('OK');
        }
    });
});

// Simple route to handle the root path
app.get('/', (req, res) => {
    res.send('Hello, this is your Azure IoT Hub server.');
});

// Start the server
app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
});
