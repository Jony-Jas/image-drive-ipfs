import "./App.css";
import { useState } from "react";
import { create } from "ipfs-http-client";

const projectId = "<INFURA_PROJECT_ID>";
const projectSecret = "<INFURA_SECRET_KEY>";
const auth =
  "Basic " +
  (window.Buffer = window.Buffer || require("buffer").Buffer)
    .from(projectId + ":" + projectSecret)
    .toString("base64");

const client = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
});

function App() {
  const [file, setFile] = useState(null);
  const [urlArr, setUrlArr] = useState([]);

  const retrieveFile = (e) => {
    console.log(e)
    const data = e.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(data);
    reader.onloadend = () => {
      setFile(reader.result);
    };
    e.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const created = await client.add(file);
      const url = `https://img.infura-ipfs.io/ipfs/${created.path}`;
      setUrlArr((prev) => [...prev, url]);
      setFile(null);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <div className="header">
        <h2>Image Drive</h2>
      </div>
      <div className="App">
        <form className="form" onSubmit={handleSubmit}>
          <input type="file" name="data" onChange={retrieveFile} />
          <button type="submit" className="btn">
            Upload file
          </button>
        </form>
        <div className="display">
          {urlArr.length !== 0 ? (
            urlArr.map((el) => <img src={el} key="el" alt="nfts" />)
          ) : (
            <div style={{ gridColumn: "2/3", maxWidth: "15rem" }}>
              <img
                src="https://cdn-icons-png.flaticon.com/512/3875/3875172.png"
                alt="not found"
              />
              <h4>No images Found</h4>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
