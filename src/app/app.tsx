import { useState } from "react";
import DynamicIdentifierForm, { FormEntry } from "./components/DynamicIdentifierForm";

const DATA_FILE_NAME = "C:\\Users\\mwest\\Documents\\repos\\poc-inventory-manager\\upc_entries.csv";

const App = () => {
  const [csvString, setCsvString] = useState(null);
  // Function to save the file locally
  const saveToCSV = (entries: FormEntry[]) => {
    const timestamp = Date.now();
    const csvContent = entries
      .filter((entry) => entry.value.length > 0)
      .map((entry) => `${entry.value},${timestamp}`);

    window.electronAPI.writeToUpcFile({
      csvLines: csvContent,
      filename: DATA_FILE_NAME,
    });

    window.electronAPI.onWriteToUpcFile((event: any, result) => {
      console.log(result);
      setCsvString(result.data.csvString);
    });
  };

  const handleFormSubmit = (fields: FormEntry[]) => {
    saveToCSV(fields); // Save data to CSV upon submit
  };

  return <>
    <div>
      <DynamicIdentifierForm submitCallback={handleFormSubmit}/>
    </div>
    {csvString}
  </>
}

export default App;