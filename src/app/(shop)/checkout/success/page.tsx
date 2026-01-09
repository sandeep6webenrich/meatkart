import Link from 'next/link'

export default function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: { orderId: string }
}) {
  return (
    <>
      <div className="breadcrumps-bg">
        <div className="container">
          <ol className="breadcrumb">
            <li><Link href="/">Home</Link></li>
            <li className="active">Order Success</li>
          </ol>
        </div>
      </div>

      <section className="mutton-section">
        <div className="container">
          <div className="col-md-12 text-center" style={{ padding: '50px 0' }}>
            <img src="/images/guarentee.png" alt="Success" style={{ marginBottom: 20 }} />
            <h2 style={{ color: '#019444' }}>Order Placed Successfully!</h2>
            <p className="lead">Thank you for your order.</p>
            {searchParams.orderId && <p>Order ID: {searchParams.orderId}</p>}
            <div style={{ marginTop: 30 }}>
              <Link href="/" className="btn btn-primary btn-lg">Continue Shopping</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
