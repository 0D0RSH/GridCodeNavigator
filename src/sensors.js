let sensorData = {
    accelerometer: { x: 0, y: 0, z: 0 },
    gyroscope: { alpha: 0, beta: 0, gamma: 0 },
    magnetometer: { x: 0, y: 0, z: 0 }
};

// Function to check and start the sensors
function startSensors() {
    // Accelerometer
    if ('Accelerometer' in window) {
        let accelerometer = new Accelerometer({ frequency: 10 });
        accelerometer.addEventListener('reading', () => {
            sensorData.accelerometer.x = accelerometer.x;
            sensorData.accelerometer.y = accelerometer.y;
            sensorData.accelerometer.z = accelerometer.z;
        });
        accelerometer.start();
    }

    // Gyroscope
    if ('Gyroscope' in window) {
        let gyroscope = new Gyroscope({ frequency: 10 });
        gyroscope.addEventListener('reading', () => {
            sensorData.gyroscope.alpha = gyroscope.x;
            sensorData.gyroscope.beta = gyroscope.y;
            sensorData.gyroscope.gamma = gyroscope.z;
        });
        gyroscope.start();
    }

    // Magnetometer
    if ('Magnetometer' in window) {
        let magnetometer = new Magnetometer({ frequency: 10 });
        magnetometer.addEventListener('reading', () => {
            sensorData.magnetometer.x = magnetometer.x;
            sensorData.magnetometer.y = magnetometer.y;
            sensorData.magnetometer.z = magnetometer.z;
        });
        magnetometer.start();
    }
}

// Function to send data to FastAPI
function sendSensorData() {
    fetch('http://your-server-ip:8000/sensor-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sensorData)
    })
    .then(response => response.json())
    .then(data => console.log("Sensor data sent:", data))
    .catch(error => console.error("Error sending sensor data:", error));
}

// Request permissions and start sensors
async function requestPermissions() {
    try {
        if (typeof DeviceMotionEvent.requestPermission === 'function') {
            const permission = await DeviceMotionEvent.requestPermission();
            if (permission === 'granted') {
                startSensors();
                setInterval(sendSensorData, 2000);  // Send data every 2 seconds
            } else {
                console.log("Permission denied for motion sensors.");
            }
        } else {
            startSensors();
            setInterval(sendSensorData, 2000);
        }
    } catch (error) {
        console.error("Error requesting sensor permissions:", error);
    }
}

// Call the function when the page loads
document.addEventListener("DOMContentLoaded", requestPermissions);