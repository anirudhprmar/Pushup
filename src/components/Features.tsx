import { 
  Target, 
  TrendingUp, 
  CalendarCheck, 
  Trophy, 
  Flame, 
  Zap,
} from "lucide-react"
import React from 'react'

export default function Features() {
  return (
    <section className="relative py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-4">
              Everything You Need to{" "}
              <span className="text-black/30">Win</span>
            </h2>
            <p className="text-lg text-black/60 max-w-2xl mx-auto">
              Make you a doer, not a thinker. Track, document, and analyze your growth like never before.
            </p>
          </div>

          <div className="w-full mx-auto flex-col gap-8">

            {/* Feature 1 */}
            <div className="flex  items-center justify-center gap-5 p-4 mx-auto">

              <div className="p-50 bg-black rounded-2xl">
              </div>

              <div className="flex flex-col gap-2 items-start">
                <h3 className="text-4xl font-bold mb-3 font-mono">365-Day Commitment</h3>
                <p className="text-black/70 leading-relaxed max-w-md">
                    All or nothing. Miss even one habit, and the counter resets. This isn&apos;t about perfection—it&apos;s about understanding that every single day builds who you are.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-center justify-center gap-8 p-4 mx-auto">

              <div className="flex flex-col gap-2 items-start">
                <h3 className="text-4xl font-bold mb-3 font-mono">Growth Visualization</h3>
                <p className="text-black/70 leading-relaxed max-w-md">
                     Watch your life take an upward spiral with real-time growth charts. See how daily consistency compounds into exponential transformation.
                </p>
              </div>
              <div className="p-50 bg-black rounded-2xl">
              </div>

            </div>

            {/* Feature 3 */}
            <div className="flex items-center justify-center gap-8 p-4 mx-auto">

              <div className="p-50 bg-black rounded-2xl">
              </div>

              <div className="flex flex-col gap-2 items-start">
                <h3 className="text-4xl font-bold mb-3 font-mono">Full-Year Calendar</h3>
                <p className="text-black/70 leading-relaxed max-w-md">
                     Track your complete 365-day journey with a calendar showing every completed day. Visualize your commitment and transformation unfold.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
               <div className="flex items-center justify-center gap-8 p-4 mx-auto">

              <div className="flex flex-col gap-2 items-start">
                <h3 className="text-4xl font-bold mb-3 font-mono">Accountability System</h3>
                <p className="text-black/70 leading-relaxed max-w-md">
                   Make yourself accountable. Document your progress, analyze patterns, and make self-improvement fun through gamification.
                </p>
              </div>
              <div className="p-50 bg-black rounded-2xl">
              </div>

            </div>
           
          </div>
        </div>
      </section>
  )
}
