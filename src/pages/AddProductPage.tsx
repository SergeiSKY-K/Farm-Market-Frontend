import { useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

const AddProductPage = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState<number>(0);
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', price.toString());
        formData.append('description', description);
        if (image) {
            formData.append('image', image);
        }

        try {
            await axios.post('/supplier/products', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            navigate('/dashboard');
        } catch (err) {
            setError('Error adding product');
        }
    };
    return (
        <div style={{
            maxWidth: 600,
            margin: '3rem auto',
            padding: '2rem',
            background: '#fff',
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
        }}>
            <h2 style={{textAlign: 'center', marginBottom: '1rem'}}>Add New Product</h2>
            {error && <p style={{color: 'red', textAlign: 'center'}}>{error}</p>}

            <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                <input
                    placeholder="Product Name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    style={inputStyle}
                />
                <input
                    type="number"
                    placeholder="Price"
                    value={price}
                    onChange={e => setPrice(Number(e.target.value))}
                    required
                    style={inputStyle}
                />
                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    rows={3}
                    style={{...inputStyle, resize: 'vertical'}}
                />
                <input type="file" accept="image/*" onChange={handleImageChange}/>
                {imagePreview && <img src={imagePreview} alt="Preview" style={{
                    width: '100%',
                    maxHeight: 300,
                    objectFit: 'cover',
                    borderRadius: '8px'
                }}/>}
                <button type="submit" style={buttonStyle}>Add Product</button>
            </form>
        </div>
    );
};

const inputStyle: React.CSSProperties = {
    padding: '0.75rem',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '1rem',
};

const buttonStyle: React.CSSProperties = {
    padding: '0.75rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
};

export default AddProductPage;