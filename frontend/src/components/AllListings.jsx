import { useState, useEffect } from 'react';
import { getAllListings } from '../api';

export default function AllListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAllListings();
  }, []);

  const fetchAllListings = async () => {
    try {
      const response = await getAllListings();
      setListings(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching all listings:', err);
      setError('Failed to fetch listings');
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="listings-container">
      <h2>All Available Items</h2>
      {listings.length === 0 ? (
        <p>No listings available</p>
      ) : (
        listings.map((listing) => (
          <div key={listing.id} className="listing-item">
            <h3>{listing.title}</h3>
            <p>{listing.description}</p>
            <div className="listing-details">
              <span>Price: ${listing.price}</span>
              <span>Category: {listing.category}</span>
              <span>Condition: {listing.condition}</span>
              <span>Seller: {listing.seller_email}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
} 