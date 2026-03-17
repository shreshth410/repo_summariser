import React from "react";

export default function Loader({ message }) {
  return (
    <div className="loader-wrap">
      <div className="spinner" />
      <p className="loader-text">{message}</p>
    </div>
  );
}
