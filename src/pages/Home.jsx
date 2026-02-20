import Banner from "../components/Banner";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import { motion } from "motion/react";
import { useEffect } from "react";
import "swiper/css";
import "swiper/css/effect-fade";

const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <main>
      {/* Home Banner with Video Slider */}
      <section className="relative h-screen w-full overflow-hidden">
        <Swiper
          modules={[Autoplay, EffectFade]}
          effect="fade"
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          loop={true}
          speed={1500}
          allowTouchMove={true}
          className="h-full w-full"
        >
          <SwiperSlide>
            <div className="relative h-full w-full">
              <video
                className="absolute inset-0 h-full w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
              >
                <source src="/images/videos/video1.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="mx-auto max-w-4xl px-4 text-center text-white"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.5 }}
                >
                  <motion.h1
                    className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl xl:text-6xl"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.8 }}
                  >
                    Discover Your
                    <br />
                    <span className="text-secondary-400">Next Adventure</span>
                  </motion.h1>
                  <motion.p
                    className="mb-6 text-lg text-white/90 md:text-xl lg:text-2xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 1.1 }}
                  >
                    Embark on extraordinary journeys with our premium travel
                    services
                  </motion.p>
                  <motion.button
                    className="rounded-full bg-secondary-500 px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-secondary-600 hover:shadow-xl"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 1.4 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      window.open(
                        "//api.whatsapp.com/send?phone=971557167147&text=Hello, I'd like to know more about your travel services.",
                        "_blank",
                      )
                    }
                  >
                    Explore Services
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="relative h-full w-full">
              <video
                className="absolute inset-0 h-full w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
              >
                <source src="/images/videos/video2.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="mx-auto max-w-4xl px-4 text-center text-white"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.5 }}
                >
                  <motion.h1
                    className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl xl:text-6xl"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.8 }}
                  >
                    Build Your Future
                    <br />
                    <span className="text-secondary-400">Beyond Borders</span>
                  </motion.h1>
                  <motion.p
                    className="mb-6 text-lg text-white/90 md:text-xl lg:text-2xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 1.1 }}
                  >
                    Elevate your global journey with trusted immigration
                    solutions
                  </motion.p>
                  <motion.button
                    className="rounded-full bg-secondary-500 px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-secondary-600 hover:shadow-xl"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 1.4 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      window.open(
                        "//api.whatsapp.com/send?phone=971557167147&text=Hello, I'd like to know more about your immigration services.",
                        "_blank",
                      )
                    }
                  >
                    Start Journey
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="relative h-full w-full">
              <video
                className="absolute inset-0 h-full w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
              >
                <source src="/images/videos/video3.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="mx-auto max-w-4xl px-4 text-center text-white"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.5 }}
                >
                  <motion.h1
                    className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl xl:text-6xl"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.8 }}
                  >
                    Enjoy Every
                    <br />
                    <span className="text-secondary-400">
                      Escape to Paradise
                    </span>
                  </motion.h1>
                  <motion.p
                    className="mb-6 text-lg text-white/90 md:text-xl lg:text-2xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 1.1 }}
                  >
                    Indulge in curated holiday experiences tailored to your
                    dreams
                  </motion.p>
                  <motion.button
                    className="rounded-full bg-secondary-500 px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-secondary-600 hover:shadow-xl"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 1.4 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      window.open(
                        "//api.whatsapp.com/send?phone=971557167147&text=Hello, I'd like to know more about your holiday packages.",
                        "_blank",
                      )
                    }
                  >
                    Book Now
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="relative h-full w-full">
              <video
                className="absolute inset-0 h-full w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
              >
                <source src="/images/videos/video4.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="mx-auto max-w-4xl px-4 text-center text-white"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.5 }}
                >
                  <motion.h1
                    className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl xl:text-6xl"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.8 }}
                  >
                    Streamline Your
                    <br />
                    <span className="text-secondary-400">
                      Documentation Process
                    </span>
                  </motion.h1>
                  <motion.p
                    className="mb-6 text-lg text-white/90 md:text-xl lg:text-2xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 1.1 }}
                  >
                    Navigate complex paperwork with our expert clearing services
                  </motion.p>
                  <motion.button
                    className="rounded-full bg-secondary-500 px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-secondary-600 hover:shadow-xl"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 1.4 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      window.open(
                        "//api.whatsapp.com/send?phone=971557167147&text=Hello, I'd like to know more about your document clearing services.",
                        "_blank",
                      )
                    }
                  >
                    Get Started
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </section>

      <Banner />
      {/* About Section */}
      <section
        className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-500 to-primary-700 px-4 py-16 md:px-6 lg:px-8 lg:py-28"
        id="ourStory"
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M30 30c0-8.3-6.7-15-15-15s-15 6.7-15 15 6.7 15 15 15 15-6.7 15-15zm15 0c0-8.3-6.7-15-15-15s-15 6.7-15 15 6.7 15 15 15 15-6.7 15-15z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>

        <div className="container relative z-10 mx-auto">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            {/* Left Content */}
            <motion.div
              className="space-y-8 lg:col-span-8"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="space-y-4">
                <motion.h2
                  className="mb-6 text-3xl font-bold text-white md:text-4xl lg:text-5xl"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  viewport={{ once: true }}
                >
                  About{" "}
                  <span className="text-secondary-400">Abdalawy Services</span>
                </motion.h2>

                <motion.div
                  className="space-y-4 text-lg leading-relaxed text-white/90"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <p>
                    Abdalawy has been a trusted name in travel and tourism
                    services, proudly assisting hundreds of clients with
                    reliable and professional solutions. Our commitment to
                    timely service, transparency, and customer satisfaction has
                    earned us long-term trust and strong relationships.
                  </p>
                  <p>
                    We offer a comprehensive range of services, including travel
                    and tourism solutions, immigration assistance, customized
                    holiday packages, and document clearing services. Our
                    expertise covers visa processing, travel arrangements, and
                    end-to-end support for individuals and businesses.
                  </p>
                </motion.div>
              </div>

              {/* Statistics */}
              <motion.div
                className="grid grid-cols-2 gap-6 md:grid-cols-4"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                {[
                  { number: "500+", label: "Happy Clients" },
                  { number: "10+", label: "Years Experience" },
                  { number: "50+", label: "Destinations" },
                  { number: "24/7", label: "Support" },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    className="rounded-xl border border-white/20 bg-white/10 p-4 text-center backdrop-blur-sm"
                    whileHover={{
                      scale: 1.05,
                      backgroundColor: "rgba(255,255,255,0.2)",
                    }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="text-2xl font-bold text-secondary-400 md:text-3xl">
                      {stat.number}
                    </div>
                    <div className="text-sm text-white/80">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                viewport={{ once: true }}
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group inline-flex items-center space-x-2 rounded-full border-2 border-secondary-400 bg-transparent px-4 py-2 text-sm font-semibold text-secondary-400 transition-all duration-300 hover:bg-secondary-400 hover:text-primary-600 hover:shadow-xl sm:space-x-3 sm:px-6 sm:py-3 sm:text-base md:px-8 md:py-4"
                  onClick={() => window.open("#", "_blank")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-1 sm:h-5 sm:w-5 md:h-6 md:w-6"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  <span className="text-xs sm:text-sm md:text-base">
                    Download Brochure
                  </span>
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Right Side - Logo/Image */}
            <motion.div
              className="flex justify-center lg:col-span-4 lg:justify-end"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-secondary-400/20 to-primary-400/20 blur-xl"></div>
                <div className="relative rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm sm:p-6 md:p-8">
                  <img
                    src="/images/aboutus/aboutus.webp"
                    alt="Abdalawy Services Logo"
                    className="mx-auto w-full max-w-[200px] transform transition-transform duration-300 hover:scale-105 sm:max-w-xs md:max-w-sm lg:mx-0"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      {/* Travel and Tourism Services Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-16 md:px-6 lg:px-8 lg:py-24">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%234F53AF' fill-opacity='0.03'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>

        <div className="container relative z-10 mx-auto">
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-4 flex flex-col items-center justify-center gap-2 text-center text-2xl font-bold text-primary-600 sm:flex-row sm:gap-4 sm:text-3xl md:text-4xl lg:text-5xl">
              <img
                src="/images/icons/travels.svg"
                alt=""
                className="h-8 w-8 object-contain sm:h-10 sm:w-10 md:h-12 md:w-12 lg:h-16 lg:w-16"
              />
              <span className="leading-tight">Travel and Tourism Services</span>
            </h2>

            <p className="mx-auto max-w-3xl text-base text-gray-600 sm:text-lg">
              Discover the world with our comprehensive travel solutions. From
              visa assistance to luxury accommodations, we make every journey
              unforgettable.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <motion.div
              className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              {[
                {
                  img: "/images/travel_and _tourism/1.webp",
                  title: "Flight & Ticketing",
                  // icon: "✈️",
                },
                {
                  img: "/images/travel_and _tourism/2.webp",
                  title: "Visa Assistance",
                  // icon: "📋",
                },
                {
                  img: "/images/travel_and _tourism/3.webp",
                  title: "Hotel Booking",
                  // icon: "🏨",
                },
                {
                  img: "/images/travel_and _tourism/4.webp",
                  title: "Tour Packages",
                  // icon: "🗺️",
                },
              ].map((service, index) => (
                <motion.div
                  key={index}
                  className="group relative cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <img
                    src={service.img}
                    alt={service.title}
                    className="h-40 w-full rounded-xl object-cover shadow-lg sm:h-48 md:h-52"
                  />
                  <div className="absolute inset-0 flex items-end rounded-xl bg-gradient-to-t from-primary-900/80 to-transparent p-3 sm:p-4">
                    <div className="text-white">
                      <p className="text-sm font-semibold sm:text-base">
                        {service.title}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="rounded-2xl bg-white p-4 shadow-xl sm:p-6 md:p-8">
                <h3 className="mb-3 text-xl font-bold text-primary-600 sm:mb-4 sm:text-2xl">
                  Your Journey, Our Expertise
                </h3>
                <p className="mb-4 text-sm leading-relaxed text-gray-600 sm:mb-6 sm:text-base">
                  We offer seamless travel solutions tailored to your needs.
                  Whether it&apos;s business travel, family vacations, or solo
                  adventures, our experienced team ensures every detail is
                  perfectly arranged.
                </p>
                <div className="mb-6 space-y-3">
                  {[
                    "Global destination coverage",
                    " Customized itineraries",
                    " Best price guarantee",
                    " 24/7 travel support",
                  ].map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 sm:space-x-3"
                    >
                      <div className="h-1.5 w-1.5 rounded-full bg-secondary-500 sm:h-2 sm:w-2"></div>
                      <span className="text-xs text-gray-700 sm:text-sm">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full rounded-full bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:shadow-lg sm:px-6 sm:py-3 sm:text-base"
                  onClick={() =>
                    window.open(
                      "//api.whatsapp.com/send?phone=971557167147&text=Hello, I'd like to know more about your travel services.",
                      "_blank",
                    )
                  }
                >
                  Plan Your Journey
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      {/* Immigration Solutions Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 to-teal-100 px-4 py-16 md:px-6 lg:px-8 lg:py-24">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2310B981' fill-opacity='0.05'%3E%3Cpath d='M30 30c0-8.3-6.7-15-15-15s-15 6.7-15 15 6.7 15 15 15 15-6.7 15-15zm15 0c0-8.3-6.7-15-15-15s-15 6.7-15 15 6.7 15 15 15 15-6.7 15-15z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>

        <div className="container relative z-10 mx-auto">
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-4 flex items-center justify-center gap-2 text-2xl font-bold text-primary-600 sm:gap-4 sm:text-3xl md:text-4xl lg:text-5xl">
              <img
                src="/images/icons/immigration.svg"
                alt=""
                className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 lg:h-16 lg:w-16"
              />
              <span className="text-center">Immigration Solutions</span>
            </h2>
            <p className="mx-auto max-w-3xl text-base text-gray-600 sm:text-lg">
              Navigate global opportunities with our expert immigration
              services. From work visas to residency, we make your international
              dreams a reality.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="rounded-2xl bg-white p-4 shadow-xl sm:p-6 md:p-8">
                <h3 className="mb-3 text-xl font-bold text-emerald-700 sm:mb-4 sm:text-2xl">
                  Your Global Journey Starts Here
                </h3>
                <p className="mb-4 text-sm leading-relaxed text-gray-600 sm:mb-6 sm:text-base">
                  Our immigration experts provide comprehensive support for your
                  international relocation needs. We handle the complexities so
                  you can focus on your new beginning.
                </p>
                <div className="mb-4 space-y-2 sm:mb-6 sm:space-y-3">
                  {[
                    " Complete documentation support",
                    " Work & business visas",
                    " Student visa assistance",
                    " Residency & settlement",
                  ].map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 sm:space-x-3"
                    >
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 sm:h-2 sm:w-2"></div>
                      <span className="text-xs text-gray-700 sm:text-sm">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:shadow-lg sm:px-6 sm:py-3 sm:text-base"
                  onClick={() =>
                    window.open(
                      "//api.whatsapp.com/send?phone=971557167147&text=Hello, I'd like to know more about your immigration services.",
                      "_blank",
                    )
                  }
                >
                  Start Your Application
                </motion.button>
              </div>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              {[
                {
                  img: "/images/immigration_services/1.webp",
                  title: "Work Visas",
                  // icon: "💼",
                },
                {
                  img: "/images/immigration_services/2.webp",
                  title: "Tourist Visas",
                  // icon: "✈️",
                },
                {
                  img: "/images/immigration_services/3.webp",
                  title: "Student Visas",
                  // icon: "🎓",
                },
                {
                  img: "/images/immigration_services/4.webp",
                  title: "Residency",
                  // icon: "🏠",
                },
              ].map((service, index) => (
                <motion.div
                  key={index}
                  className="group relative cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <img
                    src={service.img}
                    alt={service.title}
                    className="h-40 w-full rounded-xl object-cover shadow-lg sm:h-48 md:h-52"
                  />
                  <div className="absolute inset-0 flex items-end rounded-xl bg-gradient-to-t from-emerald-900/80 to-transparent p-3 sm:p-4">
                    <div className="text-white">
                      <p className="text-sm font-semibold sm:text-base">
                        {service.title}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
      {/* Holiday Packages Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-amber-100 px-4 py-16 md:px-6 lg:px-8 lg:py-24">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23F97316' fill-opacity='0.04'%3E%3Cpath d='M40 40c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm20 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>

        <div className="container relative z-10 mx-auto">
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-4 flex items-center justify-center gap-2 text-2xl font-bold text-primary-600 sm:gap-4 sm:text-3xl md:text-4xl lg:text-5xl">
              <img
                src="/images/icons/holiday.svg"
                alt=""
                className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 lg:h-16 lg:w-16"
              />
              <span className="text-center">Holiday Packages</span>
            </h2>
            <p className="mx-auto max-w-3xl text-base text-gray-600 sm:text-lg">
              Escape to paradise with our curated holiday packages. From
              romantic getaways to family adventures, we create memories that
              last forever.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <motion.div
              className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              {[
                {
                  img: "/images/holiday_packages/1.webp",
                  title: "Family Holidays",
                  // icon: "👨‍👩‍👧‍👦"
                },
                {
                  img: "/images/holiday_packages/2.webp",
                  title: "Honeymoon",
                  // icon: "💑",
                },
                {
                  img: "/images/holiday_packages/3.webp",
                  title: "Group Tours",
                  //   icon: "👥",
                },
                {
                  img: "/images/holiday_packages/4.webp",
                  title: "Adventure",
                  // icon: "🏔️",
                },
              ].map((service, index) => (
                <motion.div
                  key={index}
                  className="group relative cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <img
                    src={service.img}
                    alt={service.title}
                    className="h-40 w-full rounded-xl object-cover shadow-lg sm:h-48 md:h-52"
                  />
                  <div className="absolute inset-0 flex items-end rounded-xl bg-gradient-to-t from-orange-900/80 to-transparent p-3 sm:p-4">
                    <div className="text-white">
                      <p className="text-sm font-semibold sm:text-base">
                        {service.title}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="rounded-2xl bg-white p-4 shadow-xl sm:p-6 md:p-8">
                <h3 className="mb-3 text-xl font-bold text-orange-700 sm:mb-4 sm:text-2xl">
                  Your Perfect Getaway Awaits
                </h3>
                <p className="mb-4 text-sm leading-relaxed text-gray-600 sm:mb-6 sm:text-base">
                  Indulge in carefully crafted holiday experiences designed for
                  every traveler. From beach resorts to mountain retreats, we
                  handle all the details while you enjoy the journey.
                </p>
                <div className="mb-4 space-y-2 sm:mb-6 sm:space-y-3">
                  {[
                    " Premium accommodations",
                    " All-inclusive options",
                    " Transportation included",
                    " Customized itineraries",
                  ].map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 sm:space-x-3"
                    >
                      <div className="h-1.5 w-1.5 rounded-full bg-orange-500 sm:h-2 sm:w-2"></div>
                      <span className="text-xs text-gray-700 sm:text-sm">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full rounded-full bg-gradient-to-r from-orange-500 to-amber-600 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:shadow-lg sm:px-6 sm:py-3 sm:text-base"
                  onClick={() =>
                    window.open(
                      "//api.whatsapp.com/send?phone=971557167147&text=Hello, I'd like to know more about your holiday packages.",
                      "_blank",
                    )
                  }
                >
                  Book Your Dream Holiday
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      {/* Document Clearing Services Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-indigo-100 px-4 py-16 md:px-6 lg:px-8 lg:py-24">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='50' height='50' viewBox='0 0 50 50' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%237C3AED' fill-opacity='0.05'%3E%3Cpath d='M25 25c0-6.9-5.6-12.5-12.5-12.5S0 18.1 0 25 5.6 37.5 12.5 37.5 25 31.9 25 25zm12.5 0c0-6.9-5.6-12.5-12.5-12.5S12.5 18.1 12.5 25 18.1 37.5 25 37.5 37.5 31.9 37.5 25z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>

        <div className="container relative z-10 mx-auto">
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-4 flex items-center justify-center gap-2 text-center text-2xl font-bold text-primary-600 sm:gap-4 sm:text-3xl md:text-4xl lg:text-5xl">
              <img
                src="/images/icons/documentation.svg"
                alt=""
                className="h-8 w-8 shrink-0 object-contain sm:h-10 sm:w-10 md:h-12 md:w-12 lg:h-16 lg:w-16"
              />
              <span className="leading-tight">Documentation Services</span>
            </h2>

            <p className="mx-auto max-w-3xl text-base text-gray-600 sm:text-lg">
              Streamline your paperwork with our professional document clearing
              services. From visas to business licenses, we handle bureaucracy
              efficiently.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="rounded-2xl bg-white p-4 shadow-xl sm:p-6 md:p-8">
                <h3 className="mb-3 text-xl font-bold text-purple-700 sm:mb-4 sm:text-2xl">
                  Efficient Document Processing
                </h3>
                <p className="mb-4 text-sm leading-relaxed text-gray-600 sm:mb-6 sm:text-base">
                  Navigate complex documentation requirements with our expert
                  clearing services. We ensure accuracy, compliance, and timely
                  processing for all your official paperwork needs.
                </p>
                <div className="mb-4 space-y-2 sm:mb-6 sm:space-y-3">
                  {[
                    " Complete document management",
                    " Business license processing",
                    " Government liaison services",
                    " Fast-track processing",
                  ].map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 sm:space-x-3"
                    >
                      <div className="h-1.5 w-1.5 rounded-full bg-purple-500 sm:h-2 sm:w-2"></div>
                      <span className="text-xs text-gray-700 sm:text-sm">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:shadow-lg sm:px-6 sm:py-3 sm:text-base"
                  onClick={() =>
                    window.open(
                      "//api.whatsapp.com/send?phone=971557167147&text=Hello, I'd like to know more about your document clearing services.",
                      "_blank",
                    )
                  }
                >
                  Get Started Now
                </motion.button>
              </div>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              {[
                {
                  img: "/images/document_clearing/1.webp",
                  title: "Visa Processing",
                  // icon: "🛂",
                },
                {
                  img: "/images/document_clearing/2.webp",
                  title: "Business Licenses",
                  // icon: "📜",
                },
                {
                  img: "/images/document_clearing/3.webp",
                  title: "PRO Services",
                  // icon: "👔",
                },
                {
                  img: "/images/document_clearing/4.webp",
                  title: "Attestation",
                  // icon: "✅",
                },
              ].map((service, index) => (
                <motion.div
                  key={index}
                  className="group relative cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <img
                    src={service.img}
                    alt={service.title}
                    className="h-40 w-full rounded-xl object-cover shadow-lg sm:h-48 md:h-52"
                  />
                  <div className="absolute inset-0 flex items-end rounded-xl bg-gradient-to-t from-purple-900/80 to-transparent p-3 sm:p-4">
                    <div className="text-white">
                      <p className="text-sm font-semibold sm:text-base">
                        {service.title}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
