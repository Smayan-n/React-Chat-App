import ReactDOM from "react-dom";
import { PopupProps } from "../Utility/interfaces";
import "../styles/Popup.css";

function Popup(props: PopupProps) {
	const { children, isOpen, onClose } = props;
	if (!isOpen) return null;

	return ReactDOM.createPortal(
		<>
			<section className="popup-overlay"></section>
			<section className="popup-outer">
				<section className="popup-section">
					<div
						onClick={(e) => {
							//cause click event was propagating up to the og div
							e.stopPropagation();
							onClose();
						}}
						className="close-popup"
					>
						&times;
					</div>
					{children}
				</section>
			</section>
		</>,
		document.getElementById("popup") as HTMLElement
	);
}

export default Popup;
