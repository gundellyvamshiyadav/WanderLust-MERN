import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';

const categories = [
    "Trending", "Rooms", "Iconic cities", "Mountains", "Castles", 
    "Amazing pools", "Camping", "Farms", "Arctic", "Domes", "Boats",
    "Lakes", "Tree city", "Beach", "Wineyards", "Deserts", "Islands",
    "Urban", "Eco-friendly", "Ski", "Historical"
];

const EditListingPage = () => {
    const { id } = useParams();
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
    const [originalImageUrl, setOriginalImageUrl] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [validated, setValidated] = useState(false);

    useEffect(() => {
        const fetchListingData = async () => {
            try {
                const response = await fetch(`/api/listings/${id}`);
                if (!response.ok) {
                    throw new Error('Listing not found or you do not have permission to edit it.');
                }
                const data = await response.json();
                setFormData({
                    title: data.title || '',
                    description: data.description || '',
                    price: data.price || '',
                    location: data.location || '',
                    country: data.country || '',
                    category: data.category || '',
                });
                setOriginalImageUrl(data.image?.url || "");
            } catch (err) {
                addNotification(err.message, 'error');
                navigate('/');
            } finally {
                setIsLoading(false);
            }
        };
        fetchListingData();
    }, [id, navigate, addNotification]);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
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
        Object.keys(formData).forEach(key => {
            submissionData.append(key, formData[key]);
        });
        if (imageFile) {
            submissionData.append("image", imageFile);
        }

        try {
            const response = await fetch(`/api/listings/${id}`, {
                method: 'PUT',
                body: submissionData,
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Failed to update listing.');
            }
            addNotification('Listing Updated Successfully!', 'success');
            navigate(`/listings/${id}`);
        } catch (err) {
            addNotification(err.message, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <div className="d-flex justify-content-center mt-5"><div className="spinner-border" /></div>;
    }

    return (
        <div className="row mt-3">
            <div className="col-lg-8 offset-lg-2">
                <div className="form-card">
                    <h3>Edit Your Listing</h3>
                    <form onSubmit={handleSubmit} className={validated ? 'was-validated' : ''} noValidate>
                        <div className="mb-3">
                            <label htmlFor="title" className="form-label">Title</label>
                            <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} className="form-control" required />
                            <div className="invalid-feedback">Please provide a title.</div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="description" className="form-label">Description</label>
                            <textarea name="description" id="description" className="form-control" onChange={handleChange} required value={formData.description}></textarea>
                            <div className="invalid-feedback">Please enter a description.</div>
                        </div>
                        <div className="mb-3 text-center">
                            <label className="form-label d-block">Original Listing Image</label>
                            {originalImageUrl ? (
                                <img src={originalImageUrl} alt="Original Listing" className="img-fluid rounded" style={{maxHeight: "250px"}}/>
                            ) : (
                                <p>No image available</p>
                            )}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="image" className="form-label">Upload New Image (optional)</label>
                            <input type="file" name="image" id="image" className="form-control" onChange={handleFileChange} />
                        </div>
                        <div className="row">
                            <div className="mb-3 col-md-4">
                                <label htmlFor="price" className="form-label">Price</label>
                                <input type="number" name="price" id="price" value={formData.price} onChange={handleChange} className="form-control" required min="0" />
                                <div className="invalid-feedback">Please enter a valid price.</div>
                            </div>
                            <div className="mb-3 col-md-8">
                                <label htmlFor="location" className="form-label">Location</label>
                                <input type="text" name="location" id="location" value={formData.location} onChange={handleChange} className="form-control" required />
                                <div className="invalid-feedback">Please enter a location.</div>
                            </div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="country" className="form-label">Country</label>
                            <input type="text" name="country" id="country" value={formData.country} onChange={handleChange} className="form-control" required />
                             <div className="invalid-feedback">Please enter a country.</div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="category" className="form-label">Category</label>
                            <select name="category" id="category" className="form-select" value={formData.category} onChange={handleChange} required>
                                <option value="" disabled>Select a category</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                            <div className="invalid-feedback">Please select a category.</div>
                        </div>
                        <button type="submit" className="btn btn-dark edit-btn mt-3 mb-3" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditListingPage;