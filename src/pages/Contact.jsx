import { useEffect, useState } from "react";
import { motion } from "motion/react";

const scalevariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
};

const flipVariants = {
  hidden: { opacity: 0, rotateY: -90 },
  visible: { opacity: 1, rotateY: 0 },
};

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here (e.g., send to API)
    alert("Thank you for your message! We'll get back to you soon.");
    setFormData({
      name: "",
      email: "",
      phone: "",
      service: "",
      message: "",
    });
  };

  return (
    <main>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 px-4 py-20 md:px-6 lg:px-8 lg:py-32">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute left-10 top-20 h-16 w-16 rounded-full bg-white/10"
            animate={{
              y: [0, -20, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute right-20 top-32 h-12 w-12 rounded-full bg-secondary-400/20"
            animate={{
              y: [0, 15, 0],
              x: [0, -10, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
          <motion.div
            className="absolute bottom-32 left-1/4 h-20 w-20 rounded-full bg-primary-300/15"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, -180, -360],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          />
        </div>

        <div className="container relative z-10 mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              className="mb-6 text-4xl font-extrabold text-white md:text-5xl lg:text-6xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              Let's Connect
            </motion.h1>
            <motion.p
              className="mx-auto max-w-2xl text-lg text-primary-100 md:text-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Have questions about our services? Ready to start your journey?
              We're here to help you every step of the way.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 to-secondary-50 px-4 py-16 md:px-6 lg:px-8 lg:py-24">
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-5">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="contactPattern"
                x="0"
                y="0"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <circle
                  cx="10"
                  cy="10"
                  r="2"
                  fill="currentColor"
                  className="text-primary-300"
                />
                <circle
                  cx="30"
                  cy="30"
                  r="1.5"
                  fill="currentColor"
                  className="text-secondary-300"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#contactPattern)" />
          </svg>
        </div>

        {/* Floating Decorative Elements */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute left-10 top-20 h-4 w-4 rounded-full bg-primary-200"
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute right-20 top-40 h-6 w-6 rounded-full bg-secondary-200"
            animate={{
              y: [0, 15, 0],
              x: [0, -10, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
          <motion.div
            className="absolute bottom-32 left-1/3 h-3 w-3 rounded-full bg-primary-300"
            animate={{
              scale: [1, 1.5, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          />
        </div>
        <div className="container mx-auto">
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-4 text-3xl font-bold text-primary-600 md:text-4xl lg:text-5xl">
              Get In Touch
            </h2>
            <p className="mx-auto max-w-3xl text-lg text-gray-600">
              Ready to start your journey? Contact us for personalized travel,
              immigration, and document clearing services.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {/* Contact Form */}
            <motion.div
              variants={scalevariants}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="rounded-2xl bg-gray-50 p-8 shadow-xl">
                <h3 className="mb-6 text-2xl font-bold text-primary-600">
                  Send Us a Message
                </h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="relative">
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        <span className="flex items-center gap-2">
                          <svg
                            className="h-4 w-4 text-primary-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            ></path>
                          </svg>
                          Full Name *
                        </span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full rounded-xl border-2 border-gray-200 bg-white/80 px-3 py-3 pl-10 text-sm backdrop-blur-sm transition-all duration-300 focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/20 sm:px-4 sm:py-4 sm:pl-12"
                          placeholder="Your full name"
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 sm:pl-4">
                          <svg
                            className="h-4 w-4 text-gray-400 sm:h-5 sm:w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            ></path>
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="relative">
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        <span className="flex items-center gap-2">
                          <svg
                            className="h-4 w-4 text-primary-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            ></path>
                          </svg>
                          Email Address *
                        </span>
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full rounded-xl border-2 border-gray-200 bg-white/80 px-3 py-3 pl-10 text-sm backdrop-blur-sm transition-all duration-300 focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/20 sm:px-4 sm:py-4 sm:pl-12"
                          placeholder="your@email.com"
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 sm:pl-4">
                          <svg
                            className="h-4 w-4 text-gray-400 sm:h-5 sm:w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            ></path>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="relative">
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        <span className="flex items-center gap-2">
                          <svg
                            className="h-4 w-4 text-primary-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            ></path>
                          </svg>
                          Phone Number
                        </span>
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full rounded-xl border-2 border-gray-200 bg-white/80 px-3 py-3 pl-10 text-sm backdrop-blur-sm transition-all duration-300 focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/20 sm:px-4 sm:py-4 sm:pl-12"
                          placeholder="+971 XX XXX XXXX"
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 sm:pl-4">
                          <svg
                            className="h-4 w-4 text-gray-400 sm:h-5 sm:w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            ></path>
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="relative">
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        <span className="flex items-center gap-2">
                          <svg
                            className="h-4 w-4 text-primary-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            ></path>
                          </svg>
                          Service Type
                        </span>
                      </label>
                      <div className="relative">
                        <select
                          name="service"
                          value={formData.service}
                          onChange={handleChange}
                          className="w-full appearance-none rounded-xl border-2 border-gray-200 bg-white/80 px-4 py-4 pl-12 backdrop-blur-sm transition-all duration-300 focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/20"
                        >
                          <option value="">Select a service</option>
                          <option value="travel">Travel & Tourism</option>
                          <option value="immigration">
                            Immigration Services
                          </option>
                          <option value="holiday">Holiday Packages</option>
                          <option value="document">Document Clearing</option>
                          <option value="other">Other</option>
                        </select>
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 sm:pl-4">
                          <svg
                            className="h-4 w-4 text-gray-400 sm:h-5 sm:w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            ></path>
                          </svg>
                        </div>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 sm:pr-4">
                          <svg
                            className="h-4 w-4 text-gray-400 sm:h-5 sm:w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 9l-7 7-7-7"
                            ></path>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      <span className="flex items-center gap-2">
                        <svg
                          className="h-4 w-4 text-primary-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          ></path>
                        </svg>
                        Message *
                      </span>
                    </label>
                    <div className="relative">
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full resize-none rounded-xl border-2 border-gray-200 bg-white/80 px-3 py-3 pl-10 text-sm backdrop-blur-sm transition-all duration-300 focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/20 sm:px-4 sm:py-4 sm:pl-12"
                        placeholder="Tell us about your requirements..."
                      ></textarea>
                      <div className="absolute left-3 top-3 sm:left-4 sm:top-4">
                        <svg
                          className="h-4 w-4 text-gray-400 sm:h-5 sm:w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          ></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{
                      scale: 1.02,
                      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                    }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        ></path>
                      </svg>
                      Send Message
                    </span>
                  </motion.button>
                </form>
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              variants={flipVariants}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 0.5 }}
              style={{ perspective: "1000px" }}
              viewport={{ once: true }}
            >
              <div className="space-y-8">
                <div className="rounded-2xl border border-primary-100 bg-gradient-to-br from-primary-50 to-secondary-50 p-8 shadow-xl">
                  <h3 className="mb-6 flex items-center gap-3 text-2xl font-bold text-primary-600">
                    <svg
                      className="h-8 w-8 text-primary-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      ></path>
                    </svg>
                    Contact Information
                  </h3>
                  <div className="space-y-6">
                    <motion.div
                      className="flex items-start space-x-4 rounded-xl border border-white/50 bg-white/60 p-4 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-md"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-500 shadow-lg">
                        <svg
                          className="h-7 w-7 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          ></path>
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-lg font-bold text-gray-900">Phone</p>
                        <p className="font-medium text-gray-600">
                          +971 55 716 7147
                        </p>
                        {/* <p className="font-medium text-gray-600">
                          +971 4 234 5678
                        </p> */}
                        <p className="mt-1 text-sm text-gray-500">
                          Mon-Fri: 9:00 AM - 6:00 PM (GST)
                        </p>
                      </div>
                    </motion.div>
                    <motion.div
                      className="flex items-start space-x-4 rounded-xl border border-white/50 bg-white/60 p-4 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-md"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-500 shadow-lg">
                        <svg
                          className="h-7 w-7 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          ></path>
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-lg font-bold text-gray-900">Email</p>
                        <p className="font-medium text-gray-600">
                          info@abdalawyservices.com
                        </p>
                        {/* <p className="font-medium text-gray-600">
                          support@abdalawyservices.com
                        </p> */}
                        <p className="mt-1 text-sm text-gray-500">
                          24/7 Email Support Available
                        </p>
                      </div>
                    </motion.div>
                    <motion.div
                      className="flex items-start space-x-4 rounded-xl border border-white/50 bg-white/60 p-4 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-md"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-purple-500 shadow-lg">
                        <svg
                          className="h-7 w-7 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          ></path>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          ></path>
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-lg font-bold text-gray-900">
                          Office Address
                        </p>
                        <p className="font-medium text-gray-600">
                          Xavier Business Center
                        </p>
                        <p className="font-medium text-gray-600">
                          Office 204, Deira, Dubai, UAE
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          P.O. Box: 12345, Dubai
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Contact;
