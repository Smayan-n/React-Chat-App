import { AlertProps } from "../Utility/interfaces";
import "../styles/Alert.css";

function Alert(props: AlertProps) {
	const { message, setError } = props;

	function handleClose() {
		// setIsShow(false);
		setError("");
	}

	return (
		<>
			<div className={`alert error slide-down`}>
				<span className="alert-close-btn" onClick={handleClose}>
					&times;
				</span>
				{message}
			</div>
		</>
	);
}

export default Alert;
