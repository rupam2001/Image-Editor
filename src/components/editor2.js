import React, { useEffect, useReducer, useRef, useState } from "react";
import "./editor.css";
export default function Editor2({ images }) {
  const [editorImages, setEditorImages] = useState([]);
  const [canvasImages, setCanvasImages] = useState({});
  const [selectedCanvasImage, setSelectedCanvasImage] = useState(null);
  const [canvasElem, setCanvasElem] = useState(null);
  const [selectedCanvasImageNode, setSelectedCanvasImageNode] = useState(null);
  const selectedCanvasImageRef = useRef(null);
  const [stopDrags, setStopDrags] = useState(false);
  const onDrop = (e) => {
    e.preventDefault();
    if (stopDrags) return;
    let data = e.dataTransfer.getData("text/html");
    let image = images[parseInt(data)];

    image = { ...image, position: { x: 0, y: 0 }, index: editorImages.length };

    setEditorImages([...editorImages, image]);
  };
  const onDragOver = (e) => {
    e.preventDefault();
  };
  const handleImageClick = (e, image) => {
    setSelectedCanvasImage(image);
    console.log(image);
    const editor = document.getElementById("editor");

    const img = [...editor.getElementsByTagName("img")].filter(
      (i) => i.id == e.target.id
    )[0];
    setSelectedCanvasImageNode(img);
    highlightImage(img);
    registerMovingForImage(img);
    setStopDrags(true);
  };

  const highlightImage = (img) => {
    img.style.border = "2px solid blue";
    img.style.zIndex = 1; // can be with the index
  };
  const unhighlightImage = (img) => {
    img.style.border = "0px";
    img.style.zIndex = 0;
    img.style.display = "none";
    console.log("unhighlighted", img);
  };

  const mouseOverFn = (e, img) => {
    const editor = document.getElementById("editor");
    const x = e.clientX - editor.offsetLeft;
    const y = e.clientY - editor.offsetTop;
    img.style.left = x + "px";
    img.style.top = y + "px";
    console.log(x, y, img.style.left, img.style.top);
  };

  const registerMovingForImage = (img) => {
    const editor = document.getElementById("editor");
    editor.addEventListener("mousemove", (e) => mouseOverFn(e, img));
  };

  const handleImageRelease = (e) => {
    const editor = document.getElementById("editor");
    // editor.removeEventListener("mousedown", )
    removeAllListeners(editor);
    setStopDrags(false);
    unhighlightImage(
      [...editor.getElementsByTagName("img")].filter(
        (i) => i.id == selectedCanvasImage.index
      )[0]
    );
  };

  const onDragStart = (e) => {
    e.preventDefault();
  };
  const removeAllListeners = (old_element) => {
    var new_element = old_element.cloneNode(true);
    old_element.parentNode.replaceChild(new_element, old_element);
  };
  return (
    <div
      className="editor-main"
      onDrop={onDrop}
      onDragOver={onDragOver}
      id="editor"
    >
      {editorImages.map((image, index) => {
        return (
          <img
            ref={
              setSelectedCanvasImageNode?.id == index
                ? selectedCanvasImageRef
                : null
            }
            src={image.data}
            className="editor-img"
            key={index}
            style={
              image.position
                ? {
                    left: image.position?.x,
                    top: image.postion?.y,
                    position: "absolute",
                  }
                : {}
            }
            // onClick={handleImageClick}
            onMouseDown={(e) => handleImageClick(e, image)}
            onMouseUp={handleImageRelease}
            onDragStart={onDragStart}
          />
        );
      })}
    </div>
  );
}
