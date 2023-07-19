import { getAuth } from "firebase/auth";
import { useEffect, useRef, useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import "./App.css";
import { database, firebase } from "./firebase";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

function App() {
	const f = firebase;

	return (
		<>
			<Routes>
				<Route path="/home" element={<Home />}></Route>
				<Route path="/login" element={<LoginPage />}></Route>
				<Route path="/signup" element={<SignupPage />}></Route>
				<Route path="/dashboard" element={<Dashboard />}></Route>
				<Route path="*" element={<Home />}></Route>
			</Routes>
			<div>App main page</div>
		</>
	);
}

export default App;
