import Services from "../components/Services";
import { motion } from "motion/react";
import { useEffect } from "react";

const scalevariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
};

const flipVariants = {
  hidden: { opacity: 0, rotateY: -90 },
  visible: { opacity: 1, rotateY: 0 },
};

const ServiceBranding = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <main>
      <section className="flex h-[550px] overflow-hidden bg-primary-500 md:h-[300px] lg:h-[550px] 2xl:h-[750px]">
        <div className="flex h-full w-full items-end bg-[url('/images/banners/branding.webp')] bg-cover bg-left-top bg-no-repeat px-5 py-0 lg:items-center lg:py-24 2xl:px-5"></div>
      </section>
      <section className="bg-gray-100 px-4 py-8 lg:px-0 lg:py-24">
        <div className="container relative z-10 mx-auto">
          <h2 className="mb-4 text-center text-xl font-extrabold text-secondary-500 lg:mb-6 lg:text-5xl">
            Indoor & Outdoor Branding
          </h2>
          <p className="mx-auto mb-8 w-full text-center text-sm leading-relaxed text-black lg:mb-14 lg:w-2/4 lg:text-lg">
            Elevate your brand presence with innovative indoor and outdoor
            solutions, designed to effectively engage your audience and leave a
            lasting impression.
          </p>
          <div className="mx-auto grid w-full grid-cols-2 gap-2 md:grid-cols-4 md:gap-0 lg:w-5/6 lg:grid-cols-2 lg:gap-8">
            <motion.div
              variants={flipVariants}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 0.5 }}
              style={{ perspective: "1000px" }}
              viewport={{ once: true }}
              className="flex flex-col bg-white"
            >
              <div className="overflow-hidden bg-white">
                <img
                  src="/images/services/signboards/01.webp"
                  alt="salad icon"
                  className="h-56 w-full transform object-cover transition-transform duration-300 ease-in-out hover:scale-110 lg:h-[600px]"
                />
              </div>

              <div className="p-3 lg:p-7">
                <h3 className="mb-2 text-center text-base font-semibold text-primary-500 md:text-base lg:text-lg">
                  Office Name Boards
                </h3>
                <p className="text-center text-sm !leading-relaxed text-gray-900 lg:text-base">
                  Bold office name board designs that maximize visibility and
                  leave a lasting impression, perfect for showcasing your brand
                  in style.
                </p>
              </div>
            </motion.div>
            <motion.div
              variants={scalevariants}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="flex flex-col bg-white"
            >
              <div className="overflow-hidden bg-white">
                <img
                  src="/images/services/signboards/03.webp"
                  alt="salad icon"
                  className="h-56 w-full transform object-cover transition-transform duration-300 ease-in-out hover:scale-110 lg:h-[600px]"
                />
              </div>
              <div className="p-3 lg:p-7">
                <h3 className="mb-2 text-center text-base font-semibold text-primary-500 md:text-base lg:text-lg">
                  Retail Stores Sign Boards
                </h3>
                <p className="text-center text-sm !leading-relaxed text-gray-900 lg:text-base">
                  Stylish and high-visibility signboards for retail stores,
                  designed to captivate customers and enhance your brand’s
                  appeal and recognition.
                </p>
              </div>
            </motion.div>
            <motion.div
              variants={flipVariants}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 0.5 }}
              style={{ perspective: "1000px" }}
              viewport={{ once: true }}
              className="flex flex-col bg-white"
            >
              <div className="overflow-hidden bg-white">
                <img
                  src="/images/services/signboards/02.webp"
                  alt="salad icon"
                  className="h-56 w-full transform object-cover transition-transform duration-300 ease-in-out hover:scale-110 lg:h-[600px]"
                />
              </div>
              <div className="p-3 lg:p-7">
                <h3 className="mb-2 text-center text-base font-semibold text-primary-500 md:text-base lg:text-lg">
                  Buildings Sign Boards
                </h3>
                <p className="text-center text-sm !leading-relaxed text-gray-900 lg:text-base">
                  Durable and impactful signboards for warehouses and buildings,
                  ensuring clear visibility and professional branding.
                </p>
              </div>
            </motion.div>
            <motion.div
              variants={scalevariants}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="flex flex-col bg-white"
            >
              <div className="overflow-hidden bg-white">
                <img
                  src="/images/services/signboards/04.webp"
                  alt="salad icon"
                  className="h-56 w-full transform object-cover transition-transform duration-300 ease-in-out hover:scale-110 lg:h-[600px]"
                />
              </div>
              <div className="p-3 lg:p-7">
                <h3 className="mb-2 text-center text-base font-semibold text-primary-500 md:text-base lg:text-lg">
                  Cafes & Shops Sign Boards
                </h3>
                <p className="text-center text-sm !leading-relaxed text-gray-900 lg:text-base">
                  Charming and visually striking signboards for cafes and shops,
                  tailored to attract customers and elevate your brand identity.
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

export default ServiceBranding;
