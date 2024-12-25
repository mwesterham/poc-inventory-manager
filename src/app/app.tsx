import { useState } from "react";
import DynamicIdentifierForm, { FormEntry } from "./components/DynamicIdentifierForm";

const DATA_FILE_NAME = "C:\\Users\\mwest\\Documents\\repos\\poc-inventory-manager\\upc_entries.csv";

const App = () => {
  const [csvFileContent, setCsvFileContent] = useState<string[]>(null);
  // Function to save the file locally
  const saveToCSV = (entries: FormEntry[]) => {
    const timestamp = Date.now();
    const csvContent = entries
      .filter((entry) => entry.value.length > 0)
      .map((entry) => `${entry.value},${timestamp}`);

    window.electronAPI.writeToFile({
      csvLines: csvContent,
      filename: DATA_FILE_NAME,
    });

    window.electronAPI.onWriteToFile((event: any, result) => {
      // console.log(result);
    });
  };

  // Read file locally
  const readCSV = () => {
    window.electronAPI.readFile({
      filename: DATA_FILE_NAME,
    });

    window.electronAPI.onReadFile((event: any, result) => {
      console.log(result)
      setCsvFileContent(result.lines);
    });
  };

  const handleFormSubmit = (fields: FormEntry[]) => {
    saveToCSV(fields); // Save data to CSV upon submit
    readCSV();
  };

  return <div className="p-4 space-y-4">
    <div>
      <DynamicIdentifierForm submitCallback={handleFormSubmit}/>
    </div>

    <button onClick={readCSV} className="p-2 border rounded-md">
      ReadFile
    </button>
    {csvFileContent &&
    <div className="border p-2">
      {csvFileContent.map((line) => <div>{line}</div>)}
    </div>
    }
  </div>
}

export default App;