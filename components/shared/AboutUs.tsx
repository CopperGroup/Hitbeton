"use client"

import { useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const features = [
  { title: "Craftsmanship", description: "Meticulous attention to detail in every piece" },
  { title: "Innovation", description: "Pushing the boundaries of concrete design" },
  { title: "Sustainability", description: "Eco-friendly materials and processes" },
]

export default function AboutUs() {
  const cardRef = useRef<HTMLDivElement>(null)
  const [cursor, setCursor] = useState({ x: 0, y: 0 })
  const isInView = useInView(cardRef, { once: true, amount: 0.3 })

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (cardRef.current !== null) {
      const rect = cardRef.current.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      setCursor({ x: x, y: y })
    }
  }

  return (
    <section className="w-full py-24 bg-[#F5F5F5] pb-56 max-sm:pb-36">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          className="relative overflow-hidden rounded-3xl bg-white shadow-xl"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="absolute inset-0 z-0">
            <div
              className="absolute inset-0 bg-gradient-to-br from-[#D3D3D3] to-[#F5F5F5]"
              style={{
                maskImage: `radial-gradient(circle at ${cursor.x}px ${cursor.y}px, transparent 100px, black 160px)`,
                WebkitMaskImage: `radial-gradient(circle at ${cursor.x}px ${cursor.y}px, transparent 100px, black 160px)`,
              }}
            />
          </div>
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center p-8 md:p-12">
            <div className="space-y-6">
              <motion.h2
                className="text-heading1-bold tracking-tighter text-[#2C2C2C]"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                About Concrete Elegance
              </motion.h2>
              <motion.p
                className="text-body-medium text-[#666666]"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                We are passionate artisans dedicated to transforming concrete into timeless works of art. Our sculptures
                blend modern aesthetics with the raw beauty of concrete, creating pieces that elevate any space.
              </motion.p>
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center space-x-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  >
                    <div className="size-3 min-w-3 rounded-full bg-[#8B4513]" />
                    <div>
                      <h3 className="text-base-semibold text-[#2C2C2C]">{feature.title}</h3>
                      <p className="text-small-regular text-[#666666]">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <motion.div
                className="w-full flex max-[340px]:justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                <Button
                  asChild
                  className="bg-[#2C2C2C] text-white hover:bg-[#1A1A1A] transition-colors max-[340px]:hidden"
                >
                  <Link href="/info/presentations" className="text-base-medium">
                    Learn More
                  </Link>
                </Button>
                <Link
                  href="/info/presentations"
                  className="w-fit text-small-medium text-[#2C2C2C] hover:text-[#8B4513] transition-colors min-[341px]:hidden"
                >
                  Learn More
                </Link>
              </motion.div>
            </div>
            <div className="relative h-[400px] rounded-xl overflow-hidden">
              <Image
                src="/assets/1.jpg"
                alt="Concrete sculpture process"
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-300 hover:scale-105"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

