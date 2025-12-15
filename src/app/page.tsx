"use client"

import { ArrowRight } from "lucide-react"
import Features from "~/components/Features"
import Link from "next/link"
import HeroSection from "~/components/HeroSection"
import Navbar from "~/components/Navbar"
import { Button } from "~/components/ui/button"
import Footer from "~/components/Footer"

export default function Landing() {
  return (
    <div className="relative min-h-full overflow-hidden text-black w-full bg-white">


      {/* Navigation */}
      <Navbar/>

      {/* Hero Section */}
     <HeroSection/>


      {/* Features Section */}
     <Features/>


        {/* faq */}

      {/* Final CTA Section */}
      <section className="relative py-24 md:py-32 bg-black text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
            Become the Best{" "}
            <span className="text-white/50">Version of Yourself</span>
          </h2>
          <p className="text-xl text-white/70 mb-12 leading-relaxed">
            Stop thinking. Start doing. Your 365-day transformation begins today.
          </p>
          <Link href="/login">
            <Button size="lg" className="bg-white text-black hover:bg-white/90 gap-2 px-10 h-16 text-lg font-bold shadow-2xl">
              Start Your 365-Day Journey <ArrowRight className="w-6 h-6" />
            </Button>
          </Link>
          <p className="text-sm text-white/50 mt-6">
            Join thousands who chose obsession over average
          </p>
        </div>
      </section>

      {/* footer */}
      <Footer />
    </div>
  )
}