import logo from "./logo.svg";
import "./App.css";
import Formcontent from "./Formcontent";

function App() {
  return (
    <div className="bg-[#0D0E10] w-[100wh] h-[100vh] flex flex-col">
      {/* this is title of site*/}
      <div>
        <h1 className="text-white text-6xl font-bold p-6 text-center capitalize">
          Convert Csv to Json
        </h1>
      </div>
      {/* this is form */}
      <div className="w-full h-full">
        <Formcontent></Formcontent>
      </div>
    </div>
  );
}

export default App;
