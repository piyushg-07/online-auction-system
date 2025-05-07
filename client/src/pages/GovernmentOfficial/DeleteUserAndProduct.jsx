import { useState } from 'react';
import axios from 'axios';

const DeleteUserAndProduct = () => {
    const [userId, setUserId] = useState('');
    const [productId, setProductId] = useState('');
    const [userMessage, setUserMessage] = useState('');
    const [productMessage, setProductMessage] = useState('');

    const handleDeleteUser = () => {
        axios.post('/api/admin/delete-user', { userId })
            .then(res => setUserMessage(res.data.message))
            .catch(err => setUserMessage(err.response?.data?.error || "Error deleting user"));
    };

    const handleDeleteProduct = () => {
        axios.post('/api/admin/delete-product', { productId })
            .then(res => setProductMessage(res.data.message))
            .catch(err => setProductMessage(err.response?.data?.error || "Error deleting product"));
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Admin Delete Actions</h2>

            <div style={{ marginBottom: '2rem' }}>
                <h3>Delete User</h3>
                <input
                    type="text"
                    placeholder="Enter User ID"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                />
                <button onClick={handleDeleteUser}>Delete User</button>
                {userMessage && <p>{userMessage}</p>}
            </div>

            <div>
                <h3>Delete Product</h3>
                <input
                    type="text"
                    placeholder="Enter Product ID"
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                />
                <button onClick={handleDeleteProduct}>Delete Product</button>
                {productMessage && <p>{productMessage}</p>}
            </div>
        </div>
    );
};

export default DeleteUserAndProduct;
