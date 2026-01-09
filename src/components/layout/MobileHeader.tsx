'use client'

import Link from 'next/link'
import { MapPin } from 'lucide-react'
import { useLocationStore } from '@/store/location-store'
import { useState, useEffect } from 'react'

export function MobileHeader() {
  const { city, setCity } = useLocationStore()
  const [mounted, setMounted] = useState(false)
  const [locationOpen, setLocationOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleCitySelect = (selectedCity: string) => {
    setCity(selectedCity)
    setLocationOpen(false)
  }

  return (
    <div className="mobile-header">
      <div className="mobile-header-top">
        <div className="mobile-logo">
          <Link href="/">
             <img src="/images/logo.png" alt="MeatKart" style={{ height: '32px' }} />
          </Link>
        </div>
        
        <div className="mobile-location">
          <button 
            className="location-btn"
            onClick={() => setLocationOpen(!locationOpen)}
          >
            <MapPin size={16} className="text-primary" />
            <span className="location-text">{mounted ? city : 'Location'}</span>
            <span className="caret"></span>
          </button>
          
          {locationOpen && (
            <div className="mobile-location-dropdown">
              <button onClick={() => handleCitySelect('Hyderabad')}>Hyderabad</button>
              <button onClick={() => handleCitySelect('Ranigung')}>Ranigung</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
