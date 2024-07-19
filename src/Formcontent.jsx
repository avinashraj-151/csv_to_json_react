import { useState } from "react";
import orimage from "./assert/or.png";
import papa from "papaparse";
import { ToastContainer, Bounce, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function Formcontent() {
  const [jsonfiledata, setjsonfiledata] = useState([]);
  const [convertstate, setconvertstate] = useState(true);
  const [textareadata, settextareadata] = useState("");
  const [inputcolumnumber, setinputcolumnumber] = useState("");
  const [file, setfile] = useState(null);
  const [filename, setfilename] = useState("");
  function handeluploadedfile(event) {
    //
    setfile(event.target.files[0]);
    setfilename(event.target.value);
    // console.log(event.target.value);
  }
  function handeltextarea(event) {
    // console.log(event.target.value);
    settextareadata(event.target.value);
  }
  function handelclear() {
    if (jsonfiledata.length || textareadata || inputcolumnumber || filename)
      toast.success("👍eveything is clear!", {
        position: "top-left",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        // theme: "dark",
        transition: Bounce,
      });
    setjsonfiledata([]);
    settextareadata("");
    setinputcolumnumber("");
    setfile(null);
    setfilename("");
    setconvertstate(true);
  }
  function isJSONString(str) {
    try {
      const parsed = JSON.parse(str);
      return typeof parsed === "object" && parsed !== null;
    } catch (error) {
      return false;
    }
  }
  async function handelConvert() {
    // console.log("yes enter");
    const successfullyconvert = () => {
      toast.success("Conversion Successful!", {
        position: "top-left",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        // theme: "dark",
        transition: Bounce,
      });
    };
    try {
      //   console.log(file);
      if (file && textareadata.trim() != "") {
        toast.error("Please choose one option 📁 or ✍️", {
          position: "top-left",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          // theme: "dark",
          transition: Bounce,
        });
        setconvertstate(true);
        return;
      }
      if (file && textareadata === "") {
        setconvertstate(false);
        const reader = new FileReader();
        const textPromise = new Promise((resolve, reject) => {
          reader.onload = (e) => {
            resolve(e.target.result);
          };
          reader.onerror = (e) => reject(e);
          reader.readAsText(file);
        });

        const text = await textPromise;
        if (inputcolumnumber) {
          const parsedData = papa.parse(text, {
            header: true, // Assume headers are present
            complete: (results) => {},
          });
          if (parsedData) {
            let data = parsedData.data;
            let length = data.length;
            // console.log(parsedData.data[0]);
            const headline = Object.keys(data[0]);
            //here i need to give the check it is exist or not
            // console.log(headline);
            if (inputcolumnumber >= headline.length) {
              toast.error("Invalid Column Number!", {
                position: "top-left",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                // theme: "dark",
                transition: Bounce,
              });
              setconvertstate(true);
              return;
            }
            let jsondatacoll = [];
            for (let i = 0; i < length - 1; i++) {
              const check = data[i][headline[inputcolumnumber]];
              //   console.log(check);
              if (isJSONString(check)) {
                // console.log("yes");
                jsondatacoll.push(JSON.parse(check));
              } else if (!isJSONString(check)) {
                jsondatacoll.push({
                  [headline[inputcolumnumber]]: check,
                });
              }
            }
            // console.log(jsondatacoll);
            if (jsondatacoll.length) {
              let jsondatacollString = jsondatacoll
                .map((x) => {
                  return JSON.stringify(x)
                    .replaceAll("\\n", "")
                    .replaceAll("\\", "");
                })
                .join("\n");
              setjsonfiledata(jsondatacollString);
              setconvertstate(true);
              successfullyconvert();
            }
          }
        } else {
          const parsedData = papa.parse(text, {
            header: true, // Assume headers are present
            complete: (results) => {
              results.data.pop();
              var obj = results.data
                .map((x) => {
                  return JSON.stringify(x)
                    .replaceAll("\\n", "")
                    .replaceAll("\\", "");
                })
                .join("\n");

              setjsonfiledata(obj);
              setconvertstate(true);
              successfullyconvert();
            },
          });
        }
      } else if (textareadata.trim() != "") {
        // console.log("hmm bhai esmai hai ");
        setconvertstate(false);
        const parsedData = papa.parse(textareadata, {
          header: true, // Assume headers are present
          complete: (results) => {
            // var obj = JSON.stringify(results.data, undefined, 4);
            var obj = results.data
              .map((x) => {
                return JSON.stringify(x)
                  .replaceAll("\\n", "")
                  .replaceAll("\\", "");
              })
              .join("\n");

            setjsonfiledata(obj);
            setconvertstate(true);
            successfullyconvert();
          },
        });
      } else {
        // 📁 Upload a file or ✍️enter data.
        toast.error("📁 Upload a file or ✍️enter data", {
          position: "top-left",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          // theme: "dark",
          transition: Bounce,
        });
        // console.log("Please upload a file or enter data in textarea");
      }
    } catch (error) {
      console.error("Error reading file", error);
    }
  }
  function copyclipboard() {
    if (jsonfiledata.length) {
      navigator.clipboard
        .writeText(jsonfiledata)
        .then(() => {
          // console.log("copied to clipboard");
          toast.success("📋Copied to clipboard!", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            // theme: "dark",
            transition: Bounce,
          });
        })
        .catch(() => {
          console.log("Failed to copy to clipboard");
        });
    } else {
      toast.error("🚫No data to copy", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        // theme: "dark",
        transition: Bounce,
      });
    }
  }
  const handleDownload = () => {
    if (jsonfiledata.length) {
      const blob = new Blob([jsonfiledata], { type: "text/plain" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      var actualfilename = filename
        .replace("C:\\", "")
        .replace("\\", "")
        .replace("fakepath", "")
        .replace(".csv", "");
      // console.log(actualfilename);
      a.download = actualfilename + ".jsonl";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      // Clean up
      URL.revokeObjectURL(url);
    } else {
      toast.error("📁🚫 No data to download", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        // theme: "dark",
        transition: Bounce,
      });
    }
  };

  return (
    <div className="w-full h-full flex flex-row justify-center items-center gap-4">
      {/* headline upload a csv file as well as */}
      {/* #3D093F #550059 #400743 */}
      <div className="w-1/2 h-full">
        <div className="w-full h-full bg-gradient-to-r from-[#3D093F] via-[#550059] to-[#400743] border-[3px] border-[#FBD187] rounded-md p-4">
          <div className="flex flex-row items-center gap-4 pb-4">
            <label
              htmlFor="csvUpload"
              className="text-white justify-start text-start"
            >
              Upload Csv File
            </label>
            <input
              type="file"
              id="csvUpload"
              accept=".csv"
              className="px-4 text-white text-clip cursor-pointer w-[50%]"
              onChange={handeluploadedfile}
              value={filename}
            />
          </div>
          <div className="flex flex-row gap-4 pb-3 items-center">
            <h1 className="text-white capitalize items-center">
              Select column for conversion?
              <span className="text-[#fbd187]"> [optional] </span>
            </h1>
            <input
              id="xyz"
              className="rounded-md border-2 border-[#FBD187] outline-[#FBD187] p-2 items-center w-[40%]"
              type="text"
              placeholder="col no start from 0"
              value={inputcolumnumber}
              onChange={(e) => setinputcolumnumber(e.target.value)}
            ></input>
          </div>
          <div className="flex justify-center items-center p-4">
            <img src={orimage} alt="or" className="w-10 h-10 mr-10"></img>
          </div>
          <div className="gap-5 flex flex-col">
            {/* <h1 className="text-white capitalize"> paste your CSV here</h1> */}
            <textarea
              id="message"
              rows={12}
              className="outline-0 border-[3px] hover:border-[3px] hover:border-[#F3C380] rounded-md p-2"
              onChange={handeltextarea}
              placeholder="Paste your CSV data here"
              value={textareadata}
            ></textarea>
          </div>
          <div className="pt-5 gap-4 flex flex-row">
            <button
              className="bg-[#e54545] hover:bg-[#b91c1c] p-2 px-4 text-white text-xl rounded-lg transition-all duration-100"
              onClick={(e) => handelConvert()}
            >
              {convertstate ? "Convert" : "In Progress..."}
            </button>
            <button
              className="bg-[#7d7e80] hover:bg-[#4e4e4f] p-2 px-4 text-white text-xl rounded-lg"
              onClick={handelclear}
            >
              Clear
            </button>
          </div>
        </div>
      </div>
      <div className="w-1/2 h-full bg-green-600">
        <div className="w-full h-full bg-gradient-to-r from-[#3D093F] via-[#550059] to-[#400743] border-[3px] border-[#FBD187] rounded-md p-4">
          <div className="p-4 gap-5 flex flex-col">
            <h1 className="text-white capitalize text-lg">your Json here</h1>
            <textarea
              id="message"
              rows={15}
              className="outline-0 border-[3px] hover:border-[3px] hover:border-[#F3C380] rounded-md disabled p-4"
              readOnly
              value={jsonfiledata}
            ></textarea>
          </div>
          <div className="p-4 gap-4 flex flex-row">
            <button
              className="bg-[#e54545] hover:bg-[#b91c1c] p-2 px-4 text-white text-xl rounded-lg"
              onClick={handleDownload}
            >
              Download
            </button>
            <button
              className="bg-[#7d7e80] hover:bg-[#4e4e4f] p-2 px-4 text-white text-xl rounded-lg"
              onClick={copyclipboard}
            >
              Copy to clipboard
            </button>
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
    </div>
  );
}

export default Formcontent;
