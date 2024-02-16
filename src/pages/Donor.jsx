import React, { useState, useEffect } from "react";
//components
import { Sidebar } from "../components/Sidebar.jsx";
import Accomplishment from "../components/Accomplishment.jsx";
import WelcomeBack from "../components/WelcomeBack.jsx";
import DonorForm from "../components/DonorForm.jsx";
import PendingDistributions from "../components/PendingDistributions";
import HowToDonate from "../components/HowToDonate";
import CompletedDistribution from "../components/CompletedDistribution.jsx";
//icons
import { MdOutlineDashboard } from "react-icons/md";
import { TbReportAnalytics } from "react-icons/tb";
import { AiOutlineUser, AiOutlineHeart } from "react-icons/ai";
import { FiLogOut } from "react-icons/fi";
import { FiFolder } from "react-icons/fi";
import axios from "axios";
import { useSelector } from "react-redux";

// import { useNavigate } from "react-router-dom";
// const navigate = useNavigate();

// const handleLogout = () => {
//   // logout logic

//   navigate("/login");
// };

const Donor = () => {
  const [isDistribute, setisDistribute] = useState(false);
  const userDetails = useSelector((state) => state.auth.userDetails);

  // const logoutUser=()=>{
  //   console.log("Logout is clicked");
  //   // if (userDetails._id){
  //     try {
  //       const response=axios.post('http://localhost:9005/api/v1/users/logout',{
  //         withCredentials: true, // Include credentials (cookies) in the request
  //       });
  //       console.log(response);
  //     } catch (error) {
  //       console.log("Error:",error);
  //     }
  //   // }
  // }

  //sidebar
  const SidebarMenu = [
    { name: "Homepage", link: "/", icon: MdOutlineDashboard },
    { name: "User", link: "/profile", icon: AiOutlineUser },
    {
      name: "Active listings",
      link: "/",
      icon: TbReportAnalytics,
      margin: true,
    },
    { name: "Past listings", link: "/", icon: FiFolder },
    {
      name: "Difference you made",
      link: "/#Accomplishment",
      icon: AiOutlineHeart,
      margin: true,
    },
    {
      name: "Logout",
      link: "/",
      icon: FiLogOut,
      margin: true,
      onClick: async () => {
        try {
          const response = await axios.post(
            "http://localhost:9005/api/v1/users/logout",
            {
              withCredentials: true, // Include credentials (cookies) in the request
            }
          );
          console.log(response);
          // Perform any additional actions after logout
        } catch (error) {
          console.log("Error:", error);
        }
      },
    },
  ];

  const [submittedItems, setSubmittedItems] = useState([]);
  const [formData, setFormData] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [recentOrderDetails, setRecentOrderDetails] = useState();
  const [activeListings, setActiveListings] = useState([]);
  const [completedListings, setCompletedListings] = useState([]);
  const handleFormSubmit = async (data) => {
    setFormData(data);
    setFormSubmitted(true);
    //  addOrder();
    // setPendingItems((prevItems) => [...prevItems, data]);
    setSubmittedItems((prevItems) => [...prevItems, data]);
    // setisDistribute=(true);
  };
  useEffect(() => {
    if (formSubmitted == true) {
      addOrder();
    }
  }, [formSubmitted]);

  const addOrder = async () => {
    try {
      if (formData) {
        const response = await axios.post(
          "http://localhost:9005/api/v1/order/create-order",
          {
            _id: userDetails._id,
            foodItems: formData.foodItem,
            platesAvailable: formData.quantity,
            closingTime: 2,
            title: formData.title,
          },
          {
            headers: {
              "Content-Type": "application/json", //says data at body is at json format
            },
            withCredentials: true, // Send cookies with the request
          }
        );
        console.log(response);
        setRecentOrderDetails(response);
      } else {
        console.log("No data recieved for forms");
      }
    } catch (error) {
      console.log("Error at adding order", error);
    }
  };

  const currentActiveListings = async () => {
    try {
      const response = await axios.post(
        "http://localhost:9005/api/v1/order/active-listings-for-donor",
        {
          _id: userDetails._id,
        },
        {
          headers: {
            "Content-Type": "application/json", //says data at body is at json format
          },
          withCredentials: true, // Send cookies with the request
        }
      );
      console.log(response.data.data);
      setActiveListings(response.data.data);
      // setActiveListings(response.data);
    } catch (error) {
      console.log("Error at listing active orders", error);
    }
  };

  useEffect(() => {
    currentActiveListings(); //naya order list garesi feri api call garna paryo
  }, [recentOrderDetails]);

  const handleCancelDistribution = (index) => {
    console.log("Cancel button clicked for index", index);
    // Remove the item from pending distribution
    setActiveListings((prevItems) => prevItems.filter((_, i) => i !== index));
  };
  const handleSubmitAnother = () => {
    // Reset to allow another submission
    setFormData(null);
    setFormSubmitted(false);
  };

  const handleComplete = (completedItem) => {
    ///complte ma pathauna lai -->
    setCompletedListings((prevItems) => [...prevItems, completedItem]);

    //remove from pending dist

    //   setActiveListings((prevItems) =>
    //     prevItems.filter((item) => item.id !== completedItem.id)
    //   );
  };

  const [isMobile, setIsMobile] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth <= 768) {
        setOpen(false);
      } else {
        setOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const handleToggle = () => {
    setOpen(!open);
  };

  const cancelOrderForDonor = async (_id) => {
    try {
      const response = await axios.post(
        `http://localhost:9005/api/v1/order/cancel-order-for-donor`,
        {
          _orderId: _id,
        },
        {
          withCredentials: true, // Include credentials (cookies) in the request
        }
      );
      console.log("Successfully cancelled order:", response);
      // setTopContributorsData(response.data.data.topTenDonators);
    } catch (error) {
      console.error("Error cancelling order for donor:", error);
    }
  };

  const completeOrderForDonor = async (_id) => {
    try {
      const response = await axios.post(
        `http://localhost:9005/api/v1/order/completed-order-for-donor`,
        {
          _orderId: _id,
        },
        {
          withCredentials: true, // Include credentials (cookies) in the request
        }
      );
      console.log("Successfully completed order:", response);
      // setTopContributorsData(response.data.data.topTenDonators);
    } catch (error) {
      console.error("Error completing order for donor:", error);
    }
  };

  return (
    <div className="flex dark:bg-[#121212]">
      <div
        className={`w-1/5`}
        style={{ width: isMobile ? " 0px" : open ? "20%" : "2%" }}
      >
        <Sidebar
          menus={SidebarMenu}
          handleToggle={handleToggle}
          isOpen={open}
        />
      </div>
      <div
        className="flex-1"
        style={{ marginLeft: isMobile ? "0px" : open ? "0%" : "0" }}
      >
        <div className="md:col-span-1 justify-center pt-10 m-3">
          <div className="flex flex-col bg-cyan-100 rounded-md p-6 shadow-sm dark:bg-[#1F1A24]">
            <WelcomeBack userName={userDetails.username} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
            <div className="col-span-1">
              <div className="container mx-auto p-4 wrapper">
                <h1 className="text-3xl font-bold mb-4 text-[#261750] dark:text-[#7c58de] self-center">
                  Active Listings
                </h1>
                <div className="container mx-auto p-4 grid grid-cols-1 lg:grid-cols-1 wrapper gap-4 col-span-2 lg:col-span-1">
                  {/* {!formSubmitted ? ( */}
                  <DonorForm onFormSubmit={handleFormSubmit} />

                  {/* ) : ( */}

                  {/* )} */}
                </div>
              </div>
            </div>

            <div className="col-span-1 md:col-span-1 md:flex md:items-center md:justify-center ">
              <div className="container mx-auto p-8 wrapper relative z-20">
                <div className="absolute top-1/4 left-1/4 w-12 h-12 bg-gray-300 rounded-full opacity-50 dark:bg-gray-600"></div>
                <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-gray-300 rounded-full opacity-50 dark:bg-gray-600"></div>
                <div className="absolute bottom-1/4 left-1/2 w-20 h-20 bg-gray-300 rounded-full opacity-50 dark:bg-gray-600"></div>
                <HowToDonate
                  isDistribute={isDistribute}
                  // isReserved={isReserved}
                />
              </div>
            </div>
          </div>
          <div>
            <PendingDistributions
              pendingItems={activeListings}
              onCancelDistribution={handleCancelDistribution}
              isDonorPage={true}
              onCompleteProp={handleComplete}
              cancelOrder={cancelOrderForDonor}
              completeOrder={completeOrderForDonor}
            />

            <button
              onClick={handleSubmitAnother}
              className="bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
            >
              Submit Another Listing
            </button>
          </div>
          <div
            id="Completed"
            className="container mx-auto p-4 grid grid-cols-1 lg:grid-cols-1 wrapper gap-4 col-span-2 lg:col-span-1"
          >
            <CompletedDistribution completedItems={completedListings} />
          </div>
          <div
            id="Accomplishment"
            className="justify-center pt-10 mb-auto w-full"
          >
            <Accomplishment
              totalFoodSaved={500}
              ourCommunity={1}
              totalPeopleServed={800}
              totalFoodSavedText="Total Food Saved"
              ourCommunityText="Ranking"
              totalPeopleServedText="Total People Served"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Donor;
