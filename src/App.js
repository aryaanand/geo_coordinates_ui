import './App.css';
import Axios from "axios";
import exportFromJSON from 'export-from-json'
import {useEffect, useState } from "react";
import ReactFileReader from 'react-file-reader'
function App() {
    const [csvFile, setCsvFile] = useState();
	const formData = new FormData();
	const [address, setAddress] = useState("");
	const [getCoordinates, setCoordinates] = useState(0);
	if (csvFile){
		formData.append('file', csvFile);
	}

	const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
		if (e.currentTarget.files) setCsvFile(e.currentTarget.files[0]);
	};

	const handleSubmit = (e:React.FormEvent<HTMLFormElement>) => {
	e.preventDefault();
	async function fetchcsvresponse() {
		const res:any = await Axios.post(
		'http://localhost:8000/geocoordinate/uploadcsv',
		formData,
		);
		let jsonData =  res.data;
		console.log(jsonData);
		let filename = 'download';
		let exportType = exportFromJSON.types.csv;
		exportFromJSON({data:jsonData, fileName:filename, exportType:exportType});
		}
	fetchcsvresponse();
	};

	const fetchData = () => {
		Axios.get(`http://localhost:8000/geocoordinate/place?address=${address}`).then((res) => {
			setCoordinates(res.data.coordinates);
			console.log(res.data);
		});
	};
	
  return (
    <div className="App">
      <input
	  placeholder="Ex. Bangalore, India..."
	  onChange={(event) => {
		  setAddress(event.target.value);
	  }}
	  />
	  <button onClick={fetchData}> Find Coordinates </button>
	  <h1> Coordinates are: {getCoordinates}</h1>
	  <form onSubmit={handleSubmit}>
          <input type="file" accept=".csv" onChange={handleChange} />
          <button type="submit" className="bg-blue-500 px-4 py-2 rounded-md font-semibold">Download</button>
       </form>
    </div>
  );
}

export default App;
