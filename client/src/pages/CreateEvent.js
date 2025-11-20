import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './ManageEvent.css';

const CreateEvent = () => {
    const navigate = useNavigate();
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        venue: '',
        image: '',
        maxCapacity: 200
    });

    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await axios.post(`${API_URL}/events`, formData, { withCredentials: true });
            toast.success('Event created');
            navigate(`/events/${res.data.event._id}/manage`);
        } catch (error) {
            console.error('Create error:', error);
            const msg = error.response?.data?.error || 'Failed to create event';
            toast.error(msg);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="manage-event-page">
            <div className="container">
                <div className="manage-event-container">
                    <div className="page-header">
                        <h1 className="page-title">Create Event</h1>
                    </div>

                    <form onSubmit={handleSubmit} className="manage-event-form">
                        <div className="form-group">
                            <label htmlFor="title">Event Title *</label>
                            <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="description">Description *</label>
                            <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows="6" required />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="date">Date *</label>
                                <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} required />
                            </div>

                            <div className="form-group">
                                <label htmlFor="time">Time *</label>
                                <input type="text" id="time" name="time" value={formData.time} onChange={handleChange} required />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="venue">Venue *</label>
                            <input type="text" id="venue" name="venue" value={formData.venue} onChange={handleChange} required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="image">Image URL (Cloudinary) *</label>
                            <input type="url" id="image" name="image" value={formData.image} onChange={handleChange} required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="maxCapacity">Maximum Capacity *</label>
                            <input type="number" id="maxCapacity" name="maxCapacity" value={formData.maxCapacity} onChange={handleChange} min="1" required />
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Creating...' : 'Create Event'}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateEvent;
