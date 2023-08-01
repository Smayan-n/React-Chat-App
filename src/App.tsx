import { Route, Routes } from "react-router-dom";
import { init } from "./Utility/firebase";
import Dashboard from "./components/Dashboard";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import { AuthProvider } from "./contexts/AuthContext";
import { FirestoreProvider } from "./contexts/FirestoreContext";
import { RealtimeProvider } from "./contexts/RealtimeContext";
import "./styles/App.css";

//init firebase app
init();

function App() {
	return (
		<>
			<section className="main-app-section">
				<AuthProvider>
					<FirestoreProvider>
						<RealtimeProvider>
							<Routes>
								<Route path="/login" element={<LoginPage />}></Route>
								<Route path="/signup" element={<SignupPage />}></Route>
								<Route path="/dashboard" element={<Dashboard />}></Route>
								<Route path="*" element={<LoginPage />}></Route>
							</Routes>
						</RealtimeProvider>
					</FirestoreProvider>
				</AuthProvider>
			</section>
		</>
	);
}

export default App;
