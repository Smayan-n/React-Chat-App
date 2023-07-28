import { TooltipProps } from "../Utility/interfaces";
import "../styles/Tooltip.css";

function Tooltip({ children, position }: TooltipProps) {
	return <div className={`tooltip ${position || ""}`}>{children}</div>;
}

export default Tooltip;
