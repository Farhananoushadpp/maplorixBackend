import { useEffect } from "react";
import { motion } from "motion/react";

const AboutUs = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 px-4 py-16 md:px-6 lg:px-8 lg:py-32">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M40 40c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm20 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute left-10 top-20 h-20 w-20 rounded-full bg-white/15"
            animate={{
              y: [0, -20, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute right-20 top-40 h-16 w-16 rounded-full bg-secondary-400/25"
            animate={{
              y: [0, 15, 0],
              x: [0, -10, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
          <motion.div
            className="absolute bottom-32 left-1/4 h-12 w-12 rounded-full bg-white/20"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, -180, -360],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          />
          {/* New floating elements */}
          <motion.div
            className="absolute right-1/3 top-1/3 h-8 w-8 rounded-full bg-primary-300/30"
            animate={{
              y: [0, -25, 0],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          />
          <motion.div
            className="absolute bottom-20 left-1/3 h-6 w-6 rounded-full bg-secondary-500/20"
            animate={{
              scale: [0.8, 1.3, 0.8],
              rotate: [0, 360],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 3,
            }}
          />
        </div>

        <div className="container relative z-10 mx-auto">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                className="mb-6 inline-block rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                Trusted Travel Partner Since 2013
              </motion.div>

              <motion.h1
                className="mb-6 text-4xl font-bold leading-tight text-white md:text-6xl lg:text-7xl"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                About <span className="text-secondary-400">Abdalawy</span>
                <br />
                <span className="text-3xl md:text-5xl lg:text-6xl">
                  Services
                </span>
              </motion.h1>

              <motion.p
                className="mb-8 max-w-lg text-xl leading-relaxed text-white/90"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Your trusted partner in travel, tourism, and immigration
                services. Building lasting relationships through excellence,
                transparency, and personalized service.
              </motion.p>

              <motion.div
                className="flex flex-col gap-4 sm:flex-row"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center justify-center space-x-3 rounded-full bg-secondary-500 px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:bg-secondary-600 hover:shadow-xl"
                  onClick={() =>
                    window.open(
                      "//api.whatsapp.com/send?phone=971557167147&text=Hello, I'd like to learn more about your services.",
                      "_blank",
                    )
                  }
                >
                  <span>Get Started</span>
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center justify-center space-x-3 rounded-full border-2 border-white/30 bg-white/5 px-8 py-4 font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/50"
                  onClick={() =>
                    document
                      .getElementById("our-story")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  <span>Learn More</span>
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
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                </motion.button>
              </motion.div>
            </motion.div>

            <motion.div
              className="flex justify-center lg:justify-end"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="relative">
                {/* Main image container */}
                <div className="relative rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-sm">
                  <motion.img
                    src="/images/aboutus/aboutus.webp"
                    alt="Abdalawy Services Logo"
                    className="mx-auto w-full max-w-xs transform transition-transform duration-500 hover:scale-110"
                    whileHover={{ rotate: [0, -5, 5, 0] }}
                    transition={{ duration: 0.6 }}
                  />

                  {/* Floating achievement badges */}
                  <motion.div
                    className="absolute -right-4 -top-4 rounded-full bg-secondary-400 px-3 py-2 text-sm font-bold text-white shadow-lg"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    500+ Clients
                  </motion.div>

                  <motion.div
                    className="absolute -bottom-4 -left-4 rounded-full bg-white/20 px-3 py-2 text-sm font-bold text-white shadow-lg backdrop-blur-sm"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                  >
                    10+ Years
                  </motion.div>
                </div>

                {/* Background glow */}
                <div className="absolute inset-0 -z-10 scale-110 transform rounded-3xl bg-gradient-to-br from-secondary-400/20 to-primary-400/20 blur-2xl"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Company Story Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50 px-4 py-16 md:px-6 lg:px-8 lg:py-24">
        {/* Background Pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute left-20 top-20 h-16 w-16 rounded-full bg-primary-200/30"
            animate={{
              y: [0, -15, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-32 right-32 h-12 w-12 rounded-full bg-secondary-300/20"
            animate={{
              scale: [1, 1.2, 1],
              x: [0, -10, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          />
        </div>

        <div className="container mx-auto">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="mb-6 text-3xl font-bold text-primary-700 md:text-4xl">
                Our Story
              </h2>
              <div className="space-y-4 leading-relaxed text-gray-600">
                <p>
                  Abdalawy has been a trusted name in travel and tourism
                  services, proudly assisting hundreds of clients with reliable
                  and professional solutions. Our commitment to timely service,
                  transparency, and customer satisfaction has earned us
                  long-term trust and strong relationships.
                </p>
                <p>
                  We take pride in guiding our clients through every step of
                  their journey and look forward to supporting their future
                  plans. Our expertise covers visa processing, travel
                  arrangements, and end-to-end support for individuals and
                  businesses.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex justify-center lg:justify-end"
            >
              <div className="relative rounded-2xl bg-gradient-to-br from-secondary-400/20 to-primary-400/20 blur-xl">
                <img
                  src="/images/title_logo.svg"
                  alt="Abdalawy Services Logo"
                  className="mx-auto w-full max-w-xs transform transition-transform duration-300 hover:scale-105 lg:mx-0"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 px-4 py-16 md:px-6 lg:px-8 lg:py-24">
        <div className="container mx-auto">
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-4 text-3xl font-bold text-gray-800 md:text-4xl">
              Our Achievements
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Numbers that reflect our commitment to excellence and customer
              satisfaction
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { number: "500+", label: "Happy Clients", icon: "" },
              { number: "10+", label: "Years Experience", icon: "" },
              { number: "50+", label: "Destinations", icon: "" },
              { number: "24/7", label: "Support", icon: "" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="rounded-xl bg-white p-6 text-center shadow-lg transition-shadow duration-300 hover:shadow-xl"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="mb-2 text-3xl">{stat.icon}</div>
                <div className="mb-2 text-3xl font-bold text-primary-600 md:text-4xl">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-gradient-to-br from-gray-50 to-blue-50 px-4 py-16 md:px-6 lg:px-8 lg:py-24">
        <div className="container mx-auto">
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-4 text-3xl font-bold text-gray-800 md:text-4xl">
              Meet Our Team
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Dedicated professionals committed to providing exceptional service
              and building lasting relationships with our clients.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Ahmed Al Abdalawy",
                role: "Founder & CEO",
                bio: "With over 15 years in travel and tourism, Ahmed leads our vision of excellence and innovation.",
                image: "/images/aboutus/profile1.webp",
                social: { linkedin: "#", email: "ahmed@abdalawygroup.com" },
              },
              {
                name: "Sarah Johnson",
                role: "Operations Manager",
                bio: "Sarah ensures seamless operations and exceptional client experiences across all our services.",
                image: "/images/aboutus/profile2.webp",
                social: { linkedin: "#", email: "sarah@abdalawygroup.com" },
              },
              {
                name: "Mohammed Al Hassan",
                role: "Senior Travel Consultant",
                bio: "Expert in crafting personalized travel experiences and immigration solutions.",
                image: "/images/aboutus/profile3.webp",
                social: { linkedin: "#", email: "mohammed@abdalawygroup.com" },
              },
            ].map((member, index) => (
              <motion.div
                key={index}
                className="group overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:shadow-2xl"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
              >
                <div className="relative overflow-hidden">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="text-white">
                      <div className="flex space-x-3">
                        <motion.a
                          href={`mailto:${member.social.email}`}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 transition-colors hover:bg-white/30"
                          whileHover={{ scale: 1.1 }}
                        >
                          <svg
                            className="h-4 w-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                          </svg>
                        </motion.a>
                        <motion.a
                          href={member.social.linkedin}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 transition-colors hover:bg-white/30"
                          whileHover={{ scale: 1.1 }}
                        >
                          <svg
                            className="h-4 w-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" />
                          </svg>
                        </motion.a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="mb-2 text-xl font-bold text-gray-800">
                    {member.name}
                  </h3>
                  <p className="mb-3 font-medium text-primary-600">
                    {member.role}
                  </p>
                  <p className="text-sm leading-relaxed text-gray-600">
                    {member.bio}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 px-4 py-16 md:px-6 lg:px-8 lg:py-24">
        <div className="container mx-auto">
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-4 text-3xl font-bold text-gray-800 md:text-4xl">
              What Our Clients Say
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Don&apos;t just take our word for it - hear from our satisfied
              clients who have experienced our exceptional service.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Maria Rodriguez",
                role: "Business Owner",
                location: "Spain",
                rating: 5,
                content:
                  "Abdalawy Services made our family vacation to Dubai unforgettable. Their attention to detail and personalized service exceeded our expectations. Highly recommended!",
                image: "/images/testimonials/maria.jpg",
              },
              {
                name: "Ahmed Al-Mansoori",
                role: "Entrepreneur",
                location: "UAE",
                rating: 5,
                content:
                  "Outstanding immigration services. They handled our business visa process efficiently and professionally. The team's expertise saved us valuable time.",
                image: "/images/testimonials/ahmed.jpg",
              },
              {
                name: "Sarah Chen",
                role: "Student",
                location: "China",
                rating: 5,
                content:
                  "From visa processing to accommodation arrangements, everything was seamless. Abdalawy Services truly cares about their clients' success.",
                image: "/images/testimonials/sarah.jpg",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="relative rounded-2xl bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-2xl"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                {/* Quote icon */}
                <div className="absolute -top-3 left-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary-500 shadow-lg">
                    <svg
                      className="h-6 w-6 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M14,17H17L19,13V7H13V13H16M6,17H9L11,13V7H5V13H8L6,17Z" />
                    </svg>
                  </div>
                </div>

                {/* Rating */}
                <div className="mb-4 flex items-center pt-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="h-5 w-5 fill-current text-yellow-400"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>

                {/* Content */}
                <p className="mb-6 italic leading-relaxed text-gray-600">
                  &quot;{testimonial.content}&quot;
                </p>

                {/* Author */}
                <div className="flex items-center">
                  <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-lg font-bold text-white">
                    {testimonial.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                    <p className="text-xs text-primary-600">
                      {testimonial.location}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="bg-gradient-to-br from-white to-gray-50 px-4 py-16 md:px-6 lg:px-8 lg:py-24">
        <div className="container mx-auto">
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-4 text-3xl font-bold text-gray-800 md:text-4xl">
              Our Mission & Values
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              The principles that guide every decision and action we take
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                title: "Excellence",
                description:
                  "We strive for excellence in every service we provide, ensuring the highest quality for our clients.",
                icon: "🏆",
                color: "from-blue-500 to-blue-600",
              },
              {
                title: "Integrity",
                description:
                  "Transparency and honesty are at the core of our business relationships and client interactions.",
                icon: "🤝",
                color: "from-green-500 to-green-600",
              },
              {
                title: "Innovation",
                description:
                  "We continuously adapt and innovate to provide cutting-edge solutions for modern travel needs.",
                icon: "💡",
                color: "from-purple-500 to-purple-600",
              },
            ].map((value, index) => (
              <motion.div
                key={index}
                className="group relative overflow-hidden rounded-2xl bg-white p-8 text-center shadow-lg transition-all duration-300 hover:shadow-2xl"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                {/* Background gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${value.color} opacity-0 transition-opacity duration-300 group-hover:opacity-5`}
                ></div>

                {/* Icon */}
                <motion.div
                  className="relative mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-200 shadow-lg"
                  whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  <span className="text-4xl">{value.icon}</span>
                </motion.div>

                <h3 className="mb-4 text-2xl font-bold text-gray-800 transition-colors duration-300 group-hover:text-primary-600">
                  {value.title}
                </h3>
                <p className="leading-relaxed text-gray-600">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-primary-50 px-4 py-16 md:px-6 lg:px-8 lg:py-24">
        <div className="container mx-auto">
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-4 text-3xl font-bold text-gray-800 md:text-4xl">
              Why Choose Abdalawy Services?
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              What sets us apart in the travel and immigration industry
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {[
              "Personalized service tailored to individual needs",
              "Expert consultation from licensed professionals",
              "Competitive pricing with no hidden fees",
              "Comprehensive support from start to finish",
              "Strong relationships with global partners",
              "Proven track record of successful outcomes",
            ].map((reason, index) => (
              <motion.div
                key={index}
                className="flex items-center space-x-4"
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary-500">
                  <span className="font-bold text-white">✓</span>
                </div>
                <span className="text-gray-700">{reason}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 px-4 py-16 text-center md:px-6 lg:px-8 lg:py-24">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">
              Ready to Start Your Journey?
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-xl text-white/90">
              Contact us today to discover how we can help you achieve your
              travel and immigration goals.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center space-x-3 rounded-full bg-secondary-500 px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:bg-secondary-600 hover:shadow-xl"
              onClick={() =>
                window.open(
                  "//api.whatsapp.com/send?phone=971557167147&text=Hello, I'd like to learn more about your services.",
                  "_blank",
                )
              }
            >
              <span>Contact Us</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </motion.button>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default AboutUs;
