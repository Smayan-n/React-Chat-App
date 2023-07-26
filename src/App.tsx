import { Route, Routes } from "react-router-dom";
import { init } from "./Utility/firebase";
import ChatInterface from "./components/ChatInterface";
import Dashboard from "./components/Dashboard";
import Home from "./components/Home";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import { AuthProvider } from "./contexts/AuthContext";
import { FirestoreProvider } from "./contexts/FirestoreContext";
import "./styles/App.css";

//init firebase app
init();

function App() {
	return (
		<>
			<section className="main-app-section">
				<AuthProvider>
					<FirestoreProvider>
						<Routes>
							<Route path="/React-Chat-App" element={<Home />}></Route>
							<Route path="/login" element={<LoginPage />}></Route>
							<Route path="/signup" element={<SignupPage />}></Route>
							<Route path="/dashboard" element={<Dashboard />}></Route>
							<Route path="*" element={<Home />}></Route>
						</Routes>
					</FirestoreProvider>
				</AuthProvider>
			</section>
		</>
	);
}

export default App;
