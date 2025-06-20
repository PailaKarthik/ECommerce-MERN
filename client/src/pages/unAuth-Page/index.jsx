import React from "react";

const UnAuthPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <h1 className="text-2xl font-bold">Unauthorized Access</h1>
        <p className="text-gray-600 mb-3">
          You do not have permission to view this page.
        </p>
        <a href="/auth/login" className="text-blue-500 hover:underline">
          Go to Login Page
        </a>
    </div>
  );
};

export default UnAuthPage;
