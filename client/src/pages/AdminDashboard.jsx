import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Trash2, Users, Activity } from 'lucide-react';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/users');
            setUsers(res.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch users');
            setLoading(false);
        }
    };

    const handleDeleteUser = async (id) => {
        if (window.confirm('Are you sure you want to delete this user? This will also delete all their transactions.')) {
            try {
                await api.delete(`/users/${id}`);
                setUsers(users.filter(user => user.id !== id));
            } catch (err) {
                alert('Failed to delete user');
            }
        }
    };

    const handleRoleChange = async (id, newRole) => {
        if (window.confirm(`Change this user's role to ${newRole}?`)) {
            try {
                await api.put(`/users/${id}/role`, { role: newRole });
                setUsers(users.map(user => 
                    user.id === id ? { ...user, role: newRole } : user
                ));
            } catch (err) {
                alert('Failed to update role');
            }
        }
    };

    if (loading) return <div className="container p-4">Loading users...</div>;
    if (error) return <div className="container p-4 text-red-500">{error}</div>;

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '2rem' }}>Admin Dashboard</h1>

            <div className="grid" style={{ marginBottom: '2rem' }}>
                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                        <div style={{ padding: '0.75rem', borderRadius: '9999px', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
                            <Users size={24} />
                        </div>
                        <span style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>Total Users</span>
                    </div>
                    <h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>{users.length}</h2>
                </div>
            </div>

            <div className="card">
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>User Management</h2>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                                <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>ID</th>
                                <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Username</th>
                                <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Email</th>
                                <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Role</th>
                                <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '1rem' }}>{user.id}</td>
                                    <td style={{ padding: '1rem' }}>{user.username}</td>
                                    <td style={{ padding: '1rem' }}>{user.email}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <select 
                                            value={user.role} 
                                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                            style={{ 
                                                padding: '0.25rem 0.5rem', 
                                                borderRadius: '4px', 
                                                border: '1px solid var(--border)'
                                            }}
                                        >
                                            <option value="admin">Admin</option>
                                            <option value="user">User</option>
                                            <option value="read-only">Read Only</option>
                                        </select>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        {user.role !== 'admin' && (
                                            <button
                                                onClick={() => handleDeleteUser(user.id)}
                                                className="btn"
                                                style={{ color: '#ef4444', padding: '0.5rem' }}
                                                title="Delete User"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
