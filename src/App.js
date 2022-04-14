import logo from "./logo.svg";
import "./App.css";
import Editor from "./components/editor";
import Assets from "./components/assets";
import { useState } from "react";
import Editor2 from "./components/editor2";
import Editor3 from "./components/editor3";

function App() {
  const [images, setImages] = useState([
    { data: `https://picsum.photos/id/237/200/300`, filename: "image1.jpg" },
    {
      data: `https://picsum.photos/seed/picsum/200/300`,
      filename: "image2.jpg",
    },
  ]);
  return (
    <div className="App">
      <Assets images={images} />
      <Editor3 images={images} />
    </div>
  );
}

export default App;
