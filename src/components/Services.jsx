import { motion } from "motion/react";
import { Link } from "react-router-dom";

const slideUpVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

const Services = () => {
  return (
    <section className="bg-white px-4 py-8 lg:py-28" id="ourExpertise">
      <h2 className="mb-4 text-center text-xl font-extrabold text-primary-500 lg:mb-6 lg:text-5xl">
        Blueleaf Specialities
      </h2>
      <p className="mx-auto mb-8 w-full text-center text-sm leading-relaxed text-black lg:mb-14 lg:w-2/4 lg:text-lg">
        Blueleaf offers innovative and high-quality solutions to elevate your
        brand visibility, strengthen your identity, and meet your business
        needs. From custom signage and promotional gifts to stylish office
        essentials, our solutions are designed to help your business stand out
        and succeed.
      </p>
      <div className="container mx-auto">
        <div className="mx-auto grid w-full grid-cols-2 gap-3 md:w-4/5 md:grid-cols-3 lg:w-3/4 lg:grid-cols-3 lg:gap-8">
          <Link to="/indoor-outdoor-signs" className="group">
            <motion.div
              className="overflow-hidden"
              variants={slideUpVariants}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <img
                src="/images/specialities/indoor_outdoor_signs.webp"
                className="h-40 w-full rounded-sm object-cover transition-transform duration-300 group-hover:rotate-3 group-hover:scale-110 lg:h-72"
              />
            </motion.div>
            <p className="mt-3 text-center font-serif text-lg text-primary-500 group-hover:text-secondary-600 lg:text-2xl">
              Indoor & Outdoor Branding
            </p>
          </Link>
          <Link
            to="/paper-bags-boxes"
            className="group"
            variants={slideUpVariants}
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="overflow-hidden"
              variants={slideUpVariants}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <img
                src="/images/specialities/paper_bags_boxes.webp"
                className="h-40 w-full rounded-sm object-cover transition-transform duration-300 group-hover:rotate-3 group-hover:scale-110 lg:h-72"
              />
            </motion.div>
            <p className="mt-3 text-center font-serif text-lg text-primary-500 group-hover:text-secondary-600 lg:text-2xl">
              Paper Bags & Boxes
            </p>
          </Link>
          <Link
            to="/flags-banners"
            className="group"
            variants={slideUpVariants}
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="overflow-hidden"
              variants={slideUpVariants}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <img
                src="/images/specialities/flags_banners.webp"
                className="h-40 w-full rounded-sm object-cover transition-transform duration-300 group-hover:rotate-3 group-hover:scale-110 lg:h-72"
              />
            </motion.div>
            <p className="mt-3 text-center font-serif text-lg text-primary-500 group-hover:text-secondary-600 lg:text-2xl">
              Flags & Banners
            </p>
          </Link>
          <Link
            to="/gifts-promotions"
            className="group"
            variants={slideUpVariants}
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="overflow-hidden"
              variants={slideUpVariants}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <img
                src="/images/specialities/corporate_gifts.webp"
                className="h-40 w-full rounded-sm object-cover transition-transform duration-300 group-hover:rotate-3 group-hover:scale-110 lg:h-72"
              />
            </motion.div>
            <p className="mt-3 text-center font-serif text-lg text-primary-500 group-hover:text-secondary-600 lg:text-2xl">
              Corporate & Promotional Gifts
            </p>
          </Link>
          <Link
            to="/office-stationary"
            className="group"
            variants={slideUpVariants}
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="overflow-hidden"
              variants={slideUpVariants}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <img
                src="/images/specialities/office stationary.webp"
                className="h-40 w-full rounded-sm object-cover transition-transform duration-300 group-hover:rotate-3 group-hover:scale-110 lg:h-72"
              />
            </motion.div>
            <p className="mt-3 text-center font-serif text-lg text-primary-500 group-hover:text-secondary-600 lg:text-2xl">
              Office Stationary
            </p>
          </Link>
          <Link
            to="/restaurants-needs"
            className="group"
            variants={slideUpVariants}
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="overflow-hidden"
              variants={slideUpVariants}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <img
                src="/images/specialities/restaurants_needs.webp"
                className="h-40 w-full rounded-sm object-cover transition-transform duration-300 group-hover:rotate-3 group-hover:scale-110 lg:h-72"
              />
            </motion.div>
            <p className="mt-3 text-center font-serif text-lg text-primary-500 group-hover:text-secondary-600 lg:text-2xl">
              Restaurants Needs
            </p>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Services;
