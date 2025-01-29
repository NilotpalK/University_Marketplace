import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyListings, createListing } from './api';
import AllListings from './components/AllListings';

export default function HomePage() {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newListing, setNewListing] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    condition: ''
  });
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'my'

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
    } else {
      fetchListings();
    }
  }, [navigate]);

  const fetchListings = async () => {
    try {
      const response = await getMyListings();
      setListings(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error details:', err);
      setError(err.response?.data?.detail || 'Failed to fetch listings. Please check your connection.');
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleCreateListing = async (e) => {
    e.preventDefault();
    setError(''); // Clear any previous errors
    try {
      // Validate price is a number
      const priceValue = parseFloat(newListing.price);
      if (isNaN(priceValue)) {
        setError('Price must be a valid number');
        return;
      }

      // Ensure all required fields are filled
      if (!newListing.title || !newListing.description || 
          !newListing.category || !newListing.condition || 
          !newListing.price) {
        setError('All fields are required');
        return;
      }

      const listingData = {
        ...newListing,
        price: priceValue,
        location: "Campus" // Adding a default location since it's required by the backend
      };

      await createListing(listingData);
      
      // Reset form and fetch updated listings
      setNewListing({
        title: '',
        description: '',
        price: '',
        category: '',
        condition: ''
      });
      setShowCreateForm(false);
      await fetchListings();
    } catch (err) {
      console.error('Create listing error:', err);
      setError(err.response?.data?.detail || 'Failed to create listing. Please try again.');
    }
  };

  if (loading) return <div className="auth-form">Loading...</div>;
  if (error) return <div className="auth-form">{error}</div>;

  return (
    <div className="auth-form">
      <div className="header-bar">
        <h2>University Marketplace</h2>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>

      <div className="tabs">
        <button 
          className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All Listings
        </button>
        <button 
          className={`tab-button ${activeTab === 'my' ? 'active' : ''}`}
          onClick={() => setActiveTab('my')}
        >
          My Listings
        </button>
      </div>

      {activeTab === 'my' && (
        <>
          <button 
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="create-button"
          >
            {showCreateForm ? 'Cancel' : 'Create New Listing'}
          </button>

          {showCreateForm && (
            <form onSubmit={handleCreateListing} className="listing-form">
              <input
                type="text"
                placeholder="Title"
                value={newListing.title}
                onChange={(e) => setNewListing({...newListing, title: e.target.value})}
                required
              />
              <textarea
                placeholder="Description"
                value={newListing.description}
                onChange={(e) => setNewListing({...newListing, description: e.target.value})}
                required
              />
              <input
                type="number"
                placeholder="Price"
                value={newListing.price}
                onChange={(e) => setNewListing({...newListing, price: e.target.value})}
                step="0.01"
                required
              />
              <select
                value={newListing.category}
                onChange={(e) => setNewListing({...newListing, category: e.target.value})}
                required
              >
                <option value="">Select Category</option>
                <option value="Books">Books</option>
                <option value="Electronics">Electronics</option>
                <option value="Furniture">Furniture</option>
                <option value="Clothing">Clothing</option>
              </select>
              <select
                value={newListing.condition}
                onChange={(e) => setNewListing({...newListing, condition: e.target.value})}
                required
              >
                <option value="">Select Condition</option>
                <option value="New">New</option>
                <option value="Used">Used</option>
                <option value="Like New">Like New</option>
              </select>
              <button type="submit">Add Listing</button>
            </form>
          )}

          <div className="listings-container">
            {listings.length === 0 ? (
              <p>You haven't created any listings yet.</p>
            ) : (
              listings.map((listing) => (
                <div key={listing.id} className="listing-item">
                  <h3>{listing.title}</h3>
                  <p>{listing.description}</p>
                  <div className="listing-details">
                    <span>Price: ${listing.price}</span>
                    <span>Category: {listing.category}</span>
                    <span>Condition: {listing.condition}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {activeTab === 'all' && <AllListings />}
    </div>
  );
} 