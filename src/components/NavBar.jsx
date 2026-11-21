
function NavBar() {
    return (
        <header>
            <nav className="navbar">
                <h1>
                    <a href="#about">
                        CSE 194: Education Equality in California
                    </a>
                </h1>

                <ul>
                    <li><a href="#about">About</a></li>
                    <li><a href="#explore-map">Explore Map</a></li>
                    <li><a href="#comparison">Compare Schools</a></li>
                    <li><a href="#sources">Data & Sources</a></li>
                </ul>
            </nav>
        </header>
    );
}

export default NavBar;
