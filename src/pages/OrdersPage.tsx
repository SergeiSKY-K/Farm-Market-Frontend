import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useAppSelector } from '../store/hooks';

type Order = {
    id: string;
    buyerEmail: string;
    products: {
        name: string;
        quantity: number;
        price: number;
    }[];
    total: number;
    paid: boolean;
};

const OrdersPage = () => {
    const role = useAppSelector(state => state.auth.role);
    const [orders, setOrders] = useState<Order[]>([]);
    const [error, setError] = useState('');

    useEffect(() => {
        axios
            .get('/moderator/orders')
            .then(res => setOrders(res.data))
            .catch(() => setError('Error loading orders'));
    }, []);

    if (role !== 'MODERATOR') return <div>No access</div>;

    return (
        <div style={{ padding: '2rem' }}>
            <h2>All orders</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {orders.length === 0 && <p>No orders</p>}

            {orders.map(order => (
                <div key={order.id} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
                    <strong>Buyer:</strong> {order.buyerEmail}<br />
                    <strong>Products:</strong>
                    <ul>
                        {order.products.map((p, index) => (
                            <li key={index}>
                                {p.name} — {p.quantity} шт. × ${p.price}
                            </li>
                        ))}
                    </ul>
                    <strong>Total:</strong> ${order.total}<br />
                    <strong>Paid:</strong> {order.paid ? 'Yes' : 'No'}
                </div>
            ))}
        </div>
    );
};

export default OrdersPage;