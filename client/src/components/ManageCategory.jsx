import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createCategory } from '../slices/categorySlice'; 
import "../styles/ManageCategory.css";

const ManageCategory = () => {
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.categories); 
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const categoryData = { name, description };
    dispatch(createCategory(categoryData)); 
    setName(''); // Clear form inputs
    setDescription('');
  };

  useEffect(() => {
    if (success) {
      setSuccessMessage('Category created successfully!');
      const timer = setTimeout(() => setSuccessMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]); 

  return (
    <div className="manage-category-form-container">
      <h2>Create New Category</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Category Name:</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Category'}
        </button>
        {error && <p className="error-message">{error}</p>}
      </form>

      {successMessage && (
        <p className="success-message">{successMessage}</p>
      )}
    </div>
  );
};

export default ManageCategory;
