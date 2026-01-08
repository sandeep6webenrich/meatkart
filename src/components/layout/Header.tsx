'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useCartStore } from '@/store/cart-store'

export function Header() {
  const items = useCartStore((state) => state.items)
  const [mounted, setMounted] = useState(false)
  const [locationOpen, setLocationOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const itemCount = mounted ? items.reduce((acc, item) => acc + item.quantity, 0) : 0

  return (
    <header>
      <div className="top-header">
        <div className="container">
          <div id="logo">
            <div className="col-md-4 col-xs-12 col-sm-12">
              <Link href="/"><img src="/images/logo.png" alt="logo" /></Link>
            </div>
          </div>
          <div className="col-md-8 col-xs-12 col-sm-12 no-gutter">
            <div className="col-md-4  no-gutter top-header-content">
              <div className="col-md-12  no-gutter">
                <p className="pull-left">Location:</p>
                <div className={`dropdown drop-down-content ${locationOpen ? 'open' : ''}`}>
                  <button 
                    className="btn btn-default dropdown-toggle drop-down-button" 
                    type="button" 
                    id="dropdownMenu1" 
                    onClick={() => setLocationOpen(!locationOpen)}
                    aria-haspopup="true" 
                    aria-expanded={locationOpen}
                  >
                  Location
                  <span className="caret click"></span>
                  </button>
                  <ul className="dropdown-menu locations" aria-labelledby="dropdownMenu1">
                    <li><a href="#">Hyderabad</a></li>
                    <li><a href="#">Ranigung</a></li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-md-4 no-gutter top-header-content text-center phone">
              <p>Order by Phone: 040 64629595</p>
            </div>
            <div className="col-md-2 no-gutter top-header-content text-center platter">
              <p><a href="">My Platter</a></p>
            </div>
            <div className="col-md-1 no-gutter top-header-content text-center sign-up ">
              <a href="">sign-up</a>
            </div>
            <div className="col-md-1 no-gutter top-header-content text-center sign-up login">
              <Link href="/auth/login">Login</Link>
            </div>
          </div>
        </div>
      </div>
      <div className="second-header">
        <div className="container">
          <div className="col-md-6 col-sm-12 col-xs-12">
            <div className="home-icon">
            </div>
            <nav>
              <ul className="menu">
                <li><Link href="/category/mutton">Mutton</Link></li>
                <li><Link href="/category/chicken">chicken</Link></li>
                <li><Link href="/category/seafood">sea food</Link></li>
                <li><Link href="/category/pre-spiced">pre-spiced</Link></li>
                <li><a href="#"><span>offers zone</span></a></li>
              </ul>
            </nav>
          </div>
          <div className="col-md-6 col-sm-12 col-xs-12 search">
            <div className=" col-md-8 no-gutter">
              <div className="input-group search-bar">
                <a href=""><img src="/images/search-icon.png" alt="search-img" className=" search-img" /></a>
                <input type="text" className="form-control search-bar-control" placeholder=" Search by keyword" />
                <span className="input-group-btn">
                  <button className="btn btn-default" type="button">search</button>
                </span>
              </div>
            </div>
            <div className="shopping">
              <Link href="/cart">
                <img src="/images/shopping.png" alt="icon " className="pull-left" />
                shopping bag<span className="pull-left">({itemCount} items)</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
