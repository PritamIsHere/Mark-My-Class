import { motion } from "framer-motion";
import { useState } from "react";
import Image from "../../assets/Image";

const particles = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 6 + Math.random() * 14,
  color: ["#fff", "#FFF7E6", "#FED9A6", "#FEAA7B", "#FF7000"][
    Math.floor(Math.random() * 5)
  ],
}));

export default function LoadingScreen() {
  // Interactive logo tilt
  const [logoTilt, setLogoTilt] = useState(0);

  return (
    <motion.div
      initial={{ backgroundPosition: "0% 50%" }}
      animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      className="relative flex flex-col items-center justify-center min-h-screen 
                 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-700 bg-[length:200%_200%] overflow-hidden"
    >
      {/* Floating Particles */}
      {particles.map(({ id, x, y, size, color }) => (
        <motion.div
          key={id}
          initial={{ opacity: 0.8, y: 0 }}
          animate={{ opacity: 0.4, y: [0, -16, 0] }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            repeatType: "reverse",
            delay: id * 0.2,
          }}
          style={{
            position: "absolute",
            left: `calc(${x}% - ${size / 2}px)`,
            top: `calc(${y}% - ${size / 2}px)`,
            width: size,
            height: size,
            borderRadius: "100%",
            background: color,
            boxShadow: "0 0 24px #FFF4 inset",
            zIndex: 0,
          }}
        />
      ))}

      {/* App Logo with hover tilt */}
      <motion.div
        initial={{ scale: 0, rotate: 0 }}
        animate={{ scale: 1, rotate: logoTilt }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-white rounded-full p-3 shadow-2xl cursor-pointer z-10 overflow-hidden"
        whileHover={{ scale: 1.1, rotate: 8 }}
        whileTap={{ scale: 0.9, rotate: -8 }}
        onPointerMove={(e) =>
          setLogoTilt((e.clientX / window.innerWidth - 0.5) * 30)
        }
        onPointerLeave={() => setLogoTilt(0)}
      >
        <img src={Image.logo} alt="Logo" className="w-20 h-20 scale-[1]" />
      </motion.div>

      {/* Animated App Name */}
      <motion.h1
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { y: 40, opacity: 0 },
          visible: {
            y: 0,
            opacity: 1,
            transition: {
              delay: 0.3,
              duration: 0.8,
              staggerChildren: 0.05,
            },
          },
        }}
        className="mt-6 text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg z-10"
        style={{ letterSpacing: 2 }}
      >
        {Array.from("Mark My Class").map((ch, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.06, duration: 0.5 }}
            className="inline-block"
          >
            {ch}
          </motion.span>
        ))}
      </motion.h1>

      {/* Shimmer Loading Bar */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "220px" }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
        className="relative mt-10 h-3 bg-white/30 rounded-full overflow-hidden shadow-md w-56"
      >
        <motion.div
          initial={{ x: "-120%" }}
          animate={{ x: "120%" }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-0 h-3 w-1/3 bg-gradient-to-r from-orange-300 via-white to-orange-400 rounded-full"
        />
      </motion.div>

      {/* Animated Sub-Text */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.72 }}
        className="mt-6 text-white text-sm tracking-wider z-10"
      >
        Loading your experience...
        <motion.span
          initial={{ opacity: 0.7 }}
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="inline-block ml-2"
        >
          ⏳
        </motion.span>
      </motion.p>
    </motion.div>
  );
}
