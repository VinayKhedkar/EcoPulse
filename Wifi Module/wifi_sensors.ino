#include <WiFi.h>
#include <WebSocketsServer.h>
#include <DHT.h>
#include <ArduinoJson.h>
#include <Preferences.h>
#include <LittleFS.h>  // Include LittleFS instead of SPIFFS

// WiFi Access Point Credentials
const char* ssid = "ESP32_Sensor";
const char* password = "12345678";

// WebSocket Server on Port 80
WebSocketsServer webSocket = WebSocketsServer(80);

// Static IP Configuration
//IPAddress local_IP(192, 168, 4, 1);
//IPAddress gateway(192, 168, 4, 1);
//IPAddress subnet(255, 255, 255, 0);

#define DHTPIN 4
#define DHTTYPE DHT11
#define SOIL_PIN 25
#define TEMP_SENSOR 26

DHT dht(DHTPIN, DHTTYPE);
Preferences preferences;

unsigned long lastTime = 0;
int connectedClients = 0;
bool wasWifiConnected = false;

const long interval = 1000; // Send data at the desired interval
unsigned long previousMillis = 0; // will hold the interval time

void setup() {
    Serial.begin(115200);

    // Attempt to start WiFi in Access Point mode
    //WiFi.softAPConfig(local_IP, gateway, subnet);
    WiFi.softAP(ssid, password);  // 8 Clients Max
    WiFi.setSleep(false);  // Prevent WiFi from entering sleep mode

    // Print WiFi AP info
    Serial.println("Starting Access Point...");
    Serial.print("AP IP Address: ");
    Serial.println(WiFi.softAPIP());

    // Start WebSocket server
    webSocket.begin();
    webSocket.onEvent(webSocketEvent);
    webSocket.enableHeartbeat(5000, 3000, 5);  // WebSocket Keepalive
    Serial.println("WebSocket server started on port 80");

    // Initialize DHT sensor and Preferences
    dht.begin();
    preferences.begin("sensor_data", false);

    // Initialize LittleFS for flash memory
    if (!LittleFS.begin(true)) {  // 'true' forces formatting
        Serial.println("LittleFS Mount Failed");
        return;
    }
    Serial.println("LittleFS Mounted Successfully!");
    testLittleFS();
    checkFlashMemory();
}

void loop() {
    webSocket.loop();  // Handle WebSocket events
    unsigned long currentMillis = millis();
    if (currentMillis - previousMillis >= interval){
      previousMillis = currentMillis;
    //checkWiFi();  // Ensure WiFi stays stable
      Serial.print("AP IP Address: ");
      Serial.println(WiFi.softAPIP());

      StaticJsonDocument<256> jsonDoc;

    // Get timestamp
      unsigned long timestamp = millis() / 1000; // Time since ESP32 started (in seconds)

    // Read temperature and humidity from DHT sensor
      float temp = dht.readTemperature();
      float hum = dht.readHumidity();
      if (!isnan(temp) && !isnan(hum)) {
          jsonDoc["DHT_Temperature"] = temp;
         jsonDoc["Humidity"] = hum;
      }  else {
         Serial.println("Failed to read from DHT sensor!");
      }

    // Read soil moisture sensor
      int soilValue = analogRead(SOIL_PIN);
      float moisture = (4095 - soilValue) * 100.0 / 4095.0;
      jsonDoc["Soil_Moisture"] = moisture;

    // Read analog temperature sensor (e.g., LM35)
    // int sensorValue = analogRead(TEMP_SENSOR);
    // float voltage = sensorValue * (3.3 / 4095.0);
    // float temperature = voltage * 100.0; // Assuming LM35
    // Serial.print("Sensval:");
    // Serial.println(sensorValue);
    //jsonDoc["Analog_Temperature"] = temperature;

      // Add timestamp to JSON
      jsonDoc["Timestamp"] = timestamp;

      // Convert JSON to string
      String jsonString;
      serializeJson(jsonDoc, jsonString);

      // Print JSON to Serial Monitor
      Serial.println(jsonString);

      // Check flash memory usage
      checkFlashMemory();

      // Check Wi-Fi status using WiFi.status() and update WebSocket client status
      bool isConnected = (WiFi.softAPgetStationNum() > 0);
      Serial.print("isconnected:");
      Serial.println(isConnected);
      if (isConnected) {
          // Send current sensor data via WebSocket
          webSocket.broadcastTXT("Current Data:");
          webSocket.broadcastTXT(jsonString);
          Serial.println("Current data sent via WiFi.");

          // Once data is sent, clear stored data in Preferences (non-volatile flash)
          String storedData = preferences.getString("last_data", "");
          if (storedData != "") {
              Serial.println("Stored Data Sent. Now clearing...");
              preferences.remove("last_data");  // Clear the stored data in Preferences
          }
      } else {
          Serial.println("Wi-Fi not connected, storing data in flash...");

          // Store data in flash memory if there's enough space
          if (checkFlashMemory()) {
              String oldData = preferences.getString("last_data", "");
              oldData += jsonString + "\n"; // Append new data
              preferences.putString("last_data", oldData);
          } else {
            Serial.println("Not enough flash memory available to store data.");
          }
      }

    // Update connection status
      wasWifiConnected = isConnected;
      delay(10); // Wait before next cycle
  }
}
// Flash memory check function
bool checkFlashMemory() {
    uint32_t totalBytes = LittleFS.totalBytes();
    uint32_t usedBytes = LittleFS.usedBytes();

    Serial.print("Total Flash Size: ");
    Serial.print(totalBytes);
    Serial.println(" bytes");

    Serial.print("Used Flash Space: ");
    Serial.print(usedBytes);
    Serial.println(" bytes");

    return (usedBytes < 500);  // Ensure there's enough space
}

void testLittleFS() {
    File file = LittleFS.open("/test.txt", "w");
    if (file) {
        file.println("Test data");
        file.close();
        Serial.println("Test file created successfully.");
    } else {
        Serial.println("Failed to create test file.");
    }
}

void checkWiFi() {
    if (WiFi.status() != WL_CONNECTED) {  // No Wi-Fi connection
        Serial.println("Wi-Fi not connected, restarting SoftAP...");
        WiFi.softAP(ssid, password);  // Reconnect AP if needed
    }
}

// WebSocket event handler
void webSocketEvent(uint8_t clientNum, WStype_t type, uint8_t * payload, size_t length) {
    switch (type) {
        case WStype_DISCONNECTED:
            Serial.printf("[%u] Disconnected!\n", clientNum);
            connectedClients--;
            break;

        case WStype_CONNECTED: {
            IPAddress ip = webSocket.remoteIP(clientNum);
            Serial.printf("[%u] Connected from %d.%d.%d.%d\n", 
                          clientNum, ip[0], ip[1], ip[2], ip[3]);
            webSocket.sendTXT(clientNum, "Welcome to the ESP32 WebSocket Server");
            connectedClients++;
        }
        break;

        case WStype_TEXT:
            Serial.printf("[%u] Received: %s\n", clientNum, (char*)payload);
            break;

        default:
            break;
    }
}
