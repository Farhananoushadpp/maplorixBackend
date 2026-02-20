import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState("");

  useEffect(() => {
    // Set active menu based on current path
    if (location.pathname === "/") {
      setActiveMenu("home");
    } else if (location.pathname === "/about-us") {
      setActiveMenu("about");
    } else if (location.pathname === "/contact") {
      setActiveMenu("contact");
    } else {
      setActiveMenu("");
    }
  }, [location]);

  return (
    <header
      className={`${
        isScrolled
          ? "fixed top-0 z-20 w-full animate-slideDown bg-white p-3 drop-shadow-md"
          : "w-full bg-white p-3"
      }`}
    >
      <div className="container mx-auto">
        <div className="grid grid-cols-12 items-center">
          <div className="col-span-6 md:col-span-4 lg:col-span-3">
            <Link className="block w-4/5" to="/">
              <img
                src="/images/icons/logo.svg"
                alt="Logo"
                className="h-auto w-full"
              />
            </Link>
          </div>
          <nav className="col-span-12 hidden md:col-span-8 md:block lg:col-span-9">
            <div className="flex justify-end space-x-6 font-sans font-semibold tracking-wider text-primary-500 md:text-base lg:text-lg">
              <Link
                to="/"
                className={`transition-all duration-300 ease-in hover:scale-105 ${
                  activeMenu === "home" ? "text-secondary-300" : ""
                }`}
              >
                Home
              </Link>
              <Link
                to="/about-us"
                className={`transition-all duration-300 ease-in hover:scale-105 ${
                  activeMenu === "about" ? "text-secondary-300" : ""
                }`}
              >
                About Us
              </Link>
              <Link
                to="contact"
                className={`transition-all duration-300 ease-in hover:scale-105 ${
                  activeMenu === "contact" ? "text-secondary-300" : ""
                }`}
              >
                Contact Us
              </Link>
              <Link
                to="#"
                target="_blank"
                className="transition-all duration-300 ease-in hover:scale-105"
              >
                Company Brochure
              </Link>
            </div>
          </nav>
          <div className="col-span-6 flex justify-end md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="bg-transparent text-secondary-500 focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <svg
                  className="h-10 w-10"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              ) : (
                <svg
                  className="h-10 w-10"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                  ></path>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div
          id="mobile-menu"
          className="fixed inset-0 top-16 z-50 bg-white shadow-lg md:hidden"
        >
          <div className="container mx-auto px-4 py-6">
            <nav className="flex flex-col space-y-4">
              <Link
                className="block border-b border-gray-200 py-3 text-base font-medium text-primary-500 transition-colors hover:text-secondary-500"
                to="/"
                onClick={closeMobileMenu}
              >
                Home
              </Link>
              <Link
                className="block border-b border-gray-200 py-3 text-base font-medium text-primary-500 transition-colors hover:text-secondary-500"
                to="/about-us"
                onClick={closeMobileMenu}
              >
                About Us
              </Link>
              <Link
                className="block border-b border-gray-200 py-3 text-base font-medium text-primary-500 transition-colors hover:text-secondary-500"
                to="contact"
                onClick={closeMobileMenu}
              >
                Contact Us
              </Link>
              <Link
                className="block py-3 text-base font-medium text-primary-500 transition-colors hover:text-secondary-500"
                to="#"
                target="_blank"
                onClick={closeMobileMenu}
              >
                Company Brochure
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
