import React, { useState } from "react";
import "./assets.css";

export default function Assets({ images }) {
  const onDragOver = (e) => {
    e.preventDefault();
  };
  const onDragStart = (e) => {
    // e.preventDefault();
    e.dataTransfer.setData("Text/html", e.target.id);
  };

  return (
    <div className="assets-main">
      {images.map((image, index) => (
        <img
          src={image.data}
          key={image.filename}
          className="assets-img"
          draggable
          onDragOver={onDragOver}
          id={index}
          onDragStart={onDragStart}
        />
      ))}
    </div>
  );
}
