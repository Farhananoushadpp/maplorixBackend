import Services from "../components/Services";
import { useEffect } from "react";
import { motion } from "motion/react";

const scalevariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
};

const ServiceFlags = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <main>
      <section className="flex h-[550px] overflow-hidden bg-primary-500 md:h-[300px] lg:h-[550px] 2xl:h-[750px]">
        <div className="lg:bg-right-center flex h-full w-full items-end bg-[url('/images/banners/flags.webp')] bg-cover bg-center bg-no-repeat px-5 py-0 lg:py-24 2xl:px-5"></div>
      </section>
      <section className="bg-gray-100 px-4 py-8 lg:px-0 lg:py-24">
        <div className="container relative z-10 mx-auto">
          <h2 className="mb-4 text-center text-xl font-extrabold text-secondary-500 lg:mb-6 lg:text-5xl">
            Flags & Banners
          </h2>
          <p className="mx-auto mb-8 w-full text-center text-sm leading-relaxed text-black lg:mb-14 lg:w-2/4 lg:text-lg">
            Boost your brand presence with custom flags and banners, designed to
            capture attention and make a lasting impression with every display.
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
                  src="/images/services/flags_banners/01.webp"
                  alt="salad icon"
                  className="h-56 w-full transform object-cover transition-transform duration-300 ease-in-out hover:scale-110 lg:h-[600px]"
                />
              </div>
              <div className="p-3 lg:p-7">
                <h3 className="mb-2 text-center text-base font-semibold text-primary-500 lg:text-lg">
                  Roll-up Banners
                </h3>
                <p className="text-center text-sm !leading-relaxed text-gray-900 lg:text-base">
                  Portable and striking roll-up banners, designed to showcase
                  your brand with ease and leave a lasting impression at any
                  event or location.
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
                  src="/images/services/flags_banners/02.webp"
                  alt="salad icon"
                  className="h-56 w-full transform object-cover transition-transform duration-300 ease-in-out hover:scale-110 lg:h-[600px]"
                />
              </div>
              <div className="p-3 lg:p-7">
                <h3 className="mb-2 text-center text-base font-semibold text-primary-500 lg:text-lg">
                  Poster Stand
                </h3>
                <p className="text-center text-sm !leading-relaxed text-gray-900 lg:text-base">
                  Versatile and impactful poster stands, designed to display
                  your brand’s message clearly and attract attention in any
                  setting.
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
                  src="/images/services/flags_banners/04.webp"
                  alt="salad icon"
                  className="h-56 w-full transform object-cover transition-transform duration-300 ease-in-out hover:scale-110 lg:h-[600px]"
                />
              </div>
              <div className="p-3 lg:p-7">
                <h3 className="mb-2 text-center text-base font-semibold text-primary-500 lg:text-lg">
                  Backdrop Banners
                </h3>
                <p className="text-center text-sm !leading-relaxed text-gray-900 lg:text-base">
                  Large and captivating backdrop banners, perfect for showcasing
                  your brand and creating a visually stunning focal point at
                  events and exhibitions.
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
                  src="/images/services/flags_banners/03.webp"
                  alt="salad icon"
                  className="h-56 w-full transform object-cover transition-transform duration-300 ease-in-out hover:scale-110 lg:h-[600px]"
                />
              </div>
              <div className="p-3 lg:p-7">
                <h3 className="mb-2 text-center text-base font-semibold text-primary-500 lg:text-lg">
                  Curved & L Banner Flags
                </h3>
                <p className="text-center text-sm !leading-relaxed text-gray-900 lg:text-base">
                  Dynamic and attention-grabbing curved top flags, designed to
                  showcase your brand and create a memorable impression wherever
                  displayed.
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

export default ServiceFlags;
