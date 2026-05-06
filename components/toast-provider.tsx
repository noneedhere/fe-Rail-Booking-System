"use client";

import { ToastContainer } from "react-toastify";

/**
 * Global toast provider — renders a single ToastContainer for the entire app.
 * 
 * This replaces the 20+ duplicate <ToastContainer> instances that were
 * scattered across individual CRUD components (addTrain, editTrain, deleteTrain, etc).
 * 
 * Having multiple containers with the same containerId caused react-toastify
 * to break: auto-dismiss timers and close buttons stopped working.
 */
export const ToastProvider = () => {
    return (
        <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
        />
    );
};
