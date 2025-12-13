"use client"

import { 
  Target, 
  TrendingUp, 
  CalendarCheck, 
  Trophy, 
  Flame, 
  ArrowRight,
  Zap,
  CheckCircle2,
  Sparkles
} from "lucide-react"
import Link from "next/link"
import CTAButton from "~/components/CTAButton"
import HeroSection from "~/components/HeroSection"
import Navbar from "~/components/Navbar"
import { Button } from "~/components/ui/button"

export default function Landing() {
  return (
    <div className="relative min-h-full overflow-hidden bg-white text-black w-full">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, black 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Decorative Elements */}
      {/* <div className="absolute top-20 right-10 w-72 h-72 bg-black/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-black/5 rounded-full blur-3xl" /> */}

      {/* Navigation */}
      <Navbar/>

      {/* Hero Section */}
     <HeroSection/>


      {/* Features Section */}
      <section className="relative py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Everything You Need to{" "}
              <span className="text-black/30">Win</span>
            </h2>
            <p className="text-xl text-black/60 max-w-2xl mx-auto">
              Make you a doer, not a thinker. Track, document, and analyze your growth like never before.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group p-8 rounded-2xl border-2 border-black/10 hover:border-black/30 transition-all hover:shadow-xl bg-white">
              <div className="w-14 h-14 rounded-xl bg-black/5 flex items-center justify-center mb-6 group-hover:bg-black group-hover:scale-110 transition-all">
                <Target className="w-7 h-7 text-black group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-bold mb-3">365-Day Commitment</h3>
              <p className="text-black/70 leading-relaxed">
                All or nothing. Miss even one habit, and the counter resets. This isn't about perfection—it's about understanding that every single day builds who you are.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 rounded-2xl border-2 border-black/10 hover:border-black/30 transition-all hover:shadow-xl bg-white">
              <div className="w-14 h-14 rounded-xl bg-black/5 flex items-center justify-center mb-6 group-hover:bg-black group-hover:scale-110 transition-all">
                <TrendingUp className="w-7 h-7 text-black group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Growth Visualization</h3>
              <p className="text-black/70 leading-relaxed">
                Watch your life take an upward spiral with real-time growth charts. See how daily consistency compounds into exponential transformation.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 rounded-2xl border-2 border-black/10 hover:border-black/30 transition-all hover:shadow-xl bg-white">
              <div className="w-14 h-14 rounded-xl bg-black/5 flex items-center justify-center mb-6 group-hover:bg-black group-hover:scale-110 transition-all">
                <CalendarCheck className="w-7 h-7 text-black group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Full-Year Calendar</h3>
              <p className="text-black/70 leading-relaxed">
                Track your complete 365-day journey with a calendar showing every completed day. Visualize your commitment and transformation unfold.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group p-8 rounded-2xl border-2 border-black/10 hover:border-black/30 transition-all hover:shadow-xl bg-white">
              <div className="w-14 h-14 rounded-xl bg-black/5 flex items-center justify-center mb-6 group-hover:bg-black group-hover:scale-110 transition-all">
                <Trophy className="w-7 h-7 text-black group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Accountability System</h3>
              <p className="text-black/70 leading-relaxed">
                Make yourself accountable. Document your progress, analyze patterns, and make self-improvement fun through gamification.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="group p-8 rounded-2xl border-2 border-black/10 hover:border-black/30 transition-all hover:shadow-xl bg-white">
              <div className="w-14 h-14 rounded-xl bg-black/5 flex items-center justify-center mb-6 group-hover:bg-black group-hover:scale-110 transition-all">
                <Zap className="w-7 h-7 text-black group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Instant Insights</h3>
              <p className="text-black/70 leading-relaxed">
                Get real-time feedback on your habits. Understand what works, what doesn't, and adjust your strategy for maximum impact.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="group p-8 rounded-2xl border-2 border-black/10 hover:border-black/30 transition-all hover:shadow-xl bg-white">
              <div className="w-14 h-14 rounded-xl bg-black/5 flex items-center justify-center mb-6 group-hover:bg-black group-hover:scale-110 transition-all">
                <Flame className="w-7 h-7 text-black group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Build Obsession</h3>
              <p className="text-black/70 leading-relaxed">
                Transform from a thinker to a doer. Build the kind of obsession that separates winners from the average.
              </p>
            </div>
          </div>
        </div>
      </section>

        {/* pricing */}

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
    </div>
  )
}