import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import Hero from '../components/hero/Hero';
import Steps from '../components/steps/Steps';
import Submit from '../components/submit/Submit'
import Examples from '../components/examples/Examples'


function Main() {
	return (
		<>
			<Header />
			<div id="main-wrapper">
				<Hero />
				<Steps />
				<Submit />
				<Examples />
			</div>
            <Footer />
		</>
	);
}

export default Main;