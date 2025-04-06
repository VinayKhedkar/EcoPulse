import * as ort from 'onnxruntime-web'
const Papa = require('papaparse')

let session = null

async function loadModel() {
    if (!session) {
        try {
            session = await ort.InferenceSession.create(
                '/models/sensor_model.onnx'
            )
        } catch (error) {
            throw new Error('Failed to load model. Please try again later.')
        }
    }
    return session
}

const preProcessData = (data) => {
    const filteredData = []
    const seenTimestamps = new Set()

    data.forEach((entry) => {
        if (!seenTimestamps.has(entry.Timestamp)) {
            filteredData.push(entry)
            seenTimestamps.add(entry.Timestamp)
        }
    })

    if (filteredData.length === 0) return null

    const avg = (key) =>
        filteredData.reduce((acc, entry) => acc + entry[key], 0) /
        filteredData.length

    return {
        DHT_Temperature: parseFloat(avg('DHT_Temperature').toFixed(2)),
        Humidity: parseFloat(avg('Humidity').toFixed(2)),
        Soil_Moisture: parseFloat(avg('Soil_Moisture').toFixed(2)),
    }
}

const runONNXSensorModel = async (data) => {
    const session = await loadModel()

    if (!session) {
        throw new Error('Model not loaded.')
    }
    console.log('model loaded')

    const inputName = session.inputNames[0]
    const inputTensor = new ort.Tensor(
        'float32',
        new Float32Array([
            data.Soil_Moisture,
            data.DHT_Temperature,
            data.Humidity,
        ]),
        [1, 3]
    )

    const feeds = {}
    feeds[inputName] = inputTensor

    const output = await session.run(feeds)
    const arr = output?.dense_5.cpuData
    const predictedclass = arr.indexOf(Math.max(...arr)) + 1

    const csvRow = await fetchCSVRow(predictedclass)

    const confidence = Math.max(...arr) / arr.reduce((a, b) => a + b, 0)

    const suggestion = csvRow['Suggestion'].split('.')

    return {
        confidence: confidence,
        stress: csvRow['Stress Level'],
        suggestion:suggestion,
        status: csvRow['Status'],
    }
}

async function fetchCSVRow(predicted_class) {
    try {
        const response = await fetch('/data/sensor_labels.csv')
        const text = await response.text()

        return new Promise((resolve, reject) => {
            Papa.parse(text, {
                header: true,
                dynamicTyping: true,
                complete: (results) => {
                    const row = results.data.find(
                        (row) =>
                            String(row['Stress Level']) ===
                            String(predicted_class)
                    )
                    if (row) {
                        resolve(row)
                    } else {
                        reject('No matching row found.')
                    }
                },
                error: (error) => {
                    reject('Error parsing CSV: ' + error.message)
                },
            })
        })
    } catch (error) {
        throw new Error(error.message)
    }
}

export { preProcessData, runONNXSensorModel }
