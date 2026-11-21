import { useLayoutEffect, useRef } from "react";

function NavBar() {
    const headerRef = useRef(null);

    // Publish the header's live height (it wraps at narrow widths) so
    // in-page anchors scroll to just below the sticky header. Layout effect so
    // the value is set before first paint.
    useLayoutEffect(() => {
        const header = headerRef.current;
        const root = document.documentElement;
        const update = () =>
            root.style.setProperty("--header-height", `${header.offsetHeight}px`);

        update();
        const observer = new ResizeObserver(update);
        observer.observe(header);

        return () => {
            observer.disconnect();
            root.style.removeProperty("--header-height");
        };
    }, []);

    return (
        <header ref={headerRef} className="site-header">
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
