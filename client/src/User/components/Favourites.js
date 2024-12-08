import React, { useEffect, useState, useRef } from "react";
import { fetchWishlist } from "../services/userService";
import { getCurrentUserID } from '../services/authService';
import "../styles/Favourites.scss";

const Favourites = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const userID = getCurrentUserID();
  const listRef = useRef(null);

  useEffect(() => {
    const loadWishlist = async () => {
      try {
        const data = await fetchWishlist(userID);
        setWishlist(data);
      } catch (error) {
        console.error("Failed to load wishlist:", error);
      } finally {
        setLoading(false);
      }
    };

    loadWishlist();
  }, [userID]);

  const scrollLeft = () => {
    if (listRef.current) { 
        listRef.current.scrollBy({ left: -300, behavior: 'smooth' }); 
    }
  };

  const scrollRight = () => {
    if (listRef.current) { 
        listRef.current.scrollBy({ left: 300, behavior: 'smooth' }); 
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="favourites-container">
      <div className="favourites-header">
        <h2>Favourites</h2>
        <div className="header-buttons">
          <button className="view-all">View All</button>
          <button className="scroll-button left" onClick={scrollLeft} disabled={wishlist.length < 3}>&#8249;</button>
          <button className="scroll-button right" onClick={scrollRight} disabled={wishlist.length < 3}>&#8250;</button>
        </div>
      </div>
      <hr />
      {wishlist.length > 0 ? (
        <div className="favourites-carousel">
          <div className="favourites-list" ref={listRef}>
            {wishlist.map((watch) => (
              <div className="favourite-item" key={watch._id}>
                <img src={watch.images[0].image_url} alt={watch.images[0].alt_text || watch.name} />
                <div className="favourite-info">
                  <p className="watch-name">{watch.name}</p>
                  <p className="watch-price">${watch.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="no-items">Items added to your Favourites will be saved here.</p>
      )}
    </div>
  );
};

export default Favourites;
