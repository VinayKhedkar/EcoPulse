import * as ort from 'onnxruntime-web'
const Papa = require('papaparse')
const path = require('path')

let session = null

async function loadModel() {
    if (!session) {
        try {
            session = await ort.InferenceSession.create(
                path.join(__dirname, '../models/plant_disease_model.onnx')
            )
        } catch (error) {
            throw new Error('Failed to load model. Please try again later.')
        }
    }
    return session
}

const runONNXModel = async (imageFile) => {
    const session = await loadModel()

    if (!session) {
        throw new Error('Model not loaded.')
    }

    const preprocessedData = await preprocessImage(imageFile)

    const inputName = session.inputNames[0]

    const inputTensor = new ort.Tensor(
        'float32',
        preprocessedData,
        [1, 3, 224, 224]
    )

    const feeds = {}
    feeds[inputName] = inputTensor

    const output = await session.run(feeds)
    console.log('Output:', output)
    const arr = output.output.cpuData
    const predicted_class = arr.reduce((acc, val, ind, arr) => {
        return val > arr[acc] ? ind : acc
    }, 0)

    const maxLogit = Math.max(...arr)
    const expValues = arr.map((x) => Math.exp(x - maxLogit))
    const sumExpValues = expValues.reduce((a, b) => a + b, 0)
    const probabilities = expValues.map((x) => x / sumExpValues)

    const confidence = Math.max(...probabilities)

    const rowData = await fetchCSVRow(predicted_class)

    return {
        confidence: confidence,
        disease: rowData.disease,
        suggestion: rowData.suggestion,
    }
}

const base64ToFile = (base64, filename) => {
    const byteCharacters = atob(base64.split(',')[1])
    const byteNumbers = new Array(byteCharacters.length)

    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
    }

    const byteArray = new Uint8Array(byteNumbers)
    const blob = new Blob([byteArray], { type: 'image/png' })

    const file = new File([blob], filename, { type: 'image/png' })

    return file
}

const preprocessImage = async (file) => {
    return new Promise((resolve, reject) => {
        if (!(file instanceof Blob || file instanceof File)) {
            return reject(new Error('Invalid file object passed.'))
        }

        const img = new Image()
        const url = URL.createObjectURL(file)
        img.src = url

        img.onload = () => {
            URL.revokeObjectURL(url)

            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')

            canvas.width = 224
            canvas.height = 224
            ctx.drawImage(img, 0, 0, 224, 224)

            const imageData = ctx.getImageData(0, 0, 224, 224)
            const { data } = imageData

            // Create a Float32Array for CHW format (3, 224, 224)
            const floatArray = new Float32Array(3 * 224 * 224)

            for (let y = 0; y < 224; y++) {
                for (let x = 0; x < 224; x++) {
                    const pixelIdx = (y * 224 + x) * 4

                    // Convert from HWC (height, width, channels) to CHW (channels, height, width)
                    floatArray[y * 224 + x] = data[pixelIdx] / 255.0 // Red Channel
                    floatArray[224 * 224 + y * 224 + x] =
                        data[pixelIdx + 1] / 255.0 // Green Channel
                    floatArray[2 * 224 * 224 + y * 224 + x] =
                        data[pixelIdx + 2] / 255.0 // Blue Channel
                }
            }

            resolve(floatArray)
        }

        img.onerror = (error) => {
            URL.revokeObjectURL(url)
            reject(error)
        }
    })
}

async function fetchCSVRow(predicted_class) {
    try {
        const response = await fetch('/data/plant_village.csv')
        const text = await response.text()

        return new Promise((resolve, reject) => {
            Papa.parse(text, {
                header: true,
                dynamicTyping: true,
                complete: (results) => {
                    const row = results.data.find(
                        (row) => String(row['']) === String(predicted_class)
                    )
                    if (row) {
                        resolve(row)
                    } else {
                        reject('No matching row found.')
                    }
                },
                error: (error) => {
                    reject('Error parsing CSV: ' + error)
                },
            })
        })
    } catch (error) {
        throw new Error(error.message)
    }
}

export { runONNXModel, preprocessImage, loadModel, base64ToFile, fetchCSVRow }
