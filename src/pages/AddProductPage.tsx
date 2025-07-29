import { useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

const AddProductPage = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState<number>(0);
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post('/supplier/products', {
                name,
                price,
                description,
            });
            navigate('/dashboard');
        } catch (err) {
            setError('Error adding product');
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Add Product</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Name:</label><br />
                    <input value={name} onChange={e => setName(e.target.value)} required />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Price:</label><br />
                    <input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} required />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Description:</label><br />
                    <textarea value={description} onChange={e => setDescription(e.target.value)} />
                </div>
                <button type="submit">Add</button>
            </form>
        </div>
    );
};

export default AddProductPage;