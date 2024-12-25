import React, { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';

export interface FormEntry {
  id: string;
  value: string;
}

export  interface DynamicUPCFormProps {
  submitCallback?: (fields: FormEntry[]) => void;
}

const DynamicUPCForm = (props: DynamicUPCFormProps) => {
  const defaultFormValue: FormEntry = { id: uuidv4(), value: "" };
  const [formEntrys, setFormEntrys] = useState<FormEntry[]>([defaultFormValue]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const focusInput = () => {
    // Focus the last input after state updates
    setTimeout(() => {
      const lastInput = inputRefs.current[inputRefs.current.length - 1];
      if (lastInput) {
        lastInput.focus();
      }
    }, 100);
  }

  const handleInputChange = (id: string, value: string) => {
    setFormEntrys((prevFields) =>
      prevFields.map((field) =>
        field.id === id ? { ...field, value } : field
      )
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setFormEntrys((prevFields) => {
        inputRefs.current[prevFields.length] = null; // Ensure the ref array grows
        return [...prevFields, defaultFormValue];
      });

      focusInput();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    props.submitCallback(formEntrys);
    inputRefs.current.length = 0; // delete all elements
    setFormEntrys((prevFields) => {
      return [defaultFormValue];
    });
    focusInput();
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      {formEntrys.map((field, index) => (
        <div key={field.id} className="flex space-x-2">
          <input
            id={`${index}-input`}
            type="text"
            value={field.value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            onKeyDown={(e) => handleKeyPress(e)}
            placeholder={`UPC ${index + 1}`}
            ref={(el) => {
              inputRefs.current[index] = el; // Assign ref dynamically
            }}
            className="p-2 border rounded-md w-full"
          />
        </div>
      ))}
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded-md"
      >
        Submit
      </button>
    </form>
  );
};

export default DynamicUPCForm;
