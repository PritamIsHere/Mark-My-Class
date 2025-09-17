import { motion } from "framer-motion";
import Image from "../../assets/Image";

export default function LoadingScreen() {
  return (
    <motion.div
      initial={{ backgroundPosition: "0% 50%" }}
      animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      className="flex flex-col items-center justify-center min-h-screen 
                 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-700 
                 bg-[length:200%_200%]"
    >
      {/* App Logo */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-white rounded-full p-6 shadow-2xl"
      >
        <span className="text-4xl font-bold text-orange-600">
          <img src={Image.logo} alt="Logo" />
        </span>
      </motion.div>

      {/* App Name (No Fade-in) */}
      <motion.h1
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="mt-6 text-3xl md:text-4xl font-extrabold text-white drop-shadow-lg"
      >
        Mark My Class
      </motion.h1>

      {/* Loading Bar */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "200px" }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
        className="mt-8 h-2 bg-white/40 rounded-full overflow-hidden"
      >
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="h-2 bg-white rounded-full"
        />
      </motion.div>

      {/* Sub-text (No Fade-in) */}
      <motion.p
        initial={{ y: 10 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="mt-4 text-white text-sm tracking-wider"
      >
        Loading your experience...
      </motion.p>
    </motion.div>
  );
}
