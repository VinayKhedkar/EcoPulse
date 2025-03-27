'use client'
const { createContext, useState, useContext } = require('react')

const cameraContext = createContext()

const CameraProvider = ({ children }) => {
    const [image, setImage] = useState(null)

    return (
        <cameraContext.Provider value={{ image, setImage }}>
            {children}
        </cameraContext.Provider>
    )
}

const useCamera = () => {
    const context = useContext(cameraContext)
    if (!context) {
        throw new Error('useCamera must be used within a CameraProvider')
    }
    return context
}

export { CameraProvider, useCamera }
