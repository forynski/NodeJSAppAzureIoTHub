require('dotenv').config();
const { clientFromConnectionString } = require('azure-iot-device-http');
const { Message } = require('azure-iot-device');

const connectionString = process.env.IOT_HUB_CONNECTION_STRING;

// console.log(process.env);

if (!connectionString) {
    console.error('Error: IoT Hub connection string is not set.');
    process.exit(1);
}

const client = clientFromConnectionString(connectionString);

const connectCallback = (err) => {
    if (err) {
        console.error('Error connecting to IoT Hub:', err);
        process.exit(1);
    }

    console.log('Client connected');

    // Sample telemetry data
    const telemetryData = {
        temperature: 25.5,
        humidity: 60.0,
        pressure: 1013.25,
        timestamp: new Date().toISOString(),
    };

    const message = new Message(JSON.stringify(telemetryData));

    // Send the telemetry message
    client.sendEvent(message, (sendErr) => {
        if (sendErr) {
            console.error('Error sending telemetry:', sendErr.toString());
        } else {
            console.log('Telemetry sent successfully');
        }
    });

    // Listen for messages from IoT Hub
    client.on('message', (msg) => {
        console.log('Received message:', msg.getData());
        client.complete(msg, () => {
            console.log('Completed');
        });
    });
};

client.open(connectCallback);