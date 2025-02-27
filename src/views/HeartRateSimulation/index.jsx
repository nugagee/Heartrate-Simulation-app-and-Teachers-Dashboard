import logo from "../../logo.svg";
import "../../App.css";
import React, { useState, useEffect } from "react";
import axios from "axios";

function HeartRateSimulation() {
  const [age, setAge] = useState(15);
  const [engagement, setEngagement] = useState("medium");
  const [heartRate, setHeartRate] = useState(null);

  useEffect(() => {
    const fetchHeartRate = async () => {
      const options = {
        method: "GET",
        url: `http://127.0.0.1:5000/simulate_heart_rate?age=${age}&engagement=${engagement}`,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      };
      // try {
      axios
        .request(options)
        .then(function (response) {
          // console.log(response.data, "model");
          // try {
          // const response = await axios.get(
          //   `http://127.0.0.1:5000/simulate_heart_rate?age=${age}&engagement=${engagement}`
          // );
          console.log(response, "Nugagee");
          setHeartRate(response.data.heart_rate);
        })
        .catch(function (error) {
          console.error(error);
        });

      // } catch (error) {
      //   console.error("Error fetching heart rate:", error);
      // }
    };

    fetchHeartRate();
    const interval = setInterval(fetchHeartRate, 500000); // Refresh every 5 seconds

    return () => clearInterval(interval); // Cleanup
  }, [age, engagement]);

  return (
    <div className="App">
      <header className="App-header">
        <h2 className="text-xl font-bold">Heart Rate Simulation</h2>

        <img src={logo} className="App-logo" alt="logo" />
        <div className="p-5 rounded shadow-md">
          <label className="block mt-2">
            Age:
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="ml-2 border p-1"
            />
          </label>
          <br />
          <label className="block mt-2">
            Engagement Level:
            <select
              value={engagement}
              onChange={(e) => setEngagement(e.target.value)}
              className="ml-2 border p-1"
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </label>
          <div className="mt-4 text-lg">
            Simulated Heart Rate:{" "}
            <strong>{heartRate ? `${heartRate} BPM` : "Loading..."}</strong>
          </div>
        </div>
      </header>
    </div>
  );
}

export default HeartRateSimulation;