import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";

const AllProposal = () => {
  const [bidders, setBidders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeBidderId, setActiveBidderId] = useState(null);

  useEffect(() => {
    const fetchBiddersWithProposals = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/users-with-proposals/allprop"
        );
        setBidders(response.data.users);
      } catch (err) {
        setError(
          err.response?.data?.error || "An error occurred while fetching data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBiddersWithProposals();
  }, []);

  const toggleBidder = (bidderId) => {
    setActiveBidderId((prevId) => (prevId === bidderId ? null : bidderId));
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-500 text-lg">Loading...</div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-20 text-lg">{error}</div>
    );
  }

  return (
    <div>
      {/* Navbar */}
      <nav className="bg-white shadow sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-gray-800">
            Government Road Contracting System
          </Link>
          <div className="space-x-6">
            <Link
              to="/auction"
              className="text-gray-600 hover:text-blue-600 font-medium transition"
            >
              Home
            </Link>
            <Link to="/proposals" className="text-blue-600 font-semibold">
              All Proposals
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-12">
          📄 All Proposals
        </h1>

        {bidders.length > 0 ? (
          bidders.map((bidder) => (
            <div
              key={bidder._id}
              className="mb-6 bg-blue-50 border border-blue-100 rounded-xl p-6 cursor-pointer hover:bg-blue-100 transition"
              onClick={() => toggleBidder(bidder._id)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {bidder.name}
                  </h2>
                  <p className="text-sm text-gray-600">{bidder.email}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Submitted on{" "}
                    {new Date(bidder.createdAt).toLocaleString("en-US", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="text-blue-500 text-sm font-medium">
                  {activeBidderId === bidder._id
                    ? "Hide Proposals ▲"
                    : "Show Proposals ▼"}
                </div>
              </div>

              {activeBidderId === bidder._id && (
                <div className="mt-6 bg-white rounded-lg shadow p-4">
                  <h3 className="text-lg font-semibold mb-4 text-gray-700">
                    Proposals by {bidder.name}
                  </h3>

                  {bidder.proposals.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {bidder.proposals.map((proposal) => (
                        <div
                          key={proposal._id}
                          className={`relative p-5 rounded-2xl border shadow-sm hover:shadow-md transition-all duration-300 group
        ${
          proposal.prediction === "Feasible"
            ? "bg-green-50 border-green-200"
            : "bg-rose-50 border-rose-200"
        }`}
                        >
                          {/* Filename */}
                          <h4 className="text-lg font-semibold text-gray-800 truncate mb-2">
                            📄 {proposal.filename}
                          </h4>

                          {/* Prediction Tag */}
                          <div
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 border transition-all ${
                              proposal.prediction === "Feasible"
                                ? "text-green-700 bg-green-100 border-green-300"
                                : "text-red-600 bg-red-100 border-red-300"
                            }`}
                          >
                            {proposal.prediction}
                          </div>

                          {/* Explanation */}
                          <div className="text-sm text-gray-700">
                            <p className="font-medium text-gray-600 mb-1">
                              Explanation:
                            </p>
                            <ul className="list-disc pl-5 space-y-1 max-h-32 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                              {proposal.explanation
                                .split(".")
                                .filter((point) => point.trim() !== "")
                                .map((point, idx) => (
                                  <li key={idx}>{point.trim()}.</li>
                                ))}
                            </ul>
                          </div>

                          {/* View Link */}
                          <a
                            href={proposal.file_url || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center mt-4 text-blue-600 hover:underline text-sm font-medium group-hover:text-blue-700"
                          >
                            🔗 View Proposal
                          </a>

                          {/* Background Ring on Hover */}
                          <div className="absolute inset-0 rounded-2xl pointer-events-none ring-1 ring-transparent group-hover:ring-blue-100 transition-all duration-300" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No proposals submitted.</p>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400">No bidders found.</p>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AllProposal;
