import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
    const navigate = useNavigate();

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const res = await axios.get(`${API_URL}/events`);
            setEvents(res.data);
        } catch (error) {
            console.error('Error fetching events:', error);
            toast.error('Failed to load events');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this event permanently?')) return;

        setDeletingId(id);
        try {
            await axios.delete(`${API_URL}/events/${id}`, { withCredentials: true });
            toast.success('Event deleted');
            setEvents(events.filter(e => e._id !== id));
        } catch (error) {
            console.error('Delete error:', error);
            const msg = error.response?.data?.error || 'Failed to delete event';
            toast.error(msg);
        } finally {
            setDeletingId(null);
        }
    };

    if (loading) return <div className="loading"><div className="spinner"></div></div>;

    return (
        <div className="admin-dashboard container">
            <div className="dashboard-header">
                <h1>Admin Dashboard</h1>
                <div>
                    <Link to="/events/new" className="btn btn-primary">+ Create Event</Link>
                </div>
            </div>

            {events.length === 0 ? (
                <p>No events found.</p>
            ) : (
                <div className="events-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Date</th>
                                <th>Venue</th>
                                <th>Registered</th>
                                <th>Capacity</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.map(ev => (
                                <tr key={ev._id}>
                                    <td>{ev.title}</td>
                                    <td>{new Date(ev.date).toLocaleDateString()}</td>
                                    <td>{ev.venue}</td>
                                    <td>{ev.registeredStudents?.length || 0}</td>
                                    <td>{ev.maxCapacity}</td>
                                    <td>
                                        <button className="btn btn-secondary" onClick={() => navigate(`/events/${ev._id}/manage`)}>Edit</button>
                                        <button className="btn btn-danger" onClick={() => handleDelete(ev._id)} disabled={deletingId === ev._id} style={{ marginLeft: 8 }}>
                                            {deletingId === ev._id ? 'Deleting...' : 'Delete'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
