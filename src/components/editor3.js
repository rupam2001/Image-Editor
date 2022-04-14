import React, {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import "./editor.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrows,
  faCoffee,
  faExpand,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
export default function Editor3({ images }) {
  const [editorImages, setEditorImages] = useState([]);
  const [selectedCanvasImage, setSelectedCanvasImage] = useState(null);
  const selectedCanvasImageRef = useRef(null);
  const [stopDrags, setStopDrags] = useState(false);
  const [moveEnabled, setMoveEnabled] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const onDrop = (e) => {
    e.preventDefault();
    // if (stopDrags) return;
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
    setStopDrags(true);
    setShowControls(true);
  };

  const mouseOverFn = useCallback(
    (e) => {
      if (!selectedCanvasImage) return;
      const editor = document.getElementById("editor");
      const img = document.getElementById(
        "editor-" + selectedCanvasImage.index
      );
      const x = e.clientX - editor.offsetLeft;
      const y = e.clientY - editor.offsetTop;

      if (isOverFlowing(x, y)) {
        console.log("Overflowing");
        return;
      }

      img.style.left = x + "px";
      img.style.top = y + "px";

      const images = [...editorImages];
      images[selectedCanvasImage.index].position.x = x + "px";
      images[selectedCanvasImage.index].position.y = y + "px";
      setEditorImages(images);
    },
    [selectedCanvasImage]
  );

  const isOverFlowing = (_x, _y) => {
    const editor = document.getElementById("editor");
    const w = editor.offsetWidth;
    const h = editor.offsetHeight;
    const img = document.getElementById("editor-" + selectedCanvasImage.index);
    if (_x + img.offsetWidth > w) return true;
    if (_y + img.offsetHeight > h) return true;
    return false;
  };

  const onDragStart = (e) => {
    e.preventDefault();
  };
  const removeAllListeners = (old_element) => {
    const editor = document.getElementById("editor");
    editor.removeEventListener("mousemove", mouseOverFn);
    editor.style.cursor = "auto";
    return;
  };

  const handleMoveClick = (e) => {
    setShowControls(false);
    if (moveEnabled) {
      setMoveEnabled(false);
      removeAllListeners(document.getElementById("editor"));
      setSelectedCanvasImage(null);
      return;
    }
    setMoveEnabled(true);
    const editor = document.getElementById("editor");
    editor.style.cursor = "move";
    editor.addEventListener("mousemove", mouseOverFn);
    e.stopPropagation();
  };
  const handleMoveDelete = (image) => {
    let images = [...editorImages].filter((i) => i.index != image.index);
    setEditorImages(images);
  };
  const handleClickOnEditor = (e) => {
    if (moveEnabled) {
      setMoveEnabled(false);
      return;
    }
    setSelectedCanvasImage(null);
    // e.stopPropagation();
    removeAllListeners();
    setStopDrags(false);
    console.log("editor hit");
  };

  const controlsWrapperFn = (fn) => {};

  return (
    <div
      className="editor-main"
      onDrop={onDrop}
      onDragOver={onDragOver}
      id="editor"
      onClick={handleClickOnEditor}
    >
      {editorImages.map((image, index) => {
        if (selectedCanvasImage?.index == index) {
          return (
            <div
              id={"editor-" + index}
              key={index}
              style={
                image.position
                  ? {
                      left: image.position?.x,
                      top: image.position?.y,
                      position: "absolute",
                    }
                  : {}
              }
              className="editor-image-wrapper"
            >
              {showControls && (
                <div className="editor-image-controls">
                  <span onClick={(e) => handleMoveClick(e)}>
                    <FontAwesomeIcon icon={faArrows} />
                  </span>

                  <span onClick={() => handleMoveDelete(image)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </span>
                  {/* <span onClick={() => handleMoveDelete(image)}>
                    <FontAwesomeIcon icon={faExpand} />
                  </span> */}
                </div>
              )}
              <img src={image.data} className="editor-img" key={index} />
            </div>
          );
        }
        return (
          <img
            ref={
              selectedCanvasImage?.id == index ? selectedCanvasImageRef : null
            }
            src={image.data}
            className="editor-img"
            key={index}
            style={
              image.position
                ? {
                    left: image.position?.x,
                    top: image.position?.y,
                    position: "absolute",
                  }
                : {}
            }
            // id={"editor-" + index}
            // onClick={handleImageClick}
            onMouseDown={(e) => handleImageClick(e, image)}
            // onMouseUp={handleImageRelease}
            onDragStart={onDragStart}
          />
        );
      })}
    </div>
  );
}
