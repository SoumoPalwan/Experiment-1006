let bluetoothDevice;
let characteristic;

// Bluetooth Connection
document.getElementById("connect-btn").addEventListener("click", async () => {
    try {
        bluetoothDevice = await navigator.bluetooth.requestDevice({
            acceptAllDevices: true,
            optionalServices: ["00001234-0000-1000-8000-00805f9b34fb"] // Replace with correct UUID
        });
        console.log("Connected to Bluetooth device:", bluetoothDevice.name);
    } catch (error) {
        console.error("Bluetooth connection failed:", error);
    }
});

// Car Movement Controls
function sendCommand(command) {
    if (bluetoothDevice && characteristic) {
        const encoder = new TextEncoder();
        characteristic.writeValue(encoder.encode(command));
        console.log("Sent command:", command);
    } else {
        console.warn("Bluetooth not connected.");
    }
}

// Button Event Listeners
document.getElementById("forward-btn").addEventListener("mousedown", () => sendCommand("F"));
document.getElementById("forward-btn").addEventListener("mouseup", () => sendCommand("S"));

document.getElementById("backward-btn").addEventListener("mousedown", () => sendCommand("B"));
document.getElementById("backward-btn").addEventListener("mouseup", () => sendCommand("S"));

document.getElementById("left-btn").addEventListener("mousedown", () => sendCommand("L"));
document.getElementById("left-btn").addEventListener("mouseup", () => sendCommand("S"));

document.getElementById("right-btn").addEventListener("mousedown", () => sendCommand("R"));
document.getElementById("right-btn").addEventListener("mouseup", () => sendCommand("S"));

document.getElementById("stop-btn").addEventListener("click", () => sendCommand("S"));

// Sensor Reading
document.getElementById("sense-soil-btn").addEventListener("click", () => {
    alert("Reading soil data... (Functionality needs to be implemented)");
});
