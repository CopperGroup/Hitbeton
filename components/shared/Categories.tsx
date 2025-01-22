"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import Link from "next/link"
import Image from "next/image"

const categories = [
  {
    name: "Abstract Forms",
    description: "Contemporary sculptural expressions",
    image:"/assets/1.jpg",
    href: "/collection/abstract",
  },
  {
    name: "Geometric Series",
    description: "Precision in concrete design",
    image: "/assets/2.jpg",
    href: "/collection/geometric",
  },
  {
    name: "Architectural Elements",
    description: "Functional art pieces",
    image: "/assets/3.jpg",
    href: "/collection/architectural",
  },
]

export default function Categories() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 })

  return (
    <motion.section
      ref={sectionRef}
      className="w-full py-24 bg-gradient-to-b from-[#F5F5F5] to-white"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="w-full flex justify-center items-center">
        <div className="w-full max-w-[1680px] px-12 max-lg:px-9 max-[500px]:px-7">
          <motion.h2
            className="text-heading1-semibold text-[#2C2C2C] mb-6 text-center tracking-wide"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Collection Categories
          </motion.h2>
          <motion.div
            className="w-24 h-[1px] bg-[#8B4513] mx-auto mb-8 opacity-60"
            initial={{ width: 0 }}
            animate={isInView ? { width: 96 } : { width: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          />
          <motion.p
            className="text-body-medium text-[#666666] mb-20 text-center max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Discover our curated collection of handcrafted concrete sculptures
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.8, delay: 0.4 + index * 0.2 }}
              >
                <Link href={category.href} className="group block">
                  <div className="relative w-full h-[500px] rounded-2xl overflow-hidden transition-all duration-500 group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] max-[425px]:h-[400px] max-[380px]:h-[350px]">
                    <Image
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-70" />
                    <div className="absolute inset-0 flex flex-col items-center justify-end p-10">
                      <h3 className="text-heading3-bold text-white text-center mb-3 transform transition-transform duration-500 ease-out group-hover:translate-y-[-8px] tracking-wide">
                        {category.name}
                      </h3>
                      <p className="text-base-regular text-white/80 text-center mb-6 transform transition-transform duration-500 ease-out opacity-0 group-hover:opacity-100 group-hover:translate-y-[-8px]">
                        {category.description}
                      </p>
                      <span className="text-small-semibold text-white border border-white/30 backdrop-blur-sm px-6 py-2 rounded-full opacity-0 transform translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                        Explore Collection
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <motion.div
        className="w-full flex justify-center mt-16"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <Link
          href="/collection"
          className="text-body-semibold text-[#2C2C2C] hover:text-[#8B4513] transition-colors duration-300 relative group tracking-wide"
        >
          <span className="relative z-10">View All Collections</span>
          <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#8B4513] transform origin-left transition-all duration-300 group-hover:scale-x-100 scale-x-0"></span>
        </Link>
      </motion.div>
    </motion.section>
  )
}

