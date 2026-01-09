import Link from 'next/link'
import AddToCartButton from './AddToCartButton'

type Product = {
  id: string
  name: string
  slug: string
  imageUrl: string
  weights: { id: string; weight: string; price: number, discountPrice?: number | null }[]
}

export default function ProductCard({ product }: { product: Product }) {
  // Sort weights to find the cheapest option to display
  const sortedWeights = [...product.weights].sort((a, b) => Number(a.price) - Number(b.price))
  const mainWeight = sortedWeights[0]

  return (
    <div className="product-card" style={{
      background: '#fff',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      padding: '15px',
      marginBottom: '20px',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      position: 'relative',
      border: '1px solid #eee'
    }}>
      {/* Image Area */}
      <Link href={`/product/${product.slug}`} style={{ display: 'block', textAlign: 'center', marginBottom: '10px' }}>
        <img 
          src={product.imageUrl || "/images/no-image.png"} 
          alt={product.name} 
          style={{ 
            height: '160px', 
            width: '100%', 
            objectFit: 'contain',
            borderRadius: '4px'
          }} 
        />
      </Link>

      {/* Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Link href={`/product/${product.slug}`} style={{ textDecoration: 'none', color: '#333' }}>
          <h3 style={{ 
            fontSize: '16px', 
            fontWeight: 600, 
            marginBottom: '5px',
            lineHeight: '1.4',
            minHeight: '44px', // 2 lines
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {product.name}
          </h3>
        </Link>
        
        {/* Short description or weight if available */}
        {mainWeight ? (
           <p style={{ color: '#777', fontSize: '13px', marginBottom: '10px' }}>
             Net wt: {mainWeight.weight}
           </p>
        ) : (
           <p style={{ color: '#999', fontSize: '13px', marginBottom: '10px' }}>Unavailable</p>
        )}

        {/* Price & Add Button Row */}
        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
           <div className="price-info">
             {mainWeight && (
                <>
                   <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#d11243' }}>
                     &#8377;{Number(mainWeight.price)}
                   </span>
                   {mainWeight.discountPrice && (
                     <span style={{ fontSize: '12px', color: '#999', textDecoration: 'line-through', marginLeft: '5px' }}>
                       &#8377;{mainWeight.discountPrice}
                     </span>
                   )}
                </>
             )}
           </div>
        </div>
        
        {/* Full width Add Button below */}
        <div style={{ marginTop: '12px' }}>
          <AddToCartButton product={product} variant="minimal" />
        </div>
      </div>
    </div>
  )
}
