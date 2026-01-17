"use client"

import '@vidstack/react/player/styles/default/theme.css'
import '@vidstack/react/player/styles/default/layouts/video.css'

import { MediaPlayer, MediaProvider } from '@vidstack/react'
import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default'

// Match Safari component dimensions
const VIDEO_WIDTH = 1203
const VIDEO_HEIGHT = 753

interface DemoPlayerProps {
  src: string
  title?: string
}

export function DemoPlayer({ src, title = "Demo Video" }: DemoPlayerProps) {
  return (
    <MediaPlayer
      title={title}
      src={src}
      aspectRatio={`${VIDEO_WIDTH}/${VIDEO_HEIGHT}`}
      crossOrigin
      playsInline
      load="visible"
      posterLoad="visible"
      className="overflow-hidden rounded-2xl shadow-2xl"
    >
      <MediaProvider />
      <DefaultVideoLayout 
        icons={defaultLayoutIcons}
        thumbnails={undefined}
      />
    </MediaPlayer>
  )
}
