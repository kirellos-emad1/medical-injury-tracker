import React from "react";

const Loading = () => {
  return (
    <div className="flex items-center justify-center w-full h-screen">
      <div className="spinner-container">
        <div className="loading-spinner"></div>
      </div>
    </div>
  );
};

export default Loading;
