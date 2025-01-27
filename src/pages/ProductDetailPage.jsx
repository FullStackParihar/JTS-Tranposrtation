import productDetails from '../utility/TruckDesc';
import { useParams } from 'react-router-dom';

const ProductDetailPage = () => {
  const { id } = useParams();
  
  // Convert id to a number for proper comparison
  const product = productDetails.find(item => item.id === Number(id));

  if (!product) {
    return (
      <div className="text-center py-20">
        <h2 className="text-3xl font-bold text-[#6A1B9A]">Product Not Found</h2>
        <p className="text-gray-600 mt-2">We couldn't find the product you're looking for.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-16 px-8 text-center bg-white shadow-xl rounded-lg">
  <h1 className="text-5xl font-extrabold text-[#6A1B9A] leading-tight">{product.name}</h1>
  
  <div className="mt-8 flex flex-col md:flex-row items-center md:items-start gap-8">
    <img 
      src={product.image} 
      alt={product.name} 
      className="rounded-xl shadow-lg w-full md:w-1/2 max-w-lg mx-auto"
    />
    
    <div className="text-left md:w-1/2">
      <p className="text-lg text-gray-700 leading-relaxed">
        {product.description}
      </p>

      <ul className="mt-4 text-left list-disc list-inside text-gray-600 space-y-2">
        {product.id === 1 && (
          <>
            <li>Temperature-controlled transportation</li>
            <li>Ideal for bulk deliveries</li>
            <li>Long-distance suitability</li>
          </>
        )}
        {product.id === 2 && (
          <>
            <li>Quick and flexible delivery</li>
            <li>Cost-effective for short distances</li>
            <li>Easy maneuverability in urban areas</li>
          </>
        )}
        {product.id === 3 && (
          <>
            <li>Advanced refrigeration technology</li>
            <li>Preserves milk freshness during transit</li>
            <li>Suitable for long storage and transport</li>
          </>
        )}
      </ul>

      <a 
        href="/" 
        className="mt-6 inline-block bg-[#F57C00] text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-md hover:bg-[#D65A00] transition duration-300"
      >
        Back to Home
      </a>
    </div>
  </div>
</div>

  );
};

export default ProductDetailPage;
