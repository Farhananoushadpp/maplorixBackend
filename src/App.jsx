import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import AboutUs from "./pages/AboutUs";
import ServiceBags from "./pages/ServiceBags";
import ServiceFlags from "./pages/ServiceFlags";
import ServiceGifts from "./pages/ServiceGifts";
import ServiceOfficeStationary from "./pages/ServiceOfficeStationary";
import ServiceSignage from "./pages/ServiceSignage";
import ServiceRestaurantsNeeds from "./pages/ServiceRestaurantsNeeds";
import PropTypes from "prop-types";

const pageVariants = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  exit: { opacity: 0, y: -50, transition: { duration: 0.3, ease: "easeIn" } },
};

const PageLoader = ({ loading }) => {
  return loading ? (
    <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-primary-300 bg-opacity-90">
      <span className="loader test pointer-events-auto"></span>
    </div>
  ) : null;
};

PageLoader.propTypes = {
  loading: PropTypes.bool.isRequired,
};

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {[
          { path: "/", element: <Home /> },
          { path: "/about-us", element: <AboutUs /> },
          { path: "/paper-bags-boxes", element: <ServiceBags /> },
          { path: "/flags-banners", element: <ServiceFlags /> },
          { path: "/gifts-promotions", element: <ServiceGifts /> },
          {
            path: "/office-stationary",
            element: <ServiceOfficeStationary />,
          },
          { path: "/indoor-outdoor-signs", element: <ServiceSignage /> },
          {
            path: "/restaurants-needs",
            element: <ServiceRestaurantsNeeds />,
          },
          { path: "/contact", element: <Contact /> },
        ].map(({ path, element }, index) => (
          <Route
            key={index}
            path={path}
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                {element}
              </motion.div>
            }
          />
        ))}
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <PageLoader loading={loading} />
      <Header />
      <AnimatedRoutes />
      <Footer />
    </Router>
  );
}

export default App;
