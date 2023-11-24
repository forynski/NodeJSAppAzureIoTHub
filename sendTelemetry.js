const { Client: IoTHubClient } = require('azure-iot-device-http');
const fetch = require('node-fetch');

const connectionString = 'YOUR_AZURE_IOT_HUB_CONNECTION_STRING';

const client = IoTHubClient.fromConnectionString(connectionString);

// Function to send telemetry data to Azure IoT Hub
async function sendTelemetry(data) {
    try {
        const message = {
            messageId: Date.now().toString(),
            content: JSON.stringify(data),
        };

        await client.sendEvent(message);

        console.log('Telemetry data sent successfully:', data);
    } catch (error) {
        console.error('Error sending telemetry data:', error.message);
    }
}

// Example: Sending accelerometer data
const accelerometerData = {
    accelerometerX: 0.5,
    accelerometerY: 0.2,
    accelerometerZ: -0.1,
    vibration: 0.8,
};

// Send telemetry data
sendTelemetry(accelerometerData);
