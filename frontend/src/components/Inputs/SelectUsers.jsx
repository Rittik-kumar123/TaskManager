import React, { useEffect, useState } from 'react'
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { LuUser } from 'react-icons/lu';
import Modal from '../Modal';
import AvatarGroup from '../layouts/AvatarGroup';

const SelectUsers = ({selectedUsers, setSelectedUsers}) => {
    const[allUsers,setAllUsers]=useState([]);
    const [isModalOpen,setIsModalOpen]=useState(false);
    const[tempSelectedUser,setTempSelectedUser]=useState([]);

    const getAllUsers = async() => {
        try{
            const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
            // console.log(response.data);
            if(response.data?.length>0){
                setAllUsers(response.data);
            }
        }
        catch(error)
        {
            console.error("Error Fetching Users : ",error);
        }
    };

    const toggleUserSelection = (userId) => {
        setTempSelectedUser((prev)=> prev.includes(userId)?prev.filter((id)=>id!== userId):[...prev,userId]);
    };

    const handleAssign = () => {
        setSelectedUsers(tempSelectedUser);
        setIsModalOpen(false);
    }

    const selectedUserAvatars = allUsers.filter((user)=> selectedUsers.includes(user._id)).map((user)=>user.profileImageUrl);

    useEffect(()=>{
        getAllUsers();
    },[]);

    useEffect(()=>{
        if(selectedUsers.length === 0)
        {
            setTempSelectedUser([]);
        }

        return () => {};
    },[selectedUsers]);
  return (
    <div className='space-y-4 mt-2'>
      {selectedUserAvatars.length === 0 && (
        <button
            className='card_btn'
            onClick={()=>setIsModalOpen(true)}
        >
            <LuUser className='text-sm'> </LuUser> 
            Add Members
        </button>
      )}

      {selectedUserAvatars.length>0 && (
        <div className="cursor-pointer" onClick={()=>setIsModalOpen(true)}>
            <AvatarGroup avatars={selectedUserAvatars} maxVisible={3}></AvatarGroup>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={()=>setIsModalOpen(false)} title='Select User'>
            <div className="space-y-4 h-[60vh] overflow-y-auto">
                {allUsers.map((user)=>(
                    <div className="flex items-center gap-4 p-3 border-b border-gray-200" key={user._id}>
                        <img src={user.profileImageUrl||null} alt={user.name} className='w-10 h-10 rounded-full'></img>
                        <div className="flex-1">
                            <p className="font-medium text-gray-800 dark:text-white">{user.name}</p>
                            <p className="text-[13px] text-gray-500">{user.email}</p>
                        </div>
                        <input type="checkbox" checked={tempSelectedUser.includes(user._id)}
                        onChange={()=> toggleUserSelection(user._id)}
                        className='w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded-sm outline-none ' />
                    </div>
                ))}
            </div>

            <div className="flex justify-end gap-4 pt-4">
                <button className="card_btn" onClick={()=> setIsModalOpen(false)}>
                    Cancel
                </button>
                <button className="card-btn-fill" onClick={handleAssign}>
                    Done
                </button>
            </div>
      </Modal>
    </div>
  )
}

export default SelectUsers
