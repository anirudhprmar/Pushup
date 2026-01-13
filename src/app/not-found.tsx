"use client"
import { useRouter } from 'next/navigation'
import React from 'react'
import { Button } from '~/components/ui/button'

export default function NotFound() {
  const router = useRouter()
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-black px-4 py-16">
      {/* Header Text */}
      <div className="mb-8 text-center">
        <h1 className="text-xl font-normal tracking-wide text-white md:text-2xl">
          We all get lost sometimes.
        </h1>
      </div>

      {/* 404 Text with Halftone Effect */}
      <div className="relative mb-12">
        <div 
          className="text-[120px] font-bold leading-none text-white md:text-[200px] lg:text-[280px]"
          style={{
            fontFamily: 'system-ui, -apple-system, sans-serif',
            WebkitMaskImage: 'radial-gradient(circle, black 40%, transparent 70%)',
            maskImage: 'radial-gradient(circle, black 40%, transparent 70%)',
            WebkitMaskSize: '6px 6px',
            maskSize: '6px 6px',
            letterSpacing: '-0.02em',
          }}
        >
          404
        </div>
      </div>

      {/* Call to Action Button */}
      <div>
        <Button
          asChild
          variant="outline"
          size="lg"
          className="border-2 border-white bg-transparent px-8 py-6 text-base font-medium text-white hover:bg-white hover:text-black"
          onClick={()=> router.push("/profile")}
        >
          <p>Take me home</p>
        </Button>
      </div>
    </div>
  )
}