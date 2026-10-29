import { useState } from 'react'
import { Navbar } from '@/components/Navbar'
import { About } from '@/sections/About'
import { Activities } from '@/sections/Activities'
import { Events } from '@/sections/Events'
import { Footer } from '@/sections/Footer'
import { Gallery } from '@/sections/Gallery'
import { Hero } from '@/sections/Hero'
import { Join } from '@/sections/Join'

export default function Home() {
  const [sidebarVisible, setSidebarVisible] = useState(true)

  return (
    <>
      <Navbar sidebarVisible={sidebarVisible} onToggleSidebar={() => setSidebarVisible((visible) => !visible)} />
      <div className={`transition-[padding] duration-300 ${sidebarVisible ? 'lg:pl-60' : 'lg:pl-0'}`}>
      <main>
        <Hero />
        <About />
        <Activities />
        <Events />
        <Gallery />
        <Join />
      </main>
      <Footer />
      </div>
    </>
  )
}
