import Main from "./Main"
import About from "./About"
import Comparison from "./Comparison"
import Sources from "./Sources"
import Footer from "./footer"
import NavBar from "../components/NavBar"

import "../stylesheet.css"

export default function Home() {
    return (
        <>
            <NavBar />

            <main>
                <About />
                <Main />
                <Comparison />
                <Sources />
            </main>

            <Footer />
        </>
    )
}