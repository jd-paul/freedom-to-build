import { Boroughs } from '@/components/landing/boroughs'
import { Hero } from '@/components/landing/hero'
import { HowItPlays } from '@/components/landing/how-it-plays'
import { SiteFooter } from '@/components/landing/site-footer'
import { SiteHeader } from '@/components/landing/site-header'

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <HowItPlays />
        <Boroughs />
      </main>
      <SiteFooter />
    </>
  )
}
