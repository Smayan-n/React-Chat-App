import ReactDOM from "react-dom";
import { AlertProps } from "../Utility/interfaces";
import "../styles/Alert.css";

function Alert(props: AlertProps) {
	const { message, onClose } = props;

	return ReactDOM.createPortal(
		<>
			<div className={`alert error slide-in`}>
				{message}
				<span
					className="alert-close-btn"
					onClick={(e) => {
						e.stopPropagation();
						onClose();
					}}
				>
					&times;
				</span>
			</div>
		</>,
		document.getElementById("alert") as HTMLDivElement
	);
}

export default Alert;
