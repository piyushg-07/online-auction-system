// import { Flex, Button, Drawer, Typography } from "antd";
// import Footer from "../components/Footer";
// import { MenuOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import img from "../assets/auction2.jpg";
import img2 from "../assets/auction.webp";
import yet from "../assets/yat.jpeg";
import piyu from "../assets/piyu.jpeg";
import shrey from "../assets/shrey.jpeg";

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // const [visible, setVisible] = useState(false);
  // const showDrawer = () => {
  //   setVisible(!visible);
  // };

  // const navMenu = [
  //   {
  //     title: "Home",
  // url: "#",
  //   },
  //   {
  //     title: "Features",
  //     url: "#",
  //   },
  //   {
  //     title: "Auction",
  //     url: "#",
  //   },
  //   {
  //     title: "Contact",
  //     url: "#",
  //   },
  // ];

  useEffect(() => {
    if (user) {
      navigate("/auction");
    }
  }, [user, navigate]);

  return (
    // <>
    //   {/* Navbar section */}
    //   <nav className="border-b border sticky top-0 bg-white z-50 md:px-10 px-4">
    //     <Flex
    //       align="center"
    //       justify="space-between"
    //       style={{ padding: "0.6rem 0.5rem" }}
    //     >
    //       <Typography.Title
    //         level={3}
    //         style={{
    //           color: "#4B4453",
    //         }}
    //       >
    //         Kipa Auction
    //       </Typography.Title>

    //       <Flex
    //         align="center"
    //         justify="space-between"
    //         className="hidden md:flex"
    //       >
    //         {navMenu.map((menu, index) => (
    //           <Button key={index} type="text" size="large">
    //             {menu.title}
    //           </Button>
    //         ))}
    //       </Flex>
    //       <Flex
    //         align="center"
    //         justify="space-between"
    //         className="hidden md:flex gap-4"
    //       >
    //         <Button onClick={() => navigate("/login")}>Login</Button>
    //         <Button type="primary" onClick={() => navigate("/signup")}>
    //           Sign up
    //         </Button>
    //       </Flex>
    //       <Typography.Text className="text-gray-900 md:hidden">
    //         <Button type="default" onClick={showDrawer}>
    //           <MenuOutlined />
    //         </Button>
    //       </Typography.Text>
    //       <Drawer
    //         title="Kipa Auction"
    //         placement="right"
    //         closable={false}
    //         onClose={showDrawer}
    //         open={visible}
    //         footer={
    //           <Button onClick={showDrawer} type="primary">
    //             Close
    //           </Button>
    //         }
    //       >
    //         {navMenu.map((menu, index) => (
    //           <Button
    //             key={index}
    //             type="text"
    //             size="large"
    //             block
    //             onClick={() => setVisible(false)}
    //           >
    //             {menu.title}
    //           </Button>
    //         ))}
    //       </Drawer>
    //     </Flex>
    //   </nav>

    //   {/* Hero Section */}

    //   <div className="container px-6 py-6 mx-auto lg:px-12 min-h-[calc(100svh-4.1rem)]">
    //     <div className="items-center lg:flex">
    //       <div className="w-full lg:w-1/2">
    //         <div className="lg:max-w-lg">
    //           <h1 className="text-3xl font-semibold text-gray-800 lg:text-4xl">
    //             Bid Smart, Win Big: <br />
    //             Your Gateway to <br />
    //             <span className="text-blue-500 ">Online Auctions</span>
    //           </h1>

    //           <p className="mt-3 text-gray-600 dark:text-gray-400">
    //             Discover a new era of online auctions with our cutting-edge
    //             platform designed to bring buyers and sellers together in a
    //             seamless, secure, and engaging environment. Whether you are
    //             looking to find great deals or sell unique items, our system
    //             provides real-time bidding, transparent transactions, and a wide
    //             array of categories to explore. Join our community today and
    //             experience the excitement of winning big in the world of online
    //             auctions!
    //           </p>

    //           <button
    //             className="px-3 py-2 mt-6 text-sm tracking-wider text-white uppercase transition-colors duration-300 transform bg-blue-600 rounded-lg lg:w-auto hover:bg-blue-500 focus:outline-none focus:bg-blue-500 mr-4"
    //             onClick={() => navigate("/signup")}
    //           >
    //             Signup
    //           </button>
    //           <Button size="large" onClick={() => navigate("/login")}>
    //             Login
    //           </Button>
    //         </div>
    //       </div>

    //       <div className="flex items-center justify-center w-full mt-6 lg:mt-0 lg:w-1/2">
    //         <img
    //           className="w-full h-full lg:max-w-3xl"
    //           src="https://merakiui.com/images/components/Catalogue-pana.svg"
    //           alt="Catalogue"
    //         />
    //       </div>
    //     </div>
    //   </div>

    //   {/* Footer */}
    //   <Footer />
    // </>
    <div>
      <header className="text-gray-700 body-font border-b border-gray-200">
        <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
          <a className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
            <span className="ml-3 text-xl">
              Government Road Contracting System
            </span>
          </a>
          <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
            <a
              className="mr-5  border-2 p-2 rounded-lg hover:bg-indigo-600 hover:text-white"
              href="/adminlogin"
            >
              Government Officials
            </a>
            <a
              className="mr-5  border-2 p-2 rounded-lg hover:bg-indigo-600 hover:text-white"
              href="/bidderlogin"
            >
              Bidder Panel
            </a>
          </nav>
          <button className="inline-flex items-center bg-gray-200 border-0 py-1 px-3 focus:outline-none hover:bg-gray-300 rounded text-base mt-4 md:mt-0">
            <a href="/login">Login</a>
            <svg
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="w-4 h-4 ml-1"
              viewBox="0 0 24 24"
            >
              <path d="M5 12h14M12 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>
      </header>
      <section className="text-gray-700 body-font">
        <div className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
          <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
            <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">
              Bid Smart, Win Big:
              <br className="hidden lg:inline-block" />
              Your Gateway to Online Bidding
            </h1>
            <p className="mb-8 leading-relaxed">
              {" "}
              Welcome to the Government Road Contract Bidding System, a platform
              designed to ensure transparency, fairness, and efficiency in the
              bidding process. This system empowers government officials to post
              contracts, bidders to submit competitive bids, and administrators
              to oversee the entire process with accountability. Join us in
              building a transparent and trustworthy infrastructure for public
              projects.
            </p>
            <div className="flex justify-center">
              <button
                className="inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg"
                onClick={() => navigate("/signup")}
              >
                Signup
              </button>
              <button
                className="ml-4 inline-flex text-gray-700 bg-gray-200 border-0 py-2 px-6 focus:outline-none hover:bg-gray-300 rounded text-lg"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
            </div>
          </div>
          <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
            <img
              className="object-cover object-center rounded"
              alt="hero"
              src={img}
            />
          </div>
        </div>
      </section>
      <section className="text-gray-700 body-font border-t border-gray-200">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-col text-center w-full mb-20">
            <h2 className="text-xs text-indigo-500 tracking-widest font-medium title-font mb-1">
              CORE FEATURES
            </h2>
            <h1 className="sm:text-3xl text-2xl font-medium title-font text-gray-900">
              Why Choose Our Blockchain Bidding Platform?
            </h1>
          </div>
          <div className="flex flex-wrap -m-4">
            {/* Feature Card 1 */}
            <div className="p-4 md:w-1/3">
              <div className="flex rounded-lg h-full bg-gray-100 p-8 flex-col">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 mr-3 inline-flex items-center justify-center rounded-full bg-indigo-500 text-white flex-shrink-0">
                    <svg
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                    >
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                    </svg>
                  </div>
                  <h2 className="text-gray-900 text-lg title-font font-medium">
                    Immutable Ledger
                  </h2>
                </div>
                <div className="flex-grow">
                  <p className="leading-relaxed text-base">
                    Every bid is securely stored on the blockchain, providing an
                    unalterable history of transactions for full accountability.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature Card 2 */}
            <div className="p-4 md:w-1/3">
              <div className="flex rounded-lg h-full bg-gray-100 p-8 flex-col">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 mr-3 inline-flex items-center justify-center rounded-full bg-indigo-500 text-white flex-shrink-0">
                    <svg
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                  <h2 className="text-gray-900 text-lg title-font font-medium">
                    Identity Protection
                  </h2>
                </div>
                <div className="flex-grow">
                  <p className="leading-relaxed text-base">
                    Bidders remain anonymous while their credentials are
                    verified using secure, decentralized identity protocols.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature Card 3 */}
            <div className="p-4 md:w-1/3">
              <div className="flex rounded-lg h-full bg-gray-100 p-8 flex-col">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 mr-3 inline-flex items-center justify-center rounded-full bg-indigo-500 text-white flex-shrink-0">
                    <svg
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="6" cy="6" r="3"></circle>
                      <circle cx="6" cy="18" r="3"></circle>
                      <path d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12"></path>
                    </svg>
                  </div>
                  <h2 className="text-gray-900 text-lg title-font font-medium">
                    Real-Time Monitoring
                  </h2>
                </div>
                <div className="flex-grow">
                  <p className="leading-relaxed text-base">
                    Admins and users can track bidding activity in real-time
                    with dashboards powered by smart contracts and event
                    triggers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="text-gray-700 body-font border-t border-gray-200">
        <div className="container px-5 py-24 mx-auto flex flex-wrap">
          <div className="lg:w-1/2 w-full mb-10 lg:mb-0 rounded-lg overflow-hidden">
            <img
              alt="Secure Bidding"
              className="object-cover object-center h-full w-full"
              src={img2} // Replace this with a relevant blockchain or auction-themed image
            />
          </div>
          <div className="flex flex-col flex-wrap lg:py-6 -mb-10 lg:w-1/2 lg:pl-12 lg:text-left text-center">
            {/* Feature 1 */}
            <div className="flex flex-col mb-10 lg:items-start items-center">
              <div className="w-12 h-12 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-5">
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                >
                  <path d="M3 12l2-2 4 4 8-8 2 2-10 10L3 12z" />
                </svg>
              </div>
              <div className="flex-grow">
                <h2 className="text-gray-900 text-lg title-font font-medium mb-3">
                  Transparent Bidding
                </h2>
                <p className="leading-relaxed text-base">
                  All bids are recorded on a blockchain ledger, ensuring full
                  transparency and preventing tampering or manipulation.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col mb-10 lg:items-start items-center">
              <div className="w-12 h-12 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-5">
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                >
                  <path d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
                </svg>
              </div>
              <div className="flex-grow">
                <h2 className="text-gray-900 text-lg title-font font-medium mb-3">
                  Secure Smart Contracts
                </h2>
                <p className="leading-relaxed text-base">
                  Bidding processes are automated using smart contracts,
                  ensuring fairness and enforcing rules without third-party
                  interference.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col mb-10 lg:items-start items-center">
              <div className="w-12 h-12 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-5">
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="flex-grow">
                <h2 className="text-gray-900 text-lg title-font font-medium mb-3">
                  Decentralized Trust
                </h2>
                <p className="leading-relaxed text-base">
                  Eliminate the need for a central authority by relying on
                  decentralized consensus to validate and secure all auction
                  transactions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="text-gray-700 body-font border-t border-gray-200">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-wrap w-full mb-20 flex-col items-center text-center">
            <h1 className="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-900">
              Empowering Bidding with Blockchain
            </h1>
            <p className="lg:w-1/2 w-full leading-relaxed text-base">
              A decentralized, secure, and transparent bidding platform that
              redefines trust and fairness in digital auctions.
            </p>
          </div>

          <div className="flex flex-wrap -m-4">
            {/* Feature 1 */}
            <div className="xl:w-1/3 md:w-1/2 p-4">
              <div className="border border-gray-300 p-6 rounded-lg">
                <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-4">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </div>
                <h2 className="text-lg text-gray-900 font-medium title-font mb-2">
                  Blockchain Integrity
                </h2>
                <p className="leading-relaxed text-base">
                  Each bid is stored immutably on the blockchain, ensuring a
                  tamper-proof record of all auction activities.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="xl:w-1/3 md:w-1/2 p-4">
              <div className="border border-gray-300 p-6 rounded-lg">
                <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-4">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 8v4l3 3" />
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                </div>
                <h2 className="text-lg text-gray-900 font-medium title-font mb-2">
                  Real-Time Bidding
                </h2>
                <p className="leading-relaxed text-base">
                  Place and track bids in real time with live updates, ensuring
                  transparency and competitiveness.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="xl:w-1/3 md:w-1/2 p-4">
              <div className="border border-gray-300 p-6 rounded-lg">
                <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-4">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <h2 className="text-lg text-gray-900 font-medium title-font mb-2">
                  Secure Identity
                </h2>
                <p className="leading-relaxed text-base">
                  Every participant is verified through encrypted wallets and
                  blockchain credentials, ensuring only authorized access.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="xl:w-1/3 md:w-1/2 p-4">
              <div className="border border-gray-300 p-6 rounded-lg">
                <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-4">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7" />
                  </svg>
                </div>
                <h2 className="text-lg text-gray-900 font-medium title-font mb-2">
                  Decentralized Auctions
                </h2>
                <p className="leading-relaxed text-base">
                  Remove intermediaries with smart contracts that automatically
                  validate and execute winning bids.
                </p>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="xl:w-1/3 md:w-1/2 p-4">
              <div className="border border-gray-300 p-6 rounded-lg">
                <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-4">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                  </svg>
                </div>
                <h2 className="text-lg text-gray-900 font-medium title-font mb-2">
                  Transparent History
                </h2>
                <p className="leading-relaxed text-base">
                  Access complete bidding histories and outcomes, enhancing
                  accountability for buyers and sellers.
                </p>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="xl:w-1/3 md:w-1/2 p-4">
              <div className="border border-gray-300 p-6 rounded-lg">
                <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-4">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <h2 className="text-lg text-gray-900 font-medium title-font mb-2">
                  Smart Contracts
                </h2>
                <p className="leading-relaxed text-base">
                  Automate trustless transactions with smart contracts that
                  finalize auctions without manual interference.
                </p>
              </div>
            </div>
          </div>

          <button
            className="flex mx-auto mt-16 text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
            onClick={() => navigate("/signup")}
          >
            Start Bidding
          </button>
        </div>
      </section>

      <section className="text-gray-700 body-font border-t border-gray-200">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-col text-center w-full mb-20">
            <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">
              Our Team
            </h1>
            <div className="lg:w-2/3 mx-auto leading-relaxed text-base space-y-2">
              <p>
                A dynamic team of innovative thinkers committed to delivering
                impactful solutions through collaboration and creativity.
              </p>
              <p>
                United by passion and precision, we blend diverse skills to turn
                bold ideas into reality.
              </p>
            </div>
          </div>

          {/* Card Container */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col items-center text-center">
              <img
                alt="team"
                className="w-22 h-[150px] object-cover rounded-full mb-4"
                src={shrey}
              />
              <h2 className="text-gray-900 font-medium text-lg">
                Shreyansh Chaurasia
              </h2>
              <p className="text-gray-500">UI Designer</p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col items-center text-center">
              <img
                alt="team"
                className=" w-22 h-[150px]   object-cover rounded-full mb-4"
                src={piyu}
              />
              <h2 className="text-gray-900 font-medium text-lg">
                Piyush Gupta
              </h2>
              <p className="text-gray-500">CTO</p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col items-center text-center">
              <img
                alt="team"
                className="w-22 h-[150px]  object-cover rounded-full mb-4"
                src="https://dummyimage.com/88x88/edf2f7/a5afbd"
              />
              <h2 className="text-gray-900 font-medium text-lg">Shruti Pal</h2>
              <p className="text-gray-500">Founder</p>
            </div>

            {/* Card 4 */}
            <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col items-center text-center">
              <img
                alt="team"
                className="w-22 h-[150px]  object-cover rounded-full mb-4"
                src={yet}
              />
              <h2 className="text-gray-900 font-medium text-lg">
                Yatendra Upadhayay
              </h2>
              <p className="text-gray-500">DevOps</p>
            </div>
          </div>
        </div>
      </section>

      <section className="text-gray-700 body-font border-t border-gray-200">
        <div className="container px-5 py-24 mx-auto">
          <div className="xl:w-1/2 lg:w-3/4 w-full mx-auto text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              className="inline-block w-8 h-8 text-gray-400 mb-8"
              viewBox="0 0 975.036 975.036"
            >
              <path d="M925.036 57.197h-304c-27.6 0-50 22.4-50 50v304c0 27.601 22.4 50 50 50h145.5c-1.9 79.601-20.4 143.3-55.4 191.2-27.6 37.8-69.399 69.1-125.3 93.8-25.7 11.3-36.8 41.7-24.8 67.101l36 76c11.6 24.399 40.3 35.1 65.1 24.399 66.2-28.6 122.101-64.8 167.7-108.8 55.601-53.7 93.7-114.3 114.3-181.9 20.601-67.6 30.9-159.8 30.9-276.8v-239c0-27.599-22.401-50-50-50zM106.036 913.497c65.4-28.5 121-64.699 166.9-108.6 56.1-53.7 94.4-114.1 115-181.2 20.6-67.1 30.899-159.6 30.899-277.5v-239c0-27.6-22.399-50-50-50h-304c-27.6 0-50 22.4-50 50v304c0 27.601 22.4 50 50 50h145.5c-1.9 79.601-20.4 143.3-55.4 191.2-27.6 37.8-69.4 69.1-125.3 93.8-25.7 11.3-36.8 41.7-24.8 67.101l35.9 75.8c11.601 24.399 40.501 35.2 65.301 24.399z"></path>
            </svg>
            <p className="leading-relaxed text-lg">
              "Implementing the blockchain-based bidding platform has
              transformed the way we handle procurement. The transparency and
              automation provided by smart contracts have eliminated disputes
              and built real trust with vendors. It's efficient, secure, and
              future-ready."
            </p>
            <span className="inline-block h-1 w-10 rounded bg-indigo-500 mt-8 mb-6"></span>
            <h2 className="text-gray-900 font-medium title-font tracking-wider text-sm">
              PRIYA SHARMA
            </h2>
            <p className="text-gray-500">
              Procurement Manager, GovChain Solutions
            </p>
          </div>
        </div>
      </section>

      <section className="text-gray-700 body-font relative">
        <div className="absolute inset-0 bg-gray-300 blur-md">
          <img
            src={img}
            alt="Blockchain visualization"
            className="w-full h-full object-cover object-center absolute inset-0"
          />
        </div>
        <div className="container px-5 py-24 mx-auto flex">
          <div className="lg:w-1/3 md:w-1/2 bg-white rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0 relative z-10">
            <h2 className="text-gray-900 text-lg mb-1 font-medium title-font">
              Share Your Feedback
            </h2>
            <p className="leading-relaxed mb-5 text-gray-600">
              We value your input in helping us improve our secure and
              transparent bidding platform.
            </p>
            <input
              className="bg-white rounded border border-gray-400 focus:outline-none focus:border-indigo-500 text-base px-4 py-2 mb-4"
              placeholder="Your Email"
              type="email"
            />
            <textarea
              className="bg-white rounded border border-gray-400 focus:outline-none h-32 focus:border-indigo-500 text-base px-4 py-2 mb-4 resize-none"
              placeholder="Your Message"
            ></textarea>
            <button className="text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg">
              Submit
            </button>
            <p className="text-xs text-gray-500 mt-3">
              Your feedback helps shape a more secure and efficient digital
              procurement experience.
            </p>
          </div>
        </div>
      </section>

      <footer className="text-gray-700 body-font">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-wrap text-center -mb-10 -mx-4">
            <div className="lg:w-1/3 md:w-1/2 w-full px-4">
              <h2 className="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">
                PLATFORM
              </h2>
              <nav className="list-none mb-10">
                <li>
                  <a className="text-gray-600 hover:text-gray-800">Dashboard</a>
                </li>
                <li>
                  <a className="text-gray-600 hover:text-gray-800">
                    Active Bids
                  </a>
                </li>
                <li>
                  <a className="text-gray-600 hover:text-gray-800">
                    Completed Projects
                  </a>
                </li>
                <li>
                  <a className="text-gray-600 hover:text-gray-800">
                    Login / Register
                  </a>
                </li>
              </nav>
            </div>
            <div className="lg:w-1/3 md:w-1/2 w-full px-4">
              <h2 className="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">
                BLOCKCHAIN FEATURES
              </h2>
              <nav className="list-none mb-10">
                <li>
                  <a className="text-gray-600 hover:text-gray-800">
                    Transparency
                  </a>
                </li>
                <li>
                  <a className="text-gray-600 hover:text-gray-800">
                    Immutable Records
                  </a>
                </li>
                <li>
                  <a className="text-gray-600 hover:text-gray-800">
                    Smart Contracts
                  </a>
                </li>
                <li>
                  <a className="text-gray-600 hover:text-gray-800">
                    Secure Bidding
                  </a>
                </li>
              </nav>
            </div>
            <div className="lg:w-1/3 md:w-1/2 w-full px-4">
              <h2 className="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">
                RESOURCES
              </h2>
              <nav className="list-none mb-10">
                <li>
                  <a className="text-gray-600 hover:text-gray-800">
                    Documentation
                  </a>
                </li>
                <li>
                  <a className="text-gray-600 hover:text-gray-800">
                    GitHub Repo
                  </a>
                </li>
                <li>
                  <a className="text-gray-600 hover:text-gray-800">
                    Report Issue
                  </a>
                </li>
                <li>
                  <a className="text-gray-600 hover:text-gray-800">FAQs</a>
                </li>
              </nav>
            </div>
          </div>
        </div>

        <div className="bg-gray-200">
          <div className="container mx-auto py-4 px-5 flex flex-wrap flex-col sm:flex-row">
            <p className="text-gray-500 text-sm text-center sm:text-left">
              © 2025 Government Road Contracting System —
              <a
                href="https://github.com/theavnishkumar"
                className="text-gray-600 ml-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                @Module4
              </a>
            </p>
            <span className="sm:ml-auto sm:mt-0 mt-2 sm:w-auto w-full sm:text-left text-center text-gray-500 text-sm">
              Powered by Blockchain Technology
            </span>
          </div>
        </div>

        <a
          href="https://github.com/theavnishkumar/online-auction-system"
          className="rounded-full w-12 h-12 bg-gray-100 fixed bottom-0 right-0 flex items-center justify-center text-gray-800 mr-8 mb-8 shadow-sm border-gray-300 border"
          target="_blank"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
          </svg>
        </a>
      </footer>

      <a
        href="www.github.com"
        className="rounded-full w-12 h-12 bg-gray-100 fixed bottom-0 right-0 flex items-center justify-center text-gray-800 mr-8 mb-8 shadow-sm border-gray-300 border"
        target="_blank"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
        </svg>
      </a>
    </div>
  );
};

export default Landing;
