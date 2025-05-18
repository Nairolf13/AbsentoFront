import { useState } from "react";

export const useFormVisibility = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  
  return {
    showAddForm,
    setShowAddForm
  };
};
