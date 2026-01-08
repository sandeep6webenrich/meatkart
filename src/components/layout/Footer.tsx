import Link from 'next/link'

export function Footer() {
  return (
    <footer>
      <div className="subscribe">
        <div className="container">
          <div className="news-letter col-md-6 col-xs-12 col-sm-12">
            <div className="col-md-1 no-gutter pull-left message">
              <img src="/images/message.png" alt="message" className="pull-left" />
            </div>
            <div className="col-md-9 no-gutter " >
              <h3>Subscribe To Our Newsletter</h3>
              <p>Receive latest news on Offers, Discounts, New Products & much more...</p>
            </div>
            <div className="col-md-1 no-gutter message-right-img pull-right">
              <img src="/images/mail-img.png" alt="mail-img" />
            </div>
          </div>
          <div className="mail col-md-6 col-xs-12 col-sm-12">
            <form>
              <div className="form-group col-md-10 form-detailes">
                <input type="email" className="form-control form-detailes" id="exampleInputEmail1" placeholder="Enter Your Email Address" />
              </div>
            </form>
            <div className="col-md-2">
              <button type="button" className="btn btn-default submit-mail">Submit</button>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <div className="paypal col-md-3 no-gutter">
            <p className="col-md-2">Welcome:</p>
            <a href=""><img src="/images/paypal.png" alt="paypal" className="paypal-img" /></a>
            <img src="/images/footer-rb.png" className="pull-right " />
          </div>
          <div className="col-md-3 no-gutter ">
            <ul className="nav navbar-nav footer-links text-center col-md-11">
              <li><a href="#"><img src="/images/facebook.png" alt="facebook" /></a></li>
              <li><a href="#"><img src="/images/linkedin.png" alt="facebook" /></a></li>
              <li><a href="#"><img src="/images/twitter.png" alt="facebook" /></a></li>
              <li><a href="#"><img src="/images/gplus.png" alt="facebook" /></a></li>
            </ul>
            <img src="/images/footer-rb.png" />
          </div>
          <div className="col-md-6 no-gutter">
            <ul className="nav navbar-nav footer-links-nav text-center col-md-11">
              <li><a href="#">About Us</a></li>
              <li><a href="#">Customer Support</a></li>
              <li><a href="#">Return Policy</a></li>
              <li><a href="#">Privacy Policy  </a></li>
              <li><a href="#">Disclaimer</a></li>
            </ul>
            <p className="pull-right copyright">Copyrights © {new Date().getFullYear()} MeatKart. All Rights Reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
