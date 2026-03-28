import React, { useState } from "react";
import "./counting.css";

function CountingImages() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setResult(data);
      console.log(
        "Original image URL:",
        `http://localhost:5000/${result.original_image}`
      );
      console.log(
        "Boxed image URL:",
        `http://localhost:5000/${result.boxes_image}`
      );
    } catch (error) {
      console.error("Error:", error);
      alert("Error processing image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="Counting">
      <header className="Counting-header">
        <h1>Crowd Counting with Bounding Boxes</h1>
        <form onSubmit={handleSubmit}>
          <input type="file" onChange={handleFileChange} accept="image/*" />
          <button type="submit" disabled={!file || loading}>
            {loading ? "Processing..." : "Upload"}
          </button>
        </form>

        {result && (
          <div className="results">
            <h2>Results</h2>
            <p>Predicted Count: {result.predicted_count}</p>

            <div className="image-container">
              <div className="image-box">
                <h3>Original Image</h3>
                <img
                  src={`http://localhost:5000/${result.original_image}`}
                  alt="Original"
                  onError={(e) =>
                    console.error("Failed to load image:", e.target.src)
                  }
                />
              </div>

              <div className="image-box">
                <h3>With Bounding Boxes</h3>
                <img
                  src={`http://localhost:5000/${result.boxes_image}`}
                  alt="With Bounding Boxes"
                  onError={(e) =>
                    console.error("Failed to load image:", e.target.src)
                  }
                />
              </div>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

export default CountingImages;
