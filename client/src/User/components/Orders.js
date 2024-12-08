import React, { useEffect, useState } from 'react';
import { getUserOrders } from '../services/orderService';
import { getCurrentUserID } from '../services/authService';
import "../styles/Orders.scss";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const userID = getCurrentUserID();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getUserOrders(userID);
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="orders-section">
      <h2>Orders</h2>
      {orders.length === 0 ? (
        <p>You don't have any orders yet</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="order-card">
            <div className="order-items">
              {order.items.map((item) => (
                <div key={item.watchID._id} className="order-item">
                  <img
                    src={item.watchID.images[0].image_url}
                    alt={item.watchID.images[0].alt_text}
                    className="item-image"
                  />
                  <div className="item-details">
                    <p className="item-name">{item.watchID.name}</p>
                    <p className="item-quantity">x{item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="order-summary">
              <p className="order-total">Total: <span>${order.total_amount.toFixed(2)}</span></p>
              <p className="order-status">
                State: 
                <span className={`status-label ${order.status.toLowerCase()}`}>
                  {order.status === "Shipping" ? (
                    <>
                      Shipping <i className="fas fa-shipping-fast"></i>
                    </>
                  ) : order.status === "Completed" ? (
                    <>
                      Done <i className="fas fa-check-circle"></i>
                    </>
                  ) : order.status}
                </span>
              </p>
              <button
                className={`vote-button ${order.status === "Completed" ? "active" : ""}`}
                disabled={order.status !== "Completed"}
              >
                {order.status === "Completed" ? "Vote" : "Vote"}
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Orders;
