import React, { useEffect, useRef, useState } from "react";
import "./editor.css";
export default function Editor({ images }) {
  const [editorImages, setEditorImages] = useState([]);
  const [canvasImages, setCanvasImages] = useState({});
  const [selectedCanvasImage, setSelectedCanvasImage] = useState(null);
  const [canvasElem, setCanvasElem] = useState(null);
  const onDrop = (e) => {
    e.preventDefault();
    let data = e.dataTransfer.getData("text/html");
    const image = images[parseInt(data)];
    addImage(image, 0, 0);

    setEditorImages([...editorImages, image]);
  };
  const onDragOver = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    const canvas = document.getElementById("canvas");
    setCanvasElem(canvas.getContext("2d"));

    canvas.addEventListener("click", (event) => {
      // get the clicked position
      let rect = canvas.getBoundingClientRect();
      let clickx = event.clientX - rect.left;
      let clicky = event.clientY - rect.top;
      // detect the image that was clicked
      let selectedImage = null;
      for (const key in canvasImages) {
        const { x, y, w, h, index } = canvasImages[key];
        if (isInsideRect(clickx, clicky, x, y, w, h)) {
          //see index   @pending
          selectedImage = canvasImages[key];
          break;
        }
      }
      setSelectedCanvasImage({ key: selectedImage });
    });
  }, []);

  const isInsideRect = (clickx, clicky, x, y, w, h) => {
    return true;
  };

  const addImage = (image, x, y) => {
    const { data, filename } = image;
    var imgTag = new Image();
    imgTag.src = data; // load image
    imgTag.id = filename;

    setCanvasImages({
      ...canvasImages,
      filename: {
        x,
        y,
        w: imgTag.width,
        h: imgTag.height,
        index: Object.keys(canvasImages).length,
      },
    });
    canvasElem.drawImage(imgTag, x, y);
    // add events
  };
  useEffect(() => {
    if (selectedCanvasImage == null) return;
    // highlight the image using rect
    const { x, y, w, h } = selectedCanvasImage;
    drawRect(10, 10, w, h, 10, "blue");
    console.log(selectedCanvasImage);
  }, [selectedCanvasImage]);

  const drawRect = (x, y, w, h, thikness, color) => {
    getCanvas().beginPath();
    getCanvas().lineWidth = `${thikness}`;
    getCanvas().strokeStyle = color;
    getCanvas().rect(x, y, w, h);
    getCanvas().stroke();
    console.log("drawed");
  };
  const ref = useRef(null);

  const getCanvas = () => {
    return ref.current.getContext("2d");
  };
  return (
    <div className="editor-main" onDrop={onDrop} onDragOver={onDragOver}>
      <canvas ref={ref} width={500} height={500} id="canvas"></canvas>
    </div>
  );
}
