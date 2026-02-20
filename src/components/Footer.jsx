import { motion } from "motion/react";
import { Link } from "react-router-dom";

const slideUpVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

const socialIcons = [
  {
    name: "Facebook",
    href: "https://www.facebook.com/AbdalawyServices",
    icon: "/images/icons/fb.svg",
    color: "hover:bg-blue-600",
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/abdalawy_services",
    icon: "/images/icons/insta.svg",
    color: "hover:bg-pink-600",
  },
  {
    name: "LinkedIn",
    href: "#",
    icon: "/images/icons/linkedin.svg",
    color: "hover:bg-blue-700",
  },
];

const Footer = () => {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-500 to-primary-700">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='7' cy='7' r='7'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>

      <div className="relative z-10 px-4 py-16 md:px-6 lg:px-8 lg:py-20">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
            {/* Company Info */}
            <motion.div
              className="space-y-6"
              variants={slideUpVariants}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div>
                <img src="title_logo.svg" alt="" />
                <h3 className="mb-4 text-2xl font-bold text-white">
                  <img
                    src="/images/icons/logo_white.png"
                    alt="Logo"
                    className="h-auto w-1/2"
                  />
                </h3>
                <p className="leading-relaxed text-primary-200">
                  Your trusted partner for travel, tourism, and immigration
                  services in Dubai. Professional solutions with a personal
                  touch.
                </p>
              </div>

              <div className="flex space-x-4">
                {socialIcons.map((social, index) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm transition-all duration-300 ${social.color} hover:scale-110 hover:shadow-lg`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <img
                      className="h-5 w-5 brightness-0 invert"
                      src={social.icon}
                      alt={social.name}
                    />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              className="space-y-6"
              variants={slideUpVariants}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="relative mb-6 text-xl font-bold text-white after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-8 after:bg-secondary-400">
                Quick Links
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/"
                    className="flex items-center text-primary-200 transition-all duration-300 hover:translate-x-1 hover:text-white"
                  >
                    <span className="mr-2">→</span> Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="flex items-center text-primary-200 transition-all duration-300 hover:translate-x-1 hover:text-white"
                  >
                    <span className="mr-2">→</span> Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/paper-bags-boxes"
                    className="flex items-center text-primary-200 transition-all duration-300 hover:translate-x-1 hover:text-white"
                  >
                    <span className="mr-2">→</span> Paper Bags & Boxes
                  </Link>
                </li>
                <li>
                  <Link
                    to="/flags-banners"
                    className="flex items-center text-primary-200 transition-all duration-300 hover:translate-x-1 hover:text-white"
                  >
                    <span className="mr-2">→</span> Flags & Banners
                  </Link>
                </li>
              </ul>
            </motion.div>

            {/* Services */}
            <motion.div
              className="space-y-6"
              variants={slideUpVariants}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="relative mb-6 text-xl font-bold text-white after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-8 after:bg-secondary-400">
                Our Services
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="#"
                    className="flex items-center text-primary-200 transition-all duration-300 hover:translate-x-1 hover:text-white"
                  >
                    <span className="mr-2">→</span> Travel & Tourism
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="flex items-center text-primary-200 transition-all duration-300 hover:translate-x-1 hover:text-white"
                  >
                    <span className="mr-2">→</span> Immigration Solutions
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="flex items-center text-primary-200 transition-all duration-300 hover:translate-x-1 hover:text-white"
                  >
                    <span className="mr-2">→</span> Holiday Packages
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="flex items-center text-primary-200 transition-all duration-300 hover:translate-x-1 hover:text-white"
                  >
                    <span className="mr-2">→</span> Document Clearing
                  </Link>
                </li>
              </ul>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              className="space-y-6"
              variants={slideUpVariants}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h3 className="relative mb-6 text-xl font-bold text-white after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-8 after:bg-secondary-400">
                Get in Touch
              </h3>
              <div className="space-y-4">
                <motion.a
                  href="tel:+971557167147"
                  className="flex items-center space-x-3 text-primary-200 transition-all duration-300 hover:text-white"
                  whileHover={{ x: 5 }}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary-400/20">
                    <img
                      className="h-5 w-5"
                      src="/images/icons/phone.svg"
                      alt="Phone"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-primary-300">Phone</p>
                    <p className="font-medium">+971 55 716 7147</p>
                  </div>
                </motion.a>

                <motion.a
                  href="mailto:info@abdalawyservices.com"
                  className="flex items-center space-x-3 text-primary-200 transition-all duration-300 hover:text-white"
                  whileHover={{ x: 5 }}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary-400/20">
                    <img
                      className="h-5 w-5"
                      src="/images/icons/mail.svg"
                      alt="Email"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-primary-300">Email</p>
                    <p className="font-medium">info@abdalawyservices.com</p>
                  </div>
                </motion.a>

                <motion.div
                  className="flex items-center space-x-3 text-primary-200"
                  whileHover={{ x: 5 }}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary-400/20">
                    <img
                      className="h-5 w-5"
                      src="/images/icons/map.svg"
                      alt="Location"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-primary-300">Location</p>
                    <p className="font-medium">Dubai, UAE</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Bottom Bar */}
          <motion.div
            className="mt-16 border-t border-primary-600 pt-8"
            variants={slideUpVariants}
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="flex flex-col items-center justify-between space-y-4 md:flex-row">
              <p className="text-center text-sm text-primary-300 md:text-left">
                © 2024 Abdalawy Services. All rights reserved.
              </p>
              <div className="flex space-x-6 text-sm">
                <Link
                  to="#"
                  className="text-primary-300 transition-colors hover:text-white"
                >
                  Privacy Policy
                </Link>
                <Link
                  to="#"
                  className="text-primary-300 transition-colors hover:text-white"
                >
                  Terms of Service
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
