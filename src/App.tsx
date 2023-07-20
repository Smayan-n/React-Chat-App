import { Route, Routes } from "react-router-dom";
import "./App.css";
import { initFirebaseApp } from "./firebase";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
initFirebaseApp();

function App() {
	// firebase.performance();
	// useEffect(() => {
	// 	initFirebaseApp();
	// }, []);

	return (
		<>
			<Routes>
				<Route exact path="/React-Chat-App" element={<Home />}></Route>
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
