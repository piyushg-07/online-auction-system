import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchAuctionById } from "../store/auction/auctionSlice";
import Skeleton from "../components/Skeleton";
import axios from "axios";
import { FaSpinner } from "react-icons/fa";
import CountdownTimer from "../components/CountdownTimer";
const VITE_API = import.meta.env.VITE_API;

const Product = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const [bid, setBid] = useState("");
  const [loadingAnimation, setLoadingAnimation] = useState(false);
  const [errorLine, setErrorLine] = useState("");
  const { auctionById, loading, error } = useSelector(
    (state) => state.auctions
  );
  const { user } = useSelector((state) => state.auth);
  const name = localStorage.getItem("name")

  const [isDisabled, setIsDisabled] = useState(false);

  const handleTimeUp = () => {
    setIsDisabled(true);
  };

  const handleBid = async (e) => {

    e.preventDefault();
    setLoadingAnimation(true);
    try {
      setErrorLine("");

      await axios.post(`${VITE_API}/api/auction/${productId}`, {
        bid,
        bidder: user.userId,
      });
      setBid("");

      dispatch(fetchAuctionById(productId));
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingAnimation(false);
    }
  };

  useEffect(() => {
    if (productId) {
      dispatch(fetchAuctionById(productId));
    }
  }, [dispatch, productId]);
  const field = localStorage.getItem("field"); // Retrieve the field value from localStorage


  if (loading)
    return (
      <>
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </>
    );
  if (error)
    return (
      <div>
        <p>Error: {error.message}</p>
      </div>
    );

  return (
    <section className="bg-white py-4 antialiased  md:py-8">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-xl font-semibold text-gray-900  sm:text-2xl">
            {auctionById.itemName || "Product Name"}
          </h2>
          <div className="my-8 xl:mb-10 xl:mt-12 w-3/5 bg-red-200 mx-auto">
            <img className="w-full" src={auctionById.itemPhoto} alt="" />
          </div>
          <div className="mx-auto max-w-2xl space-y-2">
            <p className="text-base font-semibold text-gray-900">
              Project Description:
            </p>
            <p className="text-base font-normal text-gray-500 ">
              {auctionById.itemDescription || "Product Description"}
            </p>

            <div className="mx-auto max-w-2xl space-y-2">
              <p className="text-base font-semibold text-gray-900">Bidding Price:</p>
              <p className="text-base font-normal text-gray-500">
                {auctionById.maxPrice || "Product Price"}
              </p>

              <p className="text-base font-semibold text-gray-900">
              Bidding Start Date:
              </p>
              <p className="text-base font-normal text-gray-500">
                {auctionById.itemStartDate || "Start Date"}
              </p>

              <p className="text-base font-semibold text-gray-900">
              Bidding End Date:
              </p>
              <p className="text-base font-normal text-gray-500">
                {auctionById.itemEndDate || "End Date"}
              </p>

              <p className="text-base font-semibold text-gray-900">
                Time Left:
              </p>
              <div className="text-base font-normal text-red-500">
                <CountdownTimer
                  endDate={auctionById.itemEndDate}
                  onTimeUp={handleTimeUp}
                />
              </div>
            </div>

          </div>
          <div className="mx-auto mb-6 max-w-3xl space-y-6 md:mb-12">
                      {/* Conditionally render the bidding form */}
          {field !== "admin" && (
            <form onSubmit={handleBid}>
              <label
                htmlFor="helper-text"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Your price
              </label>
              <input
                type="number"
                aria-describedby="bid price"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-3"
                placeholder="Enter your price"
                value={bid}
                onChange={(e) => setBid(e.target.value)}
                disabled={isDisabled}
              />
              <button
                type="submit"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-700"
                disabled={loadingAnimation || isDisabled}
              >
                {loadingAnimation ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  "Bid"
                )}
              </button>
              {errorLine && (
                <p className="text-base font-normal text-red-500 ">
                  {errorLine} {auctionById.itemPrice}
                </p>
              )}
            </form>
             )}
            <p className="text-base font-semibold text-gray-900  mt-10">
              Bidder History:
            </p>

            <div className="relative overflow-x-auto">
              {auctionById && auctionById.bids ? (
                <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        Bidder Name
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Price
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Time
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {auctionById.bids.map((bid, index) => (
                      <tr className="bg-white border-b" key={index}>
                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        {bid.bidder?.name || name}
                        </td>
                        <td className="px-6 py-4">{bid.bid}</td>
                        <td className="px-6 py-4">{bid.time.slice(0, 10)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>Loading...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Product;
