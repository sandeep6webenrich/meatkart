import Link from 'next/link'

export default function Home() {
  return (
    <>
      {/* Categories */}
      <section>
        <div className="categories">
          <div className="container">
            <div className="col-md-3 images">
              <div className="category-images">
                <img src="/images/mutton-bg.png" alt="image" />
                <Link href="/category/mutton" className="links">MEAT</Link>
                <h3>TOTALLY<span>HYGENIC</span></h3>
              </div>
            </div>
            <div className="col-md-3 images">
              <div className="category-images">
                <img src="/images/chicken.png" alt="image" />
                <Link href="/category/chicken" className="links-chic">CHICKEN</Link>
                <h3>ALWAYS<span> FRESH</span></h3>
              </div>
            </div>
            <div className="col-md-3 images">
              <div className="category-images">
                <img src="/images/seafood.png" alt="image" />
                <Link href="/category/seafood" className="links-sea">SEAFOOD</Link>
                <h3>PREMIUM<span> QUALITY</span></h3>
              </div>
            </div>
            <div className="col-md-3 images">
              <div className="category-images-video">
                <iframe width="280" height="190" src="https://www.youtube.com/embed/QaTywtSq7TA" frameBorder="0" allowFullScreen></iframe>
              </div>
            </div>
            <div className="col-md-3 col-sm-12 col-xs-12 images">
              <div className="category-images-pro">
                <img src="/images/promotion2.png" alt="image" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Orders/Coupons */}
      <div className="orders">
        <div className="container">
          <div className="col-md-6 col-sm-12 col-xs-12 ">
            <div className="col-md-12 first-order">
              <div className="col-md-4 no-gutter">
                <div className="offer">
                  <h2>ENJOY<span> 20%&nbsp;OFF*</span></h2>
                </div>
              </div>
              <div className="col-md-8  no-gutter">
                <div className="purchase-order">
                  <h3>On your first purchase of orderabove <span>&#8377;200</span></h3>
                  <p>Use Coupon Code:<img src="/images/coupon.png" alt="image" /></p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-sm-12 col-xs-12 frozen-food">
            <div className="col-md-8 no-gutter">
              <div className="frozen-offer">
                <h2>5% OFF <br /><span>ON ALL FROZEN FOODS</span> </h2>
                <img src="/images/dish.png" alt="image" className="pull-right" />
              </div>
            </div>
            <div className="col-md-4 no gutter">
              <div className="shop-link">
                <a href="#">SHOP NOW</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Best Sellers */}
      <section className="best-sellars">
        <div className="container">
          <div className="sellars-heading">
            <div className="col-md-12  col-sm-12 col-xs-12 text-center">
              <span>best-sellers</span>
            </div>
          </div>
        </div>
        <div className="container">
          {/* Static products from HTML, replicated 4 times in row 1, 4 in row 2 */}
          {/* Item 1 */}
          <div className="col-md-3 col-sm-12 col-xs-12 items">
            <div className="col-md-12  sellars-items ">
              <Link href="/product/1"><img src="/images/sell-1.png" /></Link>
              <h3>Pre-Spiced Frozen Chicken Cutlets,Halal Cut </h3>
              <p className="more-info "><a href="" className="border-right"><span>Add to Wishlist</span></a><Link href="/product/1" className="border-left">More Info</Link></p>
            </div>
            <div className="col-md-12 add-bag ">
              <p><a href="">Add To bag</a></p>
            </div>
          </div>
          {/* Item 2 */}
          <div className="col-md-3 col-sm-12 col-xs-12 items ">
            <div className="col-md-12  sellars-items ">
              <Link href="/product/2"><img src="/images/sell-2.png" /></Link>
              <h3>Fresh Curry Cut Chicken </h3>
              <p className="more-info "><a href="" className="border-right"><span>Add to Wishlist</span></a><Link href="/product/2" className="border-left">More Info</Link></p>
            </div>
            <div className="col-md-12 add-bag ">
              <p><a href="">Add To bag</a></p>
            </div>
          </div>
          {/* Item 3 */}
          <div className="col-md-3 col-sm-12 col-xs-12 items ">
            <div className="col-md-12 sellars-items ">
              <Link href="/product/3"><img src="/images/sell-3.png" /></Link>
              <h3>Special Lamb Mutton Boneless Halal Cut </h3>
              <p className="more-info "><a href="" className="border-right"><span>Add to Wishlist</span></a><Link href="/product/3" className="border-left">More Info</Link></p>
            </div>
            <div className="col-md-12 add-bag">
              <p><a href="">Add To bag</a></p>
            </div>
          </div>
          {/* Item 4 */}
          <div className="col-md-3  col-sm-12 col-xs-12 items ">
            <div className="col-md-12  sellars-items ">
              <Link href="/product/4"><img src="/images/sell-4.png" /></Link>
              <h3>Pre-Spiced Andhra Tawa Fish Party Pack </h3>
              <p className="more-info "><a href="" className="border-right"><span>Add to Wishlist</span></a><Link href="/product/4" className="border-left">More Info</Link></p>
            </div>
            <div className="col-md-12 add-bag ">
              <p><a href="">Add To bag</a></p>
            </div>
          </div>
        </div>

        {/* Video Banner */}
        <div className="container">
          <div className="recipe-videos col-md-12 no-gutter">
            <a href=""><img src="/images/video-delicious.png" /></a>
          </div>
        </div>

        {/* Certificates */}
        <div className="container">
          <div className="col-md-6">
            <div className="certificate">
              <img src="/images/guarentee.png" alt="image" />
              <ul>
                <li><span></span> Hand-cut & Trimmed</li>
                <li><span></span> Products are Tested for Purity</li>
                <li><span></span> 100% Guaranteed Fresh</li>
              </ul>
            </div>
          </div>
          <div className="col-md-6">
            <div className="transport">
              <img src="/images/transport.png" alt="image" />
              <ul>
                <li><span></span> Free Shipping on orders above `400</li>
                <li><span></span> Choose Your Own Delivery Time</li>
                <li><span></span> Cash on Delivery Available</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
