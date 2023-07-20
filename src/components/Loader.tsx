import "../styles/Loader.css";
import { LoaderProps } from "../Utility/interfaces";

function Loader(props: LoaderProps) {
	const { message } = props;

	return (
		<>
			<section className="blurred-bg"></section>
			<div className="loader"></div>
			<div className="loader-text">{message}</div>
		</>
	);
}

export default Loader;
