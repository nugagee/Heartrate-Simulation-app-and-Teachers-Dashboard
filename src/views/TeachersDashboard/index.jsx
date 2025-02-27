import logo from "../../logo.svg";
import "../../App.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Chart } from 'react-chartjs-2' 

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const TeachersDashboard = () => {
  // const Dashboard = () => {
  const [engagementData, setEngagementData] = useState([]);

  useEffect(() => {
    const fetchEngagement = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:5000/get_engagement"
        );
        setEngagementData((prevData) => [
          ...prevData,
          response?.data.engagement_score,
        ]);
      } catch (error) {
        console.error("Error fetching engagement data:", error);
      }
    };

    fetchEngagement();
    const interval = setInterval(fetchEngagement, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const data = {
    labels: engagementData?.map((_, index) => index * 5 + "s"),
    // labels: engagementData ? engagementData?.map((_, index) => index * 5 + "s") : "Loading...",
    datasets: [
      {
        label: "Engagement Score",
        data: engagementData,
        // data: engagementData || "LOADING...",
        fill: false,
        backgroundColor: "blue",
        borderColor: "blue",
      },
    ],
  };

  return (
    <div className="App">
      <header className="App-header">
        <h2 className="text-xl font-bold">Engagement Dashboard</h2>

        <img src={logo} className="App-logo" alt="logo" />
        <div className="p-5 bg-white rounded shadow-md">
          <Line data={data} />
        </div>
      </header>
    </div>
  );
};

export default TeachersDashboard;
