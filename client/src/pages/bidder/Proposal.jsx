import React, { useState, useEffect } from "react";
import axios from "axios";
import bgimg from "../../assets/techbg.png";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";

const Proposal = () => {
  const [file, setFile] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const bidderId = localStorage.getItem("bidderId");

  const generateExplanation = (features) => {
    const reasons = [];

    if (features.proposal_cost < 5500000) {
      reasons.push("Proposal cost is acceptable.");
    } else {
      reasons.push("Proposal cost is too high.");
    }

    if (features.road_length <= 10) {
      reasons.push("Road length is too short.");
    } else if (features.road_length >= 20) {
      reasons.push("Road length is too long.");
    } else {
      reasons.push("Road length is appropriate.");
    }

    if (features.material_quality > 5) {
      reasons.push("Material quality is good.");
    } else {
      reasons.push("Material quality is poor.");
    }

    if (features.past_performance > 0.5) {
      reasons.push("Past performance is strong.");
    } else {
      reasons.push("Past performance is weak.");
    }

    if (features.construction_complexity < 8) {
      reasons.push("Construction complexity is low.");
    } else {
      reasons.push("Construction complexity is high.");
    }

    return reasons.map((reason) => `${reason}`).join("\n");
    // return reasons.map((reason) => `• ${reason}`).join("\n");
  };

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        if (!bidderId) {
          console.error("No bidderId found in localStorage.");
          setError("User is not logged in.");
          return;
        }

        const response = await axios.get(
          `http://127.0.0.1:5000/proposals?user_id=${bidderId}`
        );
        setProposals(response.data);
      } catch (err) {
        setError(
          err.response?.data?.error ||
            "An error occurred while fetching proposals."
        );
      }
    };

    fetchProposals();
  }, [bidderId]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("user_id", bidderId);

    try {
      setLoading(true);
      setError("");
      setSuccessMessage("");

      const response = await axios.post(
        "http://127.0.0.1:5000/predict",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const { filename, prediction, features, file_url } = response.data;
      const explanation = generateExplanation(features);

      const newProposal = {
        filename,
        prediction,
        explanation,
        file_url,
      };

      setSuccessMessage({
        prediction,
        explanation,
      });
      setProposals((prev) => [...prev, newProposal]);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "An error occurred while submitting the proposal."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div
        className="min-h-screen bg-cover bg-center relative"
        style={{ backgroundImage: `url(${bgimg})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 z-0"></div>

        <div className="relative z-10 w-full bg-black/70 backdrop-blur-sm text-white px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            Government Road Contracting System
          </h1>
          <nav className="space-x-6">
            <a href="/" className="hover:text-blue-400 transition-colors">
              Home
            </a>
            <a
              href="/proposal"
              className="hover:text-blue-400 transition-colors"
            >
              Proposal
            </a>
          </nav>
        </div>

        <div className="relative z-10 flex h-screen p-6 space-x-6 overflow-hidden">
          {/* Upload Box */}
          <div className="w-full lg:w-1/2 max-w-lg mx-auto bg-black/40 rounded-2xl p-8 text-white backdrop-blur-md shadow-xl flex flex-col justify-start items-center space-y-6">
            {/* Heading at the top of the box */}
            <h1 className="text-4xl font-bold text-center mb-20">
              Submit Proposal
            </h1>

            <form
              onSubmit={handleSubmit}
              className="w-full flex flex-col items-center space-y-4"
            >
              <label className="block text-sm font-medium text-center">
                Upload Proposal (PDF only):
              </label>

              <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 py-2 flex items-center gap-2 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"
                  />
                </svg>
                Choose File
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              {file && (
                <p className="text-sm text-gray-300 text-center break-all max-w-full">
                  📄 {file.name}
                </p>
              )}

              <button
                type="submit"
                className="mt-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Proposal"}
              </button>
            </form>

            {successMessage && (
              <div className="bg-black/40 rounded-xl p-6 shadow-lg mt-4">
                <p className="text-lg font-semibold text-gray-100">
                  <span className="text-blue-400">Prediction:</span>{" "}
                  <span
                    className={`${
                      successMessage.prediction === "Feasible"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {successMessage.prediction}
                  </span>
                </p>

                <div className="mt-4 text-sm text-gray-300">
                  <span className="text-blue-400">Explanation:</span>
                  <ul className="list-inside list-disc space-y-2 pl-4 mt-2">
                    {successMessage.explanation
                      .split("\n")
                      .map((point, index) => (
                        <li key={index} className="text-white">
                          {point}
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            )}

            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}
          </div>

          {/* Proposals Section */}
          <div className="flex-1 bg-black/50 rounded-lg p-6 text-white overflow-y-auto max-h-full">
            <h2 className="text-xl font-bold mb-4">Submitted Proposals</h2>

            {proposals.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {proposals.map((proposal, index) => (
                  <div
                    key={index}
                    className="bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-2xl transition-shadow ease-in-out duration-300 transform hover:scale-105"
                  >
                    <h3 className="text-xl font-semibold text-white mb-4">
                      {proposal.filename}
                    </h3>
                    <iframe
                    className="rounded-lg"
                      src={proposal.file_url}
                      width="100%"
                      height="200px" // Set a fixed height
                      title="Proposal PDF"
                      style={{
                        border: "none", // Removes the border
                        overflow: "hidden", // Prevents scrollbars
                        display: "block", // Ensures the iframe behaves like a block element
                        objectFit: "cover", // Ensures the content fits without overflow
                      }}
                      scrolling="no" // Disables scrolling for the iframe
                    ></iframe>

                    <div className="space-y-2 mt-10">
                      {/* Prediction */}
                      <p className="text-lg font-medium text-gray-300">
                        <span className="text-blue-400">Prediction:</span>{" "}
                        <span
                          className={`${
                            proposal.prediction === "Feasible"
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {proposal.prediction}
                        </span>
                      </p>

                      {/* Explanation */}
                      <p className="text-sm text-gray-200">
                        <span className="font-medium text-blue-400">
                          Explanation:
                        </span>
                        <ul className="list-disc pl-6 mt-2 text-gray-300">
                          {proposal.explanation.split(".").map((point, index) =>
                            point.trim() ? ( // Check if there's any content in the point after trimming
                              <li key={index} className="mb-1">
                                {point.trim()}.
                              </li>
                            ) : null
                          )}
                        </ul>
                      </p>
                    </div>

                    {/* Download Link */}
                    <a
                      href={proposal.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-sm text-blue-400 hover:underline mt-4"
                    >
                      Download PDF
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-300">
                No proposals submitted yet.
              </p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Proposal;
