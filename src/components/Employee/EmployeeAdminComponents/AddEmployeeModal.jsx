import { CsvImportForm } from "./CsvImportForm";
import { AddEmployeeForm } from "./AddEmployeeForm";

export const AddEmployeeModal = ({ showAddForm, setShowAddForm, formProps }) => {
  if (!showAddForm) return null;

  const {
    singleForm,
    singleError,
    singleSuccess,
    singleLoading,
    handleSingleChange,
    handleSingleSubmit,
    
    csvInputRef,
    csvData,
    csvImportResult,
    csvError,
    csvSuccess,
    csvLoading,
    employees,
    handleCsvDrop,
    handleCsvAdd,
    handleFileInputChange
  } = formProps;

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl px-8 py-10 w-full max-w-2xl mx-auto relative animate-fade-in">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl font-bold"
          onClick={() => setShowAddForm(false)}
          aria-label="Fermer"
        >×</button>
        
        <CsvImportForm 
          csvInputRef={csvInputRef}
          csvData={csvData}
          csvImportResult={csvImportResult}
          csvError={csvError}
          csvSuccess={csvSuccess}
          csvLoading={csvLoading}
          employees={employees}
          handleCsvDrop={handleCsvDrop}
          handleCsvAdd={handleCsvAdd}
          handleFileInputChange={handleFileInputChange}
        />
        
        <AddEmployeeForm 
          singleForm={singleForm}
          singleError={singleError}
          singleSuccess={singleSuccess}
          singleLoading={singleLoading}
          handleSingleChange={handleSingleChange}
          handleSingleSubmit={handleSingleSubmit}
        />
      </div>
    </div>
  );
};
