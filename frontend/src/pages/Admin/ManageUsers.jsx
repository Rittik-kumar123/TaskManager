import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { LuFileSpreadsheet } from 'react-icons/lu';
import UserCard from '../../components/Cards/UserCard';
// import { toast } from "react-toastify";


const ManageUsers = () => {

  const [allUsers,setAllUsers]=useState([]);

  const getAllUsers = async () => {
    try{
      const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
      // console.log(response.data);
      if(response.data?.length>0)
      {
        setAllUsers(response.data);
      }
    }catch(error)
    {
      console.error("Error Fetching Users .. ",error);
    }
  };

  // console.log("Render ManageUsers");


  //download task report
  const handleDownloadReport = async () => {
    try{
        // console.log("hii1")
        const response = await axiosInstance.get(API_PATHS.REPORTS.EXPORT_USER,{
          responseType:"blob",
        });
        // console.log("hii1")

        //create a url for the blob
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download","users_report.xlsx");
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);

    }catch(error)
    {
        console.error("Error downloading the expense detail..",error);
        toast.error("Failed to download expense details . please try again ");
    }
  }

  useEffect(()=>{
    getAllUsers();

    return()=>{}
  },[])

  return (
    <DashboardLayout activeMenu="Team Member">
      <div className="mt-5 mb-10">
        <div className="flex md:flex-row md:items-center justify-between">
          <h2 className="text-xl md:text-xl font-medium">Team Member</h2>

          <button className="flex md:flex download-btn" onClick={() => handleDownloadReport()}>
            <LuFileSpreadsheet className='text-lg '></LuFileSpreadsheet>
            Download Report
          </button>

          {/* <button onClick={() => console.log("CLICK WORKS!!")}>
            Test
          </button> */}

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {allUsers.map((user)=>(
            <UserCard key={user._id} userInfo={user}></UserCard>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default ManageUsers
