"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import LinkButton from "../interface/LinkButton"
import { cn } from "@/lib/utils"

export default function BannerHero({ children }: { children?: React.ReactNode }) {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 })

  return (
    <motion.section
      ref={sectionRef}
      className="w-full flex justify-center items-center bg-[#8B4513]/10 rounded-3xl py-20 px-4 sm:px-6 md:px-8 lg:px-12 relative overflow-hidden"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Textured background overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-[#8B4513]/20 to-transparent opacity-40"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      <div className="w-full max-w-[1680px] flex flex-col lg:flex-row justify-between items-center relative z-10">
        <motion.div
          className="flex flex-col items-start space-y-6 lg:w-1/2 w-full"
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.h1
            className={cn("font-bold text-[#2C2C2C]", "leading-[140%]", "tracking-tight", "max-[580px]:text-[64px]")}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Elevate your space
          </motion.h1>
          <motion.h2
            className={cn("text-[24px] leading-[140%] font-bold text-[#4A4A4A] tracking-wide")}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Sculpting Modernity
          </motion.h2>
          <motion.p
            className="text-[18px] leading-[140%] font-normal text-[#666666] max-w-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Transform your environment with our handcrafted concrete sculptures. Each piece is a unique blend of modern
            aesthetics and timeless artistry.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <LinkButton
              href="/catalog"
              className="bg-[#2C2C2C] text-white hover:bg-[#1A1A1A] transition-colors px-6 sm:px-8 py-2 sm:py-3 rounded-full text-[16px] leading-[140%] font-semibold"
            >
              Explore Collection
            </LinkButton>
          </motion.div>
        </motion.div>
        <motion.div
          className="lg:w-1/2 w-full mt-10 lg:mt-0"
          initial={{ opacity: 0, x: 50 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="relative w-full">
            <Carousel className="w-full h-full rounded-3xl px-4 max-[820px]:px-0">
              <CarouselContent>
                {["modern-abstract", "geometric-form", "minimal-sculpture", "concrete-art"].map((item, index) => (
                  <CarouselItem key={index} className="h-full">
                    <div className="relative h-full w-full overflow-hidden rounded-2xl bg-[#E5E5E5]">
                      <img
                        src={`/assets/4.jpg`}
                        alt={`Concrete sculpture - ${item}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="absolute left-1/2 -translate-x-1/2 flex gap-2 mt-8">
                <CarouselPrevious className="bg-white/80 hover:bg-white" />
                <CarouselNext className="bg-white/80 hover:bg-white" />
              </div>
            </Carousel>
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
}

