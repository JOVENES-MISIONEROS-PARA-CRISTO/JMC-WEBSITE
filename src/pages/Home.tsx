import { SectionMenu } from '@/components/SectionMenu'
import { About } from '@/sections/About'
import { Activities } from '@/sections/Activities'
import { Events } from '@/sections/Events'
import { Footer } from '@/sections/Footer'
import { Gallery } from '@/sections/Gallery'
import { Hero } from '@/sections/Hero'
import { Join } from '@/sections/Join'

export default function Home() {

  return (
    <div className="jmc-home">
      <SectionMenu />
      <main className="jmc-content">
        <Hero />
        <About />
        <Activities />
        <Events />
        <Gallery />
        <Join />
      </main>
      <Footer />
    </div>
  )
}
