import React from 'react'
import '../Styles/hero.css'
import tennisImage from '../assets/images/3.png'
const Hero = () => {
  return (
    <section className="about-section">
      <div className="about-image">
        <img src={tennisImage} alt="Tennis equipment" />
        <div className="highlight-box">
          <h1><span>ترند</span> SPORT</h1>
        </div>
        <button className="about-button">GET IN TOUCH</button>
      </div>
    </section>
  )
}

export default Hero