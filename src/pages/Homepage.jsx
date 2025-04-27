import React from 'react'
import About from '../components/About'
import DashHead from '../components/DashHead'
import Footer from '../components/Footer'
import Head from '../components/Head'
import Hero from '../components/Hero'
import TrendDashboard from '../components/TrendDashboard'

const Homepage = () => {
  return (
    <div>
      <Hero />
      <About />
      <DashHead />
    
      <TrendDashboard />
      <Footer />

      </div>
  )
}

export default Homepage