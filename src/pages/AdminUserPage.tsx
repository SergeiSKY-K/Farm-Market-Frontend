import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useAppSelector } from '../store/hooks';

type User = {
    id: string;
    email: string;
    role: 'USER' | 'SUPPLIER' | 'MODERATOR' | 'ADMIN';
};

const AdminUsersPage = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [error, setError] = useState('');
    const roles = useAppSelector(state => state.auth.roles);

    const fetchUsers = async () => {
        try {
            const res = await axios.get('/admin/users');
            setUsers(res.data);
        } catch {
            setError('Error loading users');
        }
    };

    const toggleModerator = async (id: string, makeMod: boolean) => {
        try {
            await axios.patch(`/admin/users/${id}/${makeMod ? 'set-moderator' : 'unset-moderator'}`);
            await fetchUsers();
        } catch {
            alert('Error changing role');
        }
    };

    const deleteUser = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete the user?')) return;
        try {
            await axios.delete(`/admin/users/${id}`);
            await fetchUsers();
        } catch {
            alert('Error deleting user');
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    if (!roles.includes('ADMIN')) return <div>No access</div>;

    return (
        <div style={{ padding: '2rem' }}>
            <h2>User Management</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <ul>
                {users.map(u => (
                    <li key={u.id} style={{ marginBottom: '1rem' }}>
                        <strong>{u.email}</strong> — роль: {u.role}
                        {u.role !== 'ADMIN' && (
                            <>
                                <br />
                                <button onClick={() => toggleModerator(u.id, u.role !== 'MODERATOR')}>
                                    {u.role === 'MODERATOR' ? 'Remove moderator' : 'Appoint as moderator'}
                                </button>
                                <button
                                    onClick={() => deleteUser(u.id)}
                                    style={{ marginLeft: '1rem', color: 'white', background: 'crimson' }}
                                >
                                    Delete
                                </button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminUsersPage;