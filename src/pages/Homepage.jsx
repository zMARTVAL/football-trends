import React from 'react'
import About from '../components/About'
import Head from '../components/Head'
import FirstChart from '../components/FirstChart'
import DashHead from '../components/DashHead'
import Footer from '../components/Footer'
import Hero from '../components/Hero'
const Homepage = () => {
  return (
    <div>
      <Hero />
      <About />
      <DashHead />
      <Head />
      
      <FirstChart />
      <Footer />

      </div>
  )
}

export default Homepage