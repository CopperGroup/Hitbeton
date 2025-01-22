"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

const Map = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const pathLength = useTransform(scrollYProgress, [0, 0.8], [0, 1])
  const pathOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1])

  return (
    <section ref={sectionRef} className="relative bg-[#F5F5F5] py-24 flex items-center justify-center overflow-hidden">
      <motion.svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ opacity: pathOpacity }}
      >
        <motion.path
          d="M0,0 Q25,25 0,50 T0,100"
          fill="none"
          stroke="url(#gradient1)"
          strokeWidth="0.2"
          style={{ pathLength }}
        />
        <motion.path
          d="M100,0 Q75,25 100,50 T100,100"
          fill="none"
          stroke="url(#gradient2)"
          strokeWidth="0.2"
          style={{ pathLength }}
        />
        <motion.path
          d="M0,0 C25,25 75,25 100,0"
          fill="none"
          stroke="url(#gradient3)"
          strokeWidth="0.2"
          style={{ pathLength }}
        />
        <motion.path
          d="M0,100 C25,75 75,75 100,100"
          fill="none"
          stroke="url(#gradient1)"
          strokeWidth="0.2"
          style={{ pathLength }}
        />
        <motion.path
          d="M50,0 C25,25 75,75 50,100"
          fill="none"
          stroke="url(#gradient2)"
          strokeWidth="0.2"
          style={{ pathLength }}
        />
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop stopColor="#8B4513" />
            <stop offset={1} stopColor="#8B451305" />
          </linearGradient>
          <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop stopColor="#8B4513" />
            <stop offset={1} stopColor="#8B451305" />
          </linearGradient>
          <linearGradient id="gradient3" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop stopColor="#8B4513" />
            <stop offset={1} stopColor="#8B451305" />
          </linearGradient>
        </defs>
      </motion.svg>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          className="text-heading1-bold text-center text-[#2C2C2C] mb-8"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Visit Our Studio
        </motion.h2>
        <motion.div
          className="w-full aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.1422937950147!2d-73.98731968459391!3d40.74844524379132!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1642104433772!5m2!1sen!2sus"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Map of Concrete Elegance Studio"
            aria-label="Interactive map showing the location of Concrete Elegance Studio"
          ></iframe>
        </motion.div>
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <p className="text-heading4-medium text-[#2C2C2C] mb-2">Concrete Elegance Studio</p>
          <p className="text-body-medium text-[#666666]">350 Fifth Avenue, New York, NY 10118</p>
        </motion.div>
      </div>
    </section>
  )
}

export default Map

