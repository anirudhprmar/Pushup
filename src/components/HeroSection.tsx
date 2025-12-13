"use client"
import React from 'react'
import { Button } from './ui/button'
import {motion} from "motion/react"
import Link from 'next/link'
import CTAButton from './CTAButton'
import { Flame } from 'lucide-react'
import { useCounter } from '~/hooks/UseCounter'

export default function HeroSection() {
    const count = useCounter(365, 2000)
  return (
    <section className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-5 pb-32  md:pb-48">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-indigo-300/10 border border-black/10 mb-8 backdrop-blur-sm">
          <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
        </motion.div>
            <span className="text-sm font-semibold">{count} Days of Pure Transformation</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-8 leading-[1.05] tracking-tight">
            Don&apos;t just {" "} 
            <span className="relative inline-block">
              <span className="relative z-10 ">Dream,</span>
              <span className="absolute inset-0 bg-black/10 -skew-x-12 -z-10" />
            </span>
            <br />
            Make it a{" "}
            <span className="italic font-semibold">Reality.</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-black/70 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
            Don&apos;t just build habits. Build a lifestyle. Transform into the best version of yourself through 365 days of relentless consistency.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 justify-center items-center">
            <Link href="/login">
              <CTAButton text="Start Your Journey"/>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-20 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-black mb-2">365</div>
              <div className="text-sm text-black/60 font-medium">Days Challenge</div>
            </div>
            <div className="text-center border-x border-black/10">
              <div className="text-4xl font-black mb-2">100%</div>
              <div className="text-sm text-black/60 font-medium">Commitment</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black mb-2">∞</div>
              <div className="text-sm text-black/60 font-medium">Potential</div>
            </div>
          </div>
        </div>
      </section>
  )
}
