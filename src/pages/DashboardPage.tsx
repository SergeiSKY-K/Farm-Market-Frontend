import Navbar from '../components/Navbar';

const DashboardPage = () => {
    return (
        <>
            <Navbar />
            <div
                style={{
                    padding: '3rem',
                    background: '#f0f2f5',
                    minHeight: '100vh',
                    fontFamily: 'Segoe UI, Roboto, sans-serif',
                }}
            >
                <div
                    style={{
                        backgroundColor: '#fff',
                        padding: '2rem',
                        borderRadius: '12px',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                        maxWidth: '800px',
                        margin: '0 auto',
                        textAlign: 'center',
                    }}
                >
                    <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#007bff' }}>
                        Welcome to the Dashboard!
                    </h1>
                    <p style={{ fontSize: '1.1rem', color: '#555' }}>
                        Use the navigation bar to access your features.
                    </p>
                </div>
            </div>
        </>
    );
};

export default DashboardPage;