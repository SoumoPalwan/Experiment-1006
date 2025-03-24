let bluetoothDevice;
let bluetoothCharacteristic;
let soilDataCharacteristic;

// Function to connect Bluetooth
async function connectBluetooth() {
    try {
        bluetoothDevice = await navigator.bluetooth.requestDevice({
            acceptAllDevices: true,
            optionalServices: ['00001101-0000-1000-8000-00805F9B34FB'] // Standard Serial UUID
        });

        const server = await bluetoothDevice.gatt.connect();
        const service = await server.getPrimaryService('00001101-0000-1000-8000-00805F9B34FB');
        bluetoothCharacteristic = await service.getCharacteristic('00002A57-0000-1000-8000-00805F9B34FB');

        // Start listening for sensor data
        soilDataCharacteristic = await service.getCharacteristic('00002A58-0000-1000-8000-00805F9B34FB');
        soilDataCharacteristic.addEventListener('characteristicvaluechanged', handleSensorData);
        await soilDataCharacteristic.startNotifications();

        alert("✅ Bluetooth Connected!");
    } catch (error) {
        alert("❌ Bluetooth Connection Failed!");
        console.error(error);
    }
}

// Function to send movement commands
async function move(direction) {
    if (!bluetoothCharacteristic) {
        alert("⚠️ Connect to Bluetooth first!");
        return;
    }

    let command = "";
    switch (direction) {
        case "up": command = "F"; break;
        case "down": command = "B"; break;
        case "left": command = "L"; break;
        case "right": command = "R"; break;
        case "stop": command = "S"; break;
    }

    try {
        await bluetoothCharacteristic.writeValue(new TextEncoder().encode(command));
        console.log("Sent:", command);
    } catch (error) {
        console.error("Error sending command:", error);
    }
}

// Function to request soil data
async function senseSoil() {
    if (!bluetoothCharacteristic) {
        alert("⚠️ Connect to Bluetooth first!");
        return;
    }

    try {
        await bluetoothCharacteristic.writeValue(new TextEncoder().encode("D")); // Request data
        console.log("Requested Soil Data");
    } catch (error) {
        console.error("Error requesting soil data:", error);
    }
}

// Function to handle incoming soil sensor data
function handleSensorData(event) {
    let value = new TextDecoder().decode(event.target.value);
    console.log("Received Sensor Data:", value);

    // Expecting data format: "moisture,temperature,humidity"
    let [moisture, temperature, humidity] = value.split(",");

    document.getElementById("moisture").innerText = moisture + "%";
    document.getElementById("temperature").innerText = temperature + "°C";
    document.getElementById("humidity").innerText = humidity + "%";
}

// Event Listeners
document.getElementById("connectBtn").addEventListener("click", connectBluetooth);
document.getElementById("senseSoilBtn").addEventListener("click", senseSoil);
