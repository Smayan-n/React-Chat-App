import { useCallback, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { AlertProps } from "../Utility/interfaces";
import "../styles/Alert.css";

function Alert(props: AlertProps) {
	const { message, onClose, type, autoClose } = props;
	const [isVisible, setIsVisible] = useState(true);

	const handleClose = useCallback(() => {
		setIsVisible(false);
		setTimeout(() => {
			onClose();
		}, 400);
	}, [onClose]);

	useEffect(() => {
		//auto close alert after set time if desired
		if (autoClose) {
			setTimeout(() => {
				handleClose();
			}, 2000);
		}
	}, [autoClose, handleClose]);

	return ReactDOM.createPortal(
		<>
			<div className={`alert ${type || "error"} slide-in ${isVisible ? "slide-in" : "slide-out"}`}>
				{message}
				<span
					className="alert-close-btn"
					onClick={(e) => {
						e.stopPropagation();
						handleClose();
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
