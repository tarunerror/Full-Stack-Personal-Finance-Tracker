import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Spinner from '../components/Spinner';

const Transactions = () => {
    const { user } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formData, setFormData] = useState({
        date: '',
        description: '',
        category: 'Food',
        amount: '',
        type: 'expense'
    });
    const [editingTransaction, setEditingTransaction] = useState(null);

    const fetchTransactions = useCallback(async () => {
        try {
            const res = await api.get('/transactions?limit=100'); // Fetching last 100 for simplicity
            setTransactions(res.data.transactions);
        } catch (error) {
            console.error('Failed to fetch transactions', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    const filteredTransactions = useMemo(() => {
        return transactions.filter(t => {
            const matchesFilter = filter === 'all' || t.type === filter;
            const matchesSearch = t.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                t.category?.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesFilter && matchesSearch;
        });
    }, [transactions, filter, searchTerm]);

    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/transactions', {
                ...formData,
                amount: parseFloat(formData.amount)
            });
            setTransactions(prev => [res.data, ...prev]);
            setIsFormOpen(false);
            setFormData({ date: '', description: '', category: 'Food', amount: '', type: 'expense' });
        } catch (error) {
            console.error('Failed to add transaction', error);
            alert('Failed to add transaction');
        }
    }, [formData]);

    const handleUpdate = useCallback(async (e) => {
        e.preventDefault();
        try {
            const res = await api.put(`/transactions/${editingTransaction.id}`, {
                ...formData,
                amount: parseFloat(formData.amount)
            });
            setTransactions(prev => prev.map(t => 
                t.id === editingTransaction.id ? res.data : t
            ));
            setIsFormOpen(false);
            setEditingTransaction(null);
            setFormData({ date: '', description: '', category: 'Food', amount: '', type: 'expense' });
        } catch (error) {
            console.error('Failed to update transaction', error);
            alert('Failed to update transaction');
        }
    }, [formData, editingTransaction]);

    const handleDelete = useCallback(async (id) => {
        if (window.confirm('Are you sure you want to delete this transaction?')) {
            try {
                await api.delete(`/transactions/${id}`);
                setTransactions(prev => prev.filter(t => t.id !== id));
            } catch (error) {
                console.error('Failed to delete transaction', error);
                alert('Failed to delete transaction');
            }
        }
    }, []);

    const handleEdit = (transaction) => {
        setEditingTransaction(transaction);
        setIsFormOpen(true);
        setFormData({
            date: transaction.date,
            description: transaction.description,
            category: transaction.category,
            amount: transaction.amount,
            type: transaction.type
        });
    };

    const canEdit = user?.role === 'admin' || user?.role === 'user';

    if (loading) return <Spinner />;

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <header style={{ marginBottom: '2rem' }}>
                <Link to="/" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>← Back to Dashboard</Link>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>Transactions</h1>
                    {canEdit && (
                        <button
                            className="btn btn-primary"
                            onClick={() => setIsFormOpen(!isFormOpen)}
                        >
                            {isFormOpen ? 'Cancel' : 'Add Transaction'}
                        </button>
                    )}
                </div>
            </header>

            {isFormOpen && (
                <div className="card" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: '600' }}>{editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}</h3>
                    <form onSubmit={editingTransaction ? handleUpdate : handleSubmit} style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Date</label>
                            <input type="date" name="date" className="input" value={formData.date} onChange={handleInputChange} required />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Description</label>
                            <input type="text" name="description" className="input" value={formData.description} onChange={handleInputChange} required />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Category</label>
                            <select name="category" className="input" value={formData.category} onChange={handleInputChange}>
                                <option>Food</option>
                                <option>Transport</option>
                                <option>Entertainment</option>
                                <option>Utilities</option>
                                <option>Income</option>
                                <option>Other</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Amount</label>
                            <input type="number" name="amount" className="input" value={formData.amount} onChange={handleInputChange} required min="0" step="0.01" />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Type</label>
                            <select name="type" className="input" value={formData.type} onChange={handleInputChange}>
                                <option value="expense">Expense</option>
                                <option value="income">Income</option>
                            </select>
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <button type="submit" className="btn btn-primary">{editingTransaction ? 'Update Transaction' : 'Save Transaction'}</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                    <input
                        type="text"
                        placeholder="Search transactions..."
                        className="input"
                        style={{ maxWidth: '300px' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select
                        className="input"
                        style={{ maxWidth: '150px' }}
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="all">All Types</option>
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </select>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                        width: '100%',
                        borderCollapse: 'collapse',
                        minWidth: '600px'
                    }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Date</th>
                                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Description</th>
                                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Category</th>
                                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Type</th>
                                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: '500', textAlign: 'right' }}>Amount</th>
                                {canEdit && <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: '500', textAlign: 'right' }}>Actions</th>}
                            </tr>
                        </thead>
                        <tbody style={{ flex: 1, overflowY: 'auto' }}>
                            {filteredTransactions.map(t => (
                                <tr key={t.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background-color 0.2s' }} className="table-row-hover">
                                    <td style={{ padding: '1rem' }}>{t.date}</td>
                                    <td style={{ padding: '1rem' }}>{t.description}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '0.25rem 0.5rem',
                                            borderRadius: '9999px',
                                            backgroundColor: 'var(--background)',
                                            fontSize: '0.75rem',
                                            border: '1px solid var(--border)'
                                        }}>
                                            {t.category}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem', textTransform: 'capitalize' }}>{t.type}</td>
                                    <td style={{ padding: '1rem', textAlign: 'right', fontWeight: '600', color: t.type === 'income' ? 'var(--success)' : 'var(--danger)' }}>
                                        {t.type === 'income' ? '+' : '-'}${parseFloat(t.amount).toFixed(2)}
                                    </td>
                                    {canEdit && (
                                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                                            <button
                                                onClick={() => handleEdit(t)}
                                                style={{ marginRight: '0.5rem', color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style={{ marginRight: '4px' }}>
                                                  <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                                                </svg>
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(t.id)}
                                                style={{ color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style={{ marginRight: '4px' }}>
                                                  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                                  <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                                                </svg>
                                                Delete
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                            {filteredTransactions.length === 0 && (
                                <tr>
                                    <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="var(--text-tertiary)" viewBox="0 0 16 16">
                                                <path d="M14 3a.702.702 0 0 1-.037.225l-1.684 10.104A2 2 0 0 1 10.305 15H5.694a2 2 0 0 1-1.973-1.671L2.037 3.225A.703.703 0 0 1 2 3c0-1.105 2.686-2 6-2s6 .895 6 2zM3.215 4.207l1.493 8.957a1 1 0 0 0 .986.836h4.612a1 1 0 0 0 .986-.836l1.493-8.957C11.69 4.689 9.954 5 8 5c-1.954 0-3.69-.311-4.785-.793z"/>
                                            </svg>
                                            <p style={{ fontSize: '1rem', margin: 0 }}>No transactions found</p>
                                            <p style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)', margin: 0 }}>Try changing your filters</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Transactions;
