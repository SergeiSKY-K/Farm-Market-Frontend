import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';

const EditProductPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [price, setPrice] = useState<number>(0);
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        axios.get(`/supplier/products/${id}`)
            .then(res => {
                setName(res.data.name);
                setPrice(res.data.price);
                setDescription(res.data.description);
            })
            .catch(() => setError('Error loading product'));
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.put(`/supplier/products/${id}`, {
                name, price, description
            });
            navigate('/supplier/products');
        } catch {
            setError('Error during update');
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Edit product</h2>
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
                <button type="submit">Save</button>
            </form>
        </div>
    );
};

export default EditProductPage;
