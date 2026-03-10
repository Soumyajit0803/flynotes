import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Flynotes',
    short_name: 'Flynotes',
    description: 'A fast, secure, and minimal note-taking app built for speed and simplicity. Capture your thoughts effortlessly with Flynotes.',
    start_url: '/',
    display: 'standalone',
    background_color: '#2c2c2c',
    theme_color: '#2b2b2b',
    icons: [
      {
        src: '/favicon.ico',
        sizes: '256x256',
        type: 'image/x-icon',
      },
      {
        src: '/favicon.png',
        sizes: '800x800',
        type: 'image/png',
      }
    ],
  }
}