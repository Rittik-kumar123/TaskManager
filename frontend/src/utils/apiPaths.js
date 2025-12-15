export const BASE_URL = "https://taskmanager-1-1tia.onrender.com";

//utils/apiPaths.js
export const API_PATHS = {
    AUTH: {
        REGISTER:"/api/auth/register",//Register a new user
        LOGIN:"/api/auth/login",//Authenticate User and return jwt token
        GET_PROFILE:"/api/auth/profile",//Get Logedin User Detail
    },

    USERS:{
        GET_ALL_USERS:"/api/users",//Get all users(Admin Only)
        GET_USER_BY_ID:(userId) => `/api/users/${userId}`,
        CREATE_USER : "/api/users",//Create User (Admin Only)
        UPDATE_USER:(userId)=>`/api/users/${userId}`,//update User Detail
        DELETE_USER:(userId)=>`/api/users/${userId}`,//Delete User
    },

    TASKS: {
        GET_DASHBOARD_DATA : "/api/tasks/dashboard-data", //Get dashbpard data
        GET_USER_DASHBOARD_DATA: "/api/tasks/user-dashboard-data",//Get user dashboard data
        GET_ALL_TASKS:"/api/tasks",
        GET_TASK_BY_ID:(taskId)=>`/api/tasks/${taskId}`,
        CREATE_TASK:"/api/tasks",//Create a New task(Admin Only)
        UPDATE_TASK:(taskId)=>`/api/tasks/${taskId}`,
        DELETE_TASK:(taskId)=>`/api/tasks/${taskId}`,

        UPDATE_TASK_STATUS:(taskId)=>`/api/tasks/${taskId}/status`,
        UPDATE_TODO_CHECKLIST:(taskId)=>`/api/tasks/${taskId}/todo`,
    },

    REPORTS: {
        EXPORT_TASKS : "/api/report/export/tasks",
        EXPORT_USER: "/api/report/export/users",
    },

    IMAGE: {
        UPLOAD_IMAGE: "/api/auth/upload-image",
    },
};