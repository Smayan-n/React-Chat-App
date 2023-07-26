import "../styles/Loader.css";
import { LoaderProps } from "../Utility/interfaces";

function Loader(props: LoaderProps) {
	const { message } = props;

	return (
		<>
			{/* <section className="blurred-bg"></section> */}
			<section className="loader-section">
				<div className="blurred-loader-bg"></div>
				<div className="loader"></div>
				<div className="loader-text">{message}</div>
			</section>
		</>
	);
}

export default Loader;
