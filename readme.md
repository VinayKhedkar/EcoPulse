# 🌱 EcoPulse

**EcoPulse** is a smart AI-driven platform designed to empower farmers and agricultural researchers with advanced insights into soil health and plant disease detection. By integrating **IoT sensor technology**, **machine learning models**, and a user-friendly web interface, EcoPulse enables sustainable and data-driven farming practices.

### 🔧 What It Does

EcoPulse consists of three main modules:

1. **Soil Monitoring System**  
   - A custom-designed 3D sensor is deployed into the soil to collect real-time environmental data such as **moisture**, **pH**, and **temperature**.  
   - This data is analyzed by trained machine learning models to assess **soil quality** and provide actionable recommendations for crop health.

2. **Leaf Disease Detection**  
   - Users can **upload a photo** of any plant leaf.  
   - A deep learning model (based on **MobileNetV2**) processes the image to detect potential **diseases** affecting the crop and provides immediate feedback.  
   - Helps reduce crop loss through early detection and intervention.

3. **Smart Marketplace & Community Hub**  
   - Based on soil and crop analysis, EcoPulse suggests **fertilizers**, **pesticides**, and **nutrients**—and links them directly to a marketplace for easy access.  
   - A **community section** allows farmers, scientists, and agritech enthusiasts to share **articles**, **best practices**, **Q&A**, and **field experiences**.

---

---

## 🧱 Project Structure

```
EcoPulse/
│
├── 3D Model/       # Contains the 3D blueprint and design files for the soil data sensor
│
├── client/         # Frontend built with Next.js for interactive UI and data visualization
│
├── dataset/        # Real-world soil data (moisture, temperature, pH, etc.) used for training models
│
├── model/          # Trained machine learning models for soil health analysis
│                   # Includes models using MobileNetV2 architecture and PyTorch/TensorFlow
│
├── server/         # Backend API built with Flask to serve model predictions and handle data requests
│
├── .gitignore      # Specifies files and directories to ignore in version control
│
└── readme.md       # Documentation for the project
```

---

## 💻 Tech Stack

### Frontend
- **Framework**: [Next.js](https://nextjs.org/)
- **Language**: JavaScript / React

### Backend
- **Framework**: [Flask](https://flask.palletsprojects.com/)
- **Language**: Python

### Machine Learning
- **Libraries**:
  - [PyTorch](https://pytorch.org/)
  - [TensorFlow](https://www.tensorflow.org/)
  - [matplotlib](https://matplotlib.org/)
  - [seaborn](https://seaborn.pydata.org/)
  - [tqdm](https://github.com/tqdm/tqdm)
- **Architecture**:
  - **MobileNetV2** for lightweight and efficient deep learning inference

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/VinayKhedkar/EcoPulse.git
cd EcoPulse
```

---

### 2. Frontend Setup (Next.js)

```bash
cd client
npm install
npm run dev
```

> 🟢 Runs at `http://localhost:3000`

---

### 3. Backend Setup (Flask)

```bash
cd ../server

# Create and activate virtual environment
# For Windows
python -m venv venv
venv\Scripts\activate

# For macOS/Linux
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run Flask server
invoke run
```

> 🟢 Runs at `http://localhost:5000`

---

### ✅ Model Notes

- The trained models are located in the `model/` directory.
- MobileNetV2 is used for its efficiency in real-time environments and edge devices.
- Training scripts and notebooks (if any) are inside `model/` or `dataset/`.

---

## 📬 Contact

For queries or contributions, feel free to reach out via [GitHub Issues](https://github.com/VinayKhedkar/EcoPulse/issues).

---
