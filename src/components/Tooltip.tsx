import { TooltipProps } from "../Utility/interfaces";
import "../styles/Tooltip.css";

function Tooltip({ children, position }: TooltipProps) {
	//position of tooltip (below or above parent element - either tip-bottom or tip-top(default))
	//NOTE: you need to add extra css for each tooltip too
	return <div className={`tooltip ${position || ""}`}>{children}</div>;
}

export default Tooltip;
