import { configureStore } from "@reduxjs/toolkit";
import addProjectReducer from "./addProjectSlice";
import getProjectReducer from "./getProjectSlice";
import getClientReducer from "./getClientSlice";
import getEditorReducer from "./getEditorSlice";
import loginReducer from "./loginSlice";
import getStatsClientReducer from "./getStatsClientSlice";
import getStatsEditorReducer from "./getStatsEditorSlice";
import changeStatusReducer from "./changeStatusSlice";
import changeEditorReducer from "./changeEditorSlice";
import addCommentReducer from "./addCommentSlice";
import dragDropReducer from "./dragDropSlice";
import getEditorProjectReducer from "./getEditorProjectSlice";
import getClientProjectReducer from "./getClientProjectSlice";
import addEditorReducer from "./addEditorSlice";
import blockUserReducer from "./blockUserSlice";
import hideProjectReducer from "./hideProjectSlice";
import ImageReducer from "./imageSlice";
import notificationReducer from "./notificationSlice";
import getNotificationReducer from "./getNotificationSlice";
import signupReducer from "./signupSlice";
import signupEditorReducer from "./signupEditorSlice";
import forgetReducer from "./forgetSlice";
import confirmReducer from "./confirmSlice";
import editProjectReducer from "./editProjectSlice";
import getAdminEditorReducer from "./getAdminEditorSlice";
import editUserReducer from "./editProjectSlice";
import deleteProjectReducer from "./deleteProjectSlice";
import updatePasswordReducer from "./updatePasswordSlice";
import deleteUserReducer from "./deleteUserSlice";
import reOrderReducer from "./reOrderSlice";
import getUserReducer from "./getUserSlice";
import getCompanyReducer from "./getCompanySlice";
import addCompanyReducer from "./addCompanySlice";
import changeRoleReducer from "./changeRoleSlice";
import deleteCompanyReducer from "./deleteCompanySlice";
// Or from '@reduxjs/toolkit/query/react'

export const store = configureStore({
  reducer: {
    login: loginReducer,
    addProject: addProjectReducer,
    getProject: getProjectReducer,
    getClient: getClientReducer,
    getEditor: getEditorReducer,
    getAdminEditor: getAdminEditorReducer,
    getStatsClient: getStatsClientReducer,
    getStatsEditor: getStatsEditorReducer,
    changeStatus: changeStatusReducer,
    changeEditor: changeEditorReducer,
    addComment: addCommentReducer,
    dragDrop: dragDropReducer,
    getEditorProject: getEditorProjectReducer,
    getClientProject: getClientProjectReducer,
    addEditor: addEditorReducer,
    blockUser: blockUserReducer,
    hideProject: hideProjectReducer,
    Image: ImageReducer,
    Notification: notificationReducer,
    signup: signupReducer,
    signupEditor: signupEditorReducer,
    forgetPassword: forgetReducer,
    confirmPassword: confirmReducer,
    getNotification: getNotificationReducer,
    editProject: editProjectReducer,
    editUser: editUserReducer,
    deleteProject: deleteProjectReducer,
    updatePassword: updatePasswordReducer,
    deleteUser: deleteUserReducer,
    reOrder: reOrderReducer,
    getUser: getUserReducer,
    getCompany: getCompanyReducer,
    addCompany: addCompanyReducer,
    deleteCompany: deleteCompanyReducer,
    changeRole: changeRoleReducer,
  },
});
