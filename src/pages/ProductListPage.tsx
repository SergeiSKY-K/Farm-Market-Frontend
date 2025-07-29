import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useAppSelector } from '../store/hooks';
import { useNavigate } from 'react-router-dom';

type Product = {
    id: string;
    name: string;
    price: number;
    description: string;
    blocked: boolean;
};

const ProductListPage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    const role = useAppSelector(state => state.auth.role);
    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get('/supplier/products')
            .then((res: { data: Product[] }) => setProducts(res.data))
            .catch(() => setError('Error loading products'))
            .finally(() => setLoading(false));
    }, []);

    const handleDelete = async (id: string) => {
        try {
            await axios.delete(`/supplier/products/${id}`);
            setProducts(prev => prev.filter(p => p.id !== id));
        } catch {
            alert('Error while deleting item');
        }
    };

    if (loading) return <p>Loading products...</p>;
    if (role !== 'SUPPLIER') return <div>No access</div>;

    return (
        <div style={{ padding: '2rem' }}>
            <h2>My products</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <ul>
                {products.map(p => (
                    <li key={p.id} style={{ marginBottom: '1rem' }}>
                        <strong>{p.name}</strong> — ${p.price}
                        <br />
                        {p.description}
                        <br />
                        Статус: {p.blocked ? 'Blocked' : 'Active'}
                        <br />
                        <button onClick={() => navigate(`/edit-product/${p.id}`)}>Редактировать</button>
                        <button
                            onClick={() => handleDelete(p.id)}
                            style={{ marginLeft: '1rem', backgroundColor: 'crimson', color: 'white' }}
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProductListPage;