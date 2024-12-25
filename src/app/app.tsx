import { useState } from "react";
import DynamicUPCForm, { FormEntry } from "./components/DynamicUPCForm";

const DATA_FILE_NAME = "C:\\Users\\mwest\\Documents\\repos\\poc-inventory-manager\\upc_entries.csv";

const App = () => {
  const [formEntrys, setFormEntrys] = useState<FormEntry[]>([]);

  // Function to save the file locally
  const saveToCSV = (entries: FormEntry[]) => {
    const timestamp = Date.now();
    const csvContent = entries
      .filter((entry) => entry.value.length > 0)
      .map((entry) => `${entry.value},${timestamp}`);

    window.electronAPI.writeToUpcFile({
      csvLines: csvContent,
      // filename: "C:/Users/mwest/Downloads/upc_entries.csv",
      filename: DATA_FILE_NAME,
    });

    window.electronAPI.onWriteToUpcFile((event: any, result) => {
      console.log(result);
    });
  };

  const handleFormSubmit = (fields: FormEntry[]) => {
    setFormEntrys(fields);
    saveToCSV(fields); // Save data to CSV upon submit
  };

  return <>
    <div>
      <DynamicUPCForm submitCallback={handleFormSubmit}/>
    </div>
    {formEntrys.map((entry, id) => <div id={`${id}`}>
      {entry.value}
    </div>)}
  </>
}

export default App;