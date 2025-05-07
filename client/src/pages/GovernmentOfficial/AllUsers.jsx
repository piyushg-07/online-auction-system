import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import { format } from "date-fns";

const AdminAndBidderDashboard = () => {
  const [users, setUsers] = useState([]);
  const [bidders, setBidders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = axios.get("http://localhost:5000/api/admin/users");
    const fetchBidders = axios.get(
      "http://localhost:5000/api/admin/getAllBiddersWithProposals"
    );

    Promise.all([fetchUsers, fetchBidders])
      .then(([usersRes, biddersRes]) => {
        setUsers(usersRes.data);
        setBidders(biddersRes.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <p className="text-center text-gray-500 mt-20 animate-pulse">
        Loading...
      </p>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen ">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10 space-y-14">
        {/* Admin Section */}
        <section className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-2">
            🛡️ Admin Users
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <div
                key={user._id}
                className="group border border-gray-200 rounded-xl p-5 bg-white hover:bg-blue-50 transition duration-300 shadow-sm hover:shadow-md"
              >
                <p className="font-semibold text-gray-800 group-hover:text-blue-600">
                  {user.name}
                </p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            ))}
          </div>
          {users.length === 0 && (
            <p className="text-gray-500 text-sm mt-4">No admin users found.</p>
          )}
        </section>

        {/* Bidders + Proposals Section */}
        <section className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-2">
            👷‍♂️ Bidders & Their Proposals
          </h2>
          <div className="grid gap-8">
            {bidders.map((bidder) => (
              <div
                key={bidder._id}
                className="group border border-gray-200 rounded-2xl p-5 bg-white hover:bg-indigo-50 transition duration-300 shadow-sm hover:shadow-md"
              >
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-800 group-hover:text-indigo-700">
                    {bidder.name}
                  </h3>
                  <p className="text-gray-500">{bidder.email}</p>
                  <p className="text-sm text-gray-400">Field: {bidder.field}</p>
                </div>

                {bidder.proposals.length > 0 ? (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 border-t border-gray-200 pt-4">
                    {bidder.proposals.map((proposal) => (
                      <div
                        key={proposal._id}
                        className="border border-gray-100 rounded-xl p-4 bg-gray-50 hover:bg-white transition duration-200 shadow-sm"
                      >
                        <p className="text-sm text-gray-800">
                          <span className="font-semibold">Prediction:</span>{" "}
                          {proposal.prediction || "N/A"}
                        </p>
                        <p className="text-sm text-gray-700 mt-1">
                          <span className="font-semibold">Explanation:</span>{" "}
                          {proposal.explanation || "N/A"}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm mt-2 italic">
                    No proposals submitted.
                  </p>
                )}
              </div>
            ))}
          </div>
          {bidders.length === 0 && (
            <p className="text-gray-500 text-sm mt-4">No bidders found.</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default AdminAndBidderDashboard;
