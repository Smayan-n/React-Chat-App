import { Route, Routes } from "react-router-dom";
import { initFirebaseApp } from "./Utility/firebase";
import Dashboard from "./components/Dashboard";
import Home from "./components/Home";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import { AuthProvider } from "./contexts/AuthContext";
import "./styles/App.css";

//init firebase app
initFirebaseApp();

function App() {
	return (
		<>
			<AuthProvider>
				<Routes>
					<Route path="/React-Chat-App" element={<Home />}></Route>
					<Route path="/login" element={<LoginPage />}></Route>
					<Route path="/signup" element={<SignupPage />}></Route>
					<Route path="/dashboard" element={<Dashboard />}></Route>
					<Route path="*" element={<Home />}></Route>
				</Routes>
			</AuthProvider>
		</>
	);
}

export default App;
