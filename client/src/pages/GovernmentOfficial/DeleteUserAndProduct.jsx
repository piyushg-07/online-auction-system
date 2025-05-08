import { useState } from "react";
import axios from "axios";

const DeleteUserAndProduct = () => {
  const [userId, setUserId] = useState("");
  const [productId, setProductId] = useState("");
  const [bidderId, setBidderId] = useState("");

  const [userMessage, setUserMessage] = useState("");
  const [productMessage, setProductMessage] = useState("");
  const [bidderMessage, setBidderMessage] = useState("");

  const [loading, setLoading] = useState(false);

  const handleDeleteUser = () => {
    if (!userId) return setUserMessage("Please enter a User ID.");
    setLoading(true);
    axios
      .delete("http://localhost:5000/api/admin/delete-user", {
        data: { userId },
      })
      .then((res) => {
        setUserMessage(res.data.message);
      })
      .catch((err) => {
        setUserMessage(err.response?.data?.error || "Error deleting user");
      })
      .finally(() => setLoading(false));
  };

  const handleDeleteProduct = () => {
    if (!productId) return setProductMessage("Please enter a Product ID.");
    setLoading(true);
    axios
      .delete("http://localhost:5000/api/admin/delete-product", {
        data: { productId },
      })
      .then((res) => {
        setProductMessage(res.data.message);
      })
      .catch((err) => {
        setProductMessage(
          err.response?.data?.error || "Error deleting product"
        );
      })
      .finally(() => setLoading(false));
  };

  const handleDeleteBidder = () => {
    if (!bidderId) return setBidderMessage("Please enter a Bidder ID.");
    setLoading(true);
    axios
      .post("http://localhost:5000/api/admin/delete-bidder", { bidderId })
      .then((res) => {
        setBidderMessage(res.data.message);
      })
      .catch((err) => {
        setBidderMessage(err.response?.data?.error || "Error deleting bidder");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="container mx-auto p-8 bg-white shadow-lg rounded-lg space-y-8">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Admin Delete Actions
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Delete User Card */}
        <div className="p-6 bg-gray-100 rounded-lg shadow-md space-y-4">
          <h3 className="text-2xl font-semibold text-gray-700">Delete User</h3>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
          <button
            onClick={handleDeleteUser}
            className={`w-full py-2 px-4 ${
              loading ? "bg-gray-400" : "bg-red-600 hover:bg-red-700"
            } text-white rounded-md transition duration-300`}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete User"}
          </button>
          {userMessage && (
            <p className="text-center text-gray-600">{userMessage}</p>
          )}
        </div>

        {/* Delete Product Card */}
        <div className="p-6 bg-gray-100 rounded-lg shadow-md space-y-4">
          <h3 className="text-2xl font-semibold text-gray-700">
            Delete Product
          </h3>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Product ID"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
          />
          <button
            onClick={handleDeleteProduct}
            className={`w-full py-2 px-4 ${
              loading ? "bg-gray-400" : "bg-red-600 hover:bg-red-700"
            } text-white rounded-md transition duration-300`}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete Product"}
          </button>
          {productMessage && (
            <p className="text-center text-gray-600">{productMessage}</p>
          )}
        </div>

        {/* Delete Bidder Card */}
        <div className="p-6 bg-gray-100 rounded-lg shadow-md space-y-4">
          <h3 className="text-2xl font-semibold text-gray-700">
            Delete Bidder
          </h3>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Bidder ID"
            value={bidderId}
            onChange={(e) => setBidderId(e.target.value)}
          />
          <button
            onClick={handleDeleteBidder}
            className={`w-full py-2 px-4 ${
              loading ? "bg-gray-400" : "bg-red-600 hover:bg-red-700"
            } text-white rounded-md transition duration-300`}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete Bidder"}
          </button>
          {bidderMessage && (
            <p className="text-center text-gray-600">{bidderMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeleteUserAndProduct;
