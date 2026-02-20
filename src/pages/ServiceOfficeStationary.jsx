import Services from "../components/Services";
import { useEffect } from "react";
import { motion } from "motion/react";

const scalevariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
};

const ServicePrinting = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <main>
      <section className="flex h-[550px] overflow-hidden bg-primary-500 md:h-[300px] lg:h-[550px] 2xl:h-[750px]">
        <div className="lg:bg-right-center flex h-full w-full items-end bg-[url('/images/banners/office_stationary.webp')] bg-cover bg-center bg-no-repeat px-5 py-0 lg:py-24 2xl:px-5"></div>
      </section>
      <section className="bg-gray-100 px-4 py-8 lg:px-0 lg:py-24">
        <div className="container relative z-10 mx-auto">
          <h2 className="mb-4 text-center text-xl font-extrabold text-secondary-500 lg:mb-6 lg:text-5xl">
            Office Stationary
          </h2>
          <p className="mx-auto mb-8 w-full text-center text-sm leading-relaxed text-black lg:mb-14 lg:w-2/4 lg:text-lg">
            Boost your brand presence with custom office stationery, designed to
            enhance your workspace and leave a lasting impression with every
            use.
          </p>
          <div className="mx-auto grid w-full grid-cols-2 gap-2 md:grid-cols-4 md:gap-0 lg:w-5/6 lg:grid-cols-2 lg:gap-8">
            <motion.div
              className="flex flex-col bg-white"
              variants={scalevariants}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="overflow-hidden bg-white">
                <img
                  src="/images/services/office_stationary/03.webp"
                  alt="salad icon"
                  className="h-56 w-full transform object-cover transition-transform duration-300 ease-in-out hover:scale-110 lg:h-[600px]"
                />
              </div>
              <div className="p-3 lg:p-7">
                <h3 className="mb-2 text-center text-base font-semibold text-primary-500 lg:text-lg">
                  Tabletop Calender
                </h3>
                <p className="text-center text-sm !leading-relaxed text-gray-900 lg:text-base">
                  Custom tabletop calendars, designed to showcase your brand in
                  a practical and stylish way, leaving a lasting impression with
                  every glance.
                </p>
              </div>
            </motion.div>
            <motion.div
              className="flex flex-col bg-white"
              variants={scalevariants}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="overflow-hidden bg-white">
                <img
                  src="/images/services/office_stationary/02.webp"
                  alt="salad icon"
                  className="h-56 w-full transform object-cover transition-transform duration-300 ease-in-out hover:scale-110 lg:h-[600px]"
                />
              </div>
              <div className="p-3 lg:p-7">
                <h3 className="mb-2 text-center text-base font-semibold text-primary-500 lg:text-lg">
                  Business Cards
                </h3>
                <p className="text-center text-sm !leading-relaxed text-gray-900 lg:text-base">
                  Custom business cards, designed to showcase your brand with a
                  professional touch, leaving a lasting impression with every
                  exchange.
                </p>
              </div>
            </motion.div>
            <motion.div
              className="flex flex-col bg-white"
              variants={scalevariants}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="overflow-hidden bg-white">
                <img
                  src="/images/services/office_stationary/04.webp"
                  alt="salad icon"
                  className="h-56 w-full transform object-cover transition-transform duration-300 ease-in-out hover:scale-110 lg:h-[600px]"
                />
              </div>
              <div className="p-3 lg:p-7">
                <h3 className="mb-2 text-center text-base font-semibold text-primary-500 lg:text-lg">
                  Brochure
                </h3>
                <p className="text-center text-sm !leading-relaxed text-gray-900 lg:text-base">
                  Eye-catching brochures, designed to showcase your brand’s
                  message with clarity and style, leaving a lasting impression
                  on your audience.
                </p>
              </div>
            </motion.div>
            <motion.div
              className="flex flex-col bg-white"
              variants={scalevariants}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="overflow-hidden bg-white">
                <img
                  src="/images/services/office_stationary/01.webp"
                  alt="salad icon"
                  className="h-56 w-full transform object-cover transition-transform duration-300 ease-in-out hover:scale-110 lg:h-[600px]"
                />
              </div>
              <div className="p-3 lg:p-7">
                <h3 className="mb-2 text-center text-base font-semibold text-primary-500 lg:text-lg">
                  Letterheads
                </h3>
                <p className="text-center text-sm !leading-relaxed text-gray-900 lg:text-base">
                  Custom letterheads, designed to enhance your brand’s
                  professionalism and leave a lasting impression with every
                  correspondence.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      <Services />
    </main>
  );
};

export default ServicePrinting;
