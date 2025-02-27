import React from "react";
// import { Route, Router, Switch } from "react-router-dom";
// import { Routes, Route } from "react-router-dom";
import history from "../services/history";
import HomeComponent from "../views/HeartRateSimulation/index";
import TeachersDashboard from "../views/TeachersDashboard";
import HeartRateSimulation from "../views/HeartRateSimulation/index";
import NotFound from "../views/NotFoundPage/index";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useRoutes,
} from "react-router-dom";

const App = () => {
  let routes = useRoutes([
    { path: "/", element: <TeachersDashboard /> },
    { path: "heartrate-simulation", element: <HeartRateSimulation /> },
    { path: "*", element: <NotFound /> },
    // ...
  ]);
  return routes;
};
const AllPages = () => {
  // <Routes history={history}>
  //   <Route exact={true} path="/" element={<TeachersDashboard />} />
  //   <Route path="/heartrate-simulation" element={<HeartRateSimulation />} />
  //   <Route path="*" element={<NotFound />} />
  // </Routes>
  return (
    <Router>
      <App />
    </Router>
  );
};

export default AllPages;
