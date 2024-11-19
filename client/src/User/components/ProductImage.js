import React from 'react';
import '../styles/ProductImage.scss';

const ProductImage = ({ images }) => {
  if (!images || images.length === 0) {
    return <p>No images available</p>;
  }

  return (
    <div className="product-image">
      <div className="main-image">
        <img src={images[0].image_url} alt={images[0].alt_text} />
      </div>
      <div className="thumbnails">
        {images.slice(1).map((img, index) => (
          <div key={index} className="thumbnail">
            <img src={img.image_url} alt={img.alt_text} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImage;
