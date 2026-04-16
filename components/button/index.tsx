import React, { useState } from "react";

type ButtonProps = {
    type: "button" | "submit" | "reset";
    onClick?: () => void;
    className?: string;
    children: React.ReactNode;
};

export const ButtonSuccess: React.FC<ButtonProps> = ({
    type,
    onClick,
    className,
    children,
}) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`bg-green-500 text-white px-4 py-2 rounded shadow-md hover:bg-green-600 transition duration-300 ${className}`}
        >
            {children}
        </button>
    );
};

export const ButtonWarning: React.FC<ButtonProps> = ({
    type,
    onClick,
    className,
    children,
}) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`bg-yellow-500 text-white px-4 py-2 rounded shadow-md hover:bg-yellow-600 transition duration-300 ${className}`}
        >
            {children}
        </button>
    );
};

export const ButtonSOutline: React.FC<ButtonProps> = ({
    type,
    onClick,
    className,
    children,
}) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`bg-white text-green-500 px-4 py-2 rounded shadow-md hover:text-green-600 transition duration-300 ${className}`}
        >
            {children}
        </button>
    );
};

export const ButtonDOutline: React.FC<ButtonProps> = ({
    type,
    onClick,
    className,
    children,
}) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`bg-white text-red-500 px-4 py-2 rounded shadow-md hover:text-red-600 transition duration-300 ${className}`}
        >
            {children}
        </button>
    );
};

export const ButtonIOutline: React.FC<ButtonProps> = ({
    type,
    onClick,
    className,
    children,
}) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`bg-white text-sky-500 px-4 py-2 rounded shadow-md transition duration-300 ${className}`}
        >
            {children}
        </button>
    );
};

export const ButtonDanger: React.FC<ButtonProps> = ({
    type,
    onClick,
    className,
    children,
}) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`bg-red-500 text-white px-4 py-2 rounded shadow-md hover:bg-red-600 transition duration-300 ${className}`}
        >
            {children}
        </button>
    );
};

// Modal Component
type ModalProps = {
    title: string;
    message: string;
    isOpen: boolean;
    onClose: () => void;
};

export const Modal: React.FC<ModalProps> = ({ title, message, isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-5">
                <h2 className="text-xl font-bold mb-3">{title}</h2>
                <p className="mb-4">{message}</p>
                <button
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
        </div>
    );
};
