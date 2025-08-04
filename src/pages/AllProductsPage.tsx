import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useAppSelector } from '../store/hooks';

type Product = {
    id: string;
    name: string;
    price: number;
    description: string;
    blocked: boolean;
};

const AllProductsPage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [error, setError] = useState('');
    const roles = useAppSelector(state => state.auth.roles);

    const fetchProducts = async () => {
        try {
            const res = await axios.get('/moderator/products');
            setProducts(res.data);
        } catch {
            setError('Error loading products');
        }
    };

    const toggleBlock = async (id: string, block: boolean) => {
        try {
            await axios.patch(`/moderator/products/${id}/${block ? 'block' : 'unblock'}`);
            await fetchProducts();
        } catch {
            alert('Error while locking/unlocking');
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    if (!roles.includes('MODERATOR')) return <div>No access</div>;

    return (
        <div style={{ padding: '2rem' }}>
            <h2>All products</h2>
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
                        <button onClick={() => toggleBlock(p.id, !p.blocked)}>
                            {p.blocked ? 'Unblock' : 'Block'}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AllProductsPage;