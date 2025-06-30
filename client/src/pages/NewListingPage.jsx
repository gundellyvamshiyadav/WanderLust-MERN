import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';

const categories = [
    "Trending", "Rooms", "Iconic cities", "Mountains", "Castles", 
    "Amazing pools", "Camping", "Farms", "Arctic", "Domes", "Boats",
    "Lakes", "Tree city", "Beach", "Wineyards", "Deserts", "Islands",
    "Urban", "Eco-friendly", "Ski", "Historical"
];

const NewListingPage = () => {
    const navigate = useNavigate();
    const { addNotification } = useNotification();
    
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        location: "",
        country: "",
        category: "",
    });
    const [imageFile, setImageFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [validated, setValidated] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        const form = e.currentTarget;
        e.preventDefault();

        if (form.checkValidity() === false) {
            e.stopPropagation();
            setValidated(true);
            return;
        }

        setIsSubmitting(true);
        const submissionData = new FormData();
        submissionData.append("title", formData.title);
        submissionData.append("description", formData.description);
        submissionData.append("price", formData.price);
        submissionData.append("location", formData.location);
        submissionData.append("country", formData.country);
        submissionData.append("category", formData.category);
        if (imageFile) {
            submissionData.append("image", imageFile);
        }

        try {
            const response = await fetch('/api/listings', {
                method: 'POST',
                body: submissionData,
            });
            const result = await response.json();
            if (!response.ok) {
                if (response.status === 400 && result.message) {
                    addNotification(result.message, 'error');
                }
                throw new Error(result.message || 'Failed to create listing.');
            }
            addNotification('Listing Created Successfully!', 'success');
            navigate(`/listings/${result._id}`);
        } catch (err) {
            addNotification(err.message, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="row mt-3">
            <div className="col-lg-8 offset-lg-2">
                <div className="form-card">
                    <h3>Create a New Listing</h3>
                    <form onSubmit={handleSubmit} className={validated ? 'was-validated' : ''} noValidate>
                        <div className="mb-3">
                            <label htmlFor="title" className="form-label">Title</label>
                            <input 
                                type="text" 
                                name="title" 
                                id="title" 
                                className="form-control" 
                                placeholder="Add a catchy title" 
                                value={formData.title}
                                onChange={handleChange}
                                required 
                            />
                            <div className="valid-feedback">Looks good!</div>
                            <div className="invalid-feedback">Please provide a title.</div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="description" className="form-label">Description</label>
                            <textarea 
                                name="description" 
                                id="description" 
                                className="form-control" 
                                value={formData.description}
                                onChange={handleChange}
                                required
                            ></textarea>
                            <div className="invalid-feedback">Please enter a description.</div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="image" className="form-label">Upload Image</label>
                            <input 
                                type="file" 
                                name="image" 
                                id="image" 
                                className="form-control"
                                onChange={handleFileChange}
                                required
                            />
                            <div className="invalid-feedback">An image is required.</div>
                        </div>
                        <div className="row">
                            <div className="mb-3 col-md-4">
                                <label htmlFor="price" className="form-label">Price</label>
                                <input 
                                    type="number" 
                                    name="price" 
                                    id="price" 
                                    className="form-control" 
                                    placeholder="1200" 
                                    value={formData.price}
                                    onChange={handleChange}
                                    required 
                                    min="0"
                                />
                                <div className="invalid-feedback">Please enter a valid price.</div>
                            </div>
                            <div className="mb-3 col-md-8">
                                <label htmlFor="location" className="form-label">Location</label>
                                <input 
                                    type="text" 
                                    name="location" 
                                    id="location" 
                                    className="form-control" 
                                    placeholder="Hyderabad, Telangana" 
                                    value={formData.location}
                                    onChange={handleChange}
                                    required 
                                />
                                <div className="invalid-feedback">Please enter a location.</div>
                            </div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="country" className="form-label">Country</label>
                            <input 
                                type="text" 
                                name="country" 
                                id="country" 
                                className="form-control" 
                                placeholder="India" 
                                value={formData.country}
                                onChange={handleChange}
                                required 
                            />
                            <div className="invalid-feedback">Please enter a country.</div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="category" className="form-label">Category</label>
                            <select 
                                name="category" 
                                id="category" 
                                className="form-select" 
                                value={formData.category}
                                onChange={handleChange}
                                required
                            >
                                <option value="" disabled>Select a category</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                            <div className="invalid-feedback">Please select a category.</div>
                        </div>
                        <button type="submit" className="btn btn-dark add-btn mt-3 mb-3" disabled={isSubmitting}>
                            {isSubmitting ? 'Adding...' : 'Add'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default NewListingPage;