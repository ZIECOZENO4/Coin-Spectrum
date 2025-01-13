"use client"

import { motion } from "framer-motion"
import { useUser } from "@clerk/nextjs"

export default function AnimatedWelcome() {
  const { user } = useUser()
  const text = `Welcome, ${user ? 
    (user.username || user.firstName || "User").charAt(0).toUpperCase() + 
    (user.username || user.firstName || "User").slice(1) 
    : "User"}`
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  }
  
  const letterVariants = {
    hidden: { 
      opacity: 0,
      y: 20,
      rotate: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      rotate: 0,
      transition: {
        type: "spring",
        damping: 10,
        stiffness: 100
      }
    }
  }

  const hoverVariants = {
    hover: {
      scale: 1.2,
      rotate: [0, -10, 10, -10, 0],
      transition: {
        type: "spring",
        duration: 0.4,
        bounce: 0.6
      }
    },
    tap: {
      scale: 0.8,
      rotate: 0,
      transition: {
        type: "spring",
        duration: 0.1
      }
    }
  }

  return (
    <div className="flex items-left">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative"
      >
        <div className="flex items-center space-x-1">
          {text.split("").map((char, index) => (
            <motion.span
              key={index}
              variants={letterVariants}
              whileHover="hover"
              whileTap="tap"
              variants={hoverVariants}
              className={`
                text-xl md:text-2xl font-bold cursor-pointer
                bg-gradient-to-r from-white via-white/80 to-white/60
                bg-clip-text text-transparent
                ${char === " " ? "w-4" : ""}
                hover:from-white hover:via-white/90 hover:to-white/70
                transition-colors duration-300
              `}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </div>
        
        <motion.div
          className="absolute inset-0 -z-10 blur-3xl"
          animate={{
            background: [
              "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
              "radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)",
              "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)"
            ]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </motion.div>
    </div>
  )
}
