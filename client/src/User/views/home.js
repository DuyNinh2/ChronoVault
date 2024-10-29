import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/home.scss';
import { useEffect, useState } from 'react';

function Home() {
  return (
    <div className="App">
      <Header />
      <ImageBanner />
      <TopCategories />
      <IntroSection />
      <AdBanner />
      <Footer />
    </div>
  );
}

function ImageBanner() {
  const images = [
      require('../images/banner1.jpg'),
      require('../images/banner2.jpg'),
  ];

  const [currentImage, setCurrentImage] = useState(0);
  const [isFading, setIsFading] = useState(false); // Thêm state để xử lý hiệu ứng mờ dần

  useEffect(() => {
      const interval = setInterval(() => {
          setIsFading(true); // Bắt đầu hiệu ứng mờ dần

          setTimeout(() => {
              setCurrentImage((prev) => (prev + 1) % images.length);
              setIsFading(false); // Kết thúc hiệu ứng mờ dần
          }, 300); // Thời gian mờ dần (300ms)
      }, 5000); // Chuyển đổi hình ảnh mỗi 5 giây

      return () => clearInterval(interval);
  }, [images.length]);

  return (
      <div className='banner-container'>
          <img
              src={images[currentImage]}
              alt='banner'
              className={`banner-image ${isFading ? 'fade' : ''}`}
          />
          {currentImage === 0 && (
              <div className="banner-text top-left">
                  <span className="collection-title">OCEAN STAR COLLECTION</span>
                  <br />
                  <a href="#" className="shop-link">Shop now &gt;</a>
              </div>
          )}
          {currentImage === 1 && (
              <div className="banner-text bottom-left">
                  <span className="collection-title">TIME TELLING JEWELLERY</span>
                  <br />
                  <a href="#" className="shop-link">Shop now &gt;</a>
              </div>
          )}
      </div>
  );
}

function TopCategories() {
  const categories = [
    { name: 'Analog', image: require('../images/analog.jpg') },
    { name: 'Digital', image: require('../images/digital.jpg') },
    { name: 'Mechanical', image: require('../images/mechanical.jpg') },
    { name: "Men's", image: require('../images/mens.jpg') },
    { name: "Women's", image: require('../images/womens.jpg') },
  ];

  return (
    <div className="top-categories">
      <h2>TOP CATEGORIES</h2>
      <div className="categories-list">
        {categories.map((category, index) => (
          <div key={index} className="category-item">
            <img src={category.image} alt={category.name} className="category-image" />
            <p className="category-name">{category.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function IntroSection() {
  return (
    <div className="intro-section">
      <img src={require('../images/store.jpg')} alt="ChronoVault store" className="intro-image" />
      <div className="intro-content">
        <h2>This is ChronoVault</h2>
        <p>
          This is a space to share more about the business: who's behind it, what it does and what this site has to offer. 
          It’s an opportunity to tell the story behind the business or describe a special service or product it offers. 
          You can use this section to share the company's history or highlight a particular feature that sets it apart from competitors.
        </p>
        <div className="info-block">
          <h3>OPENING HOURS</h3>
          <p>Mon - Fri 9:00 am – 5:00 pm</p>
          <p>Saturday 9:00 am – 2:00 pm</p>
          <p>Sunday 9:00 am – 2:00 pm</p>
        </div>
        <div className="info-block">
          <h3>ADDRESS</h3>
          <p>500 Terry Francine St.</p>
          <p>San Francisco, CA 94158</p>
          <p>Phone: 123-456-7890</p>
        </div>
      </div>
    </div>
  );
}

function AdBanner() {
  return (
    <div className="ad-banner">
      <img src={require('../images/ad-banner.jpg')} alt="Promotional Ad" className="ad-image" />
    </div>
  );
}

export default Home;
