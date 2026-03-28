import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import axios from "axios";
import logo from "../../logo.svg";
import "../../App.css";
import { Link } from "react-router-dom";

const StudentEngagementDashboard = () => {
  const webcamRef = useRef(null);
  const [engagementLevel, setEngagementLevel] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [heartRate, setHeartRate] = useState(0);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    const modelPath = process.env.PUBLIC_URL + "/models";

    await faceapi.nets.tinyFaceDetector.loadFromUri(modelPath);
    await faceapi.nets.faceLandmark68TinyNet.loadFromUri(modelPath);
    await faceapi.nets.faceExpressionNet.loadFromUri(modelPath);

    console.log("Face API models loaded successfully!");
    alert("Face API models loaded successfully!");
  };

  const estimateHeartRate = async () => {
    if (!webcamRef.current) return;
  
    const video = webcamRef.current.video;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
  
    let pixelValues = [];
    let timestamps = [];
  
    console.log("Starting heart rate estimation...");
  
    const captureFrame = async () => {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      try {
        const result = await faceapi
          .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks(true);
  
        if (!result) return;
        console.log("Face detected:", result);
  
        // ✅ Extract forehead region
        const foreheadX =
          (result.landmarks.positions[21].x + result.landmarks.positions[22].x) / 2;
        const foreheadY =
          (result.landmarks.positions[21].y + result.landmarks.positions[22].y) / 2;
  
        console.log("Forehead X:", foreheadX, "Forehead Y:", foreheadY);
  
        // ✅ Read pixel data
        const foreheadColor = ctx.getImageData(foreheadX, foreheadY, 10, 10);
        const avgGreen =
          Array.from(foreheadColor.data)
            .filter((_, index) => index % 4 === 1)
            .reduce((sum, value) => sum + value, 0) / 100;
  
        timestamps.push(performance.now());
        pixelValues.push(avgGreen);
  
        // ✅ Keep only the last 50 readings
        if (pixelValues.length > 50) {
          timestamps.shift();
          pixelValues.shift();
        }
  
        // ✅ Once we have 50 readings, calculate heart rate
        if (pixelValues.length === 50) {
          console.log("Collected 50 frames - Calculating heart rate...");
          const totalTime = timestamps[timestamps.length - 1] - timestamps[0]; // Time in ms
          const fps = 50 / (totalTime / 1000); // Frames per second
  
          const frequency = fps / 2;
          const heartRate = Math.round(frequency * 60);
  
          setHeartRate(heartRate);
          console.log("Final Heart Rate:", heartRate, "FPS:", fps);
        }
      } catch (error) {
        console.error("Error in heart rate detection:", error);
      }
    };
  
    // ✅ Capture frames every 100ms instead of as fast as possible
    const intervalId = setInterval(captureFrame, 100);
  
    // Stop capturing after 10 seconds (to avoid infinite loops)
    setTimeout(() => {
      clearInterval(intervalId);
      console.log("Heart rate estimation stopped.");
    }, 20000);
  };
  

  const analyzeEngagement = async () => {
    if (!webcamRef.current) return;

    setProcessing(true);
    const imageSrc = webcamRef.current.getScreenshot();

      // Convert Base64 to Blob correctly
      const byteString = atob(imageSrc.split(",")[1]);
      const mimeString = imageSrc.split(",")[0].split(":")[1].split(";")[0];
      
      const byteNumbers = new Array(byteString.length);
      for (let i = 0; i < byteString.length; i++) {
        byteNumbers[i] = byteString.charCodeAt(i);
      }
    
      const byteArray = new Uint8Array(byteNumbers);
      const imageBlob = new Blob([byteArray], { type: mimeString });
    
      // Ensure it's a proper File object
      const imageFile = new File([imageBlob], "snapshot.jpg", { type: mimeString });
    
      // Prepare form data
      const formData = new FormData();
      formData.append("heart_rate", JSON.stringify(heartRate));
      formData.append("image", imageFile); // Ensure it's a File, not just a Blob
    

    try {
      const response = await axios.post(
        "http://0.0.0.0:8000/predict",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setEngagementLevel(response.data.engagement_level);
    } catch (error) {
      console.error("Error fetching engagement data", error);
    }

    setProcessing(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h2 className="text-xl font-bold">Student Engagement Dashboard</h2>

        <img src={logo} className="App-logo" alt="logo" />

        <br />
        {/* Student Selection Dropdown */}
        <div className="mb-4">
          <label className="block text-lg font-medium text-gray-700">
            Select Student:
          </label>
          <select
            className="mt-2 p-2 border rounded w-full"
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
          >
            <option value="">-- Choose Student --</option>
            <option value="student1">Student 1</option>
            <option value="student2">Student 2</option>
            <option value="student3">Student 3</option>
          </select>
        </div>

        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/png"
          width={400}
          height={300}
        />
        <button onClick={estimateHeartRate}>Start Heart Rate Detection</button>
        <button onClick={analyzeEngagement} disabled={processing}>
          {processing ? "Processing..." : "Analyze Engagement"}
        </button>
        <button onClick={() => window.location.reload()}>Refresh</button>
        <p>Heart Rate: {heartRate} BPM</p>
        {engagementLevel && (
          <p>Engagement Level: {JSON.stringify(engagementLevel)}</p>
        )}
      </header>

      <footer className="mt-6 text-gray-500 text-sm">
        <Link to="/" className="text-blue-500 hover:underline">
          Back to Home
        </Link>
      </footer>
    </div>
  );
};

export default StudentEngagementDashboard;
