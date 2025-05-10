import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";

const BidderProfile = () => {
  const [bidder, setBidder] = useState(null);
  const [formData, setFormData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    console.log("useEffect triggered, fetching bidder profile...");

    if (!token) {
      console.error("No token found in localStorage.");
      setLoading(false);
      return;
    }

    fetch("http://localhost:5000/api/bidder/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        console.log("Response received:", res);
        if (!res.ok) {
          throw new Error(
            `Failed to fetch bidder profile. Status: ${res.status}`
          );
        }
        return res.json();
      })
      .then((data) => {
        console.log("Data fetched:", data);
        if (data.bidder) {
          console.log("Bidder data:", data.bidder);
          setBidder(data.bidder);
          setFormData(data.bidder);
        } else {
          throw new Error("No bidder data received.");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch profile error:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Handling change for field ${name}:`, value);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    console.log("Saving profile with data:", formData);

    fetch("http://localhost:5000/api/bidder/updateprofile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        console.log("Response from save:", res);
        if (!res.ok) {
          throw new Error(
            `Failed to save bidder profile. Status: ${res.status}`
          );
        }
        return res.json();
      })
      .then((data) => {
        console.log("Save response data:", data);
        if (data.bidder) {
          console.log("Updated bidder data:", data.bidder);
          setBidder(data.bidder);
          setFormData(data.bidder);
          setEditMode(false);
        } else {
          throw new Error("No updated bidder data received.");
        }
      })
      .catch((err) => {
        console.error("Update profile error:", err);
        setError(err.message);
      });
  };

  if (loading) {
    console.log("Loading data...");
    return <p className="text-center mt-10">Loading...</p>;
  }

  if (error) {
    return (
      <div className="text-center mt-10">
        <p className="text-red-600">{`Error: ${error}`}</p>
      </div>
    );
  }

  console.log("Rendering profile with bidder data:", bidder);

  return (
    <div>
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow rounded-lg space-y-6">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:underline text-sm mb-4"
        >
          ← Back
        </button>

        {/* Profile Image */}
        <div className="flex justify-center">
          <img
            src="https://cdn.pixabay.com/photo/2015/03/04/22/35/head-659652_1280.png"
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border border-gray-300"
          />
        </div>

        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Bidder Profile</h2>
          <button
            onClick={() => {
              console.log("Toggling edit mode...");
              setEditMode(!editMode);
            }}
            className="text-sm text-blue-600 hover:underline"
          >
            {editMode ? "Cancel" : "Edit"}
          </button>
        </div>

        {["name", "phone", "address", "location", "city", "state"].map(
          (field) => (
            <div key={field}>
              <label className="block text-gray-600 capitalize">{field}</label>
              {editMode ? (
                <input
                  type="text"
                  name={field}
                  value={formData[field] || ""}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              ) : (
                <p className="mt-1 text-gray-900">{bidder[field] || "—"}</p>
              )}
            </div>
          )
        )}

        {editMode && (
          <div className="pt-4">
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>

      <div className="mt-6 w-full">
        <Footer />
      </div>
    </div>
  );
};

export default BidderProfile;
