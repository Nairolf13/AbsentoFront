import { useEmployeeList } from './hooks/useEmployeeList';
import { useEmployeeEdit } from './hooks/useEmployeeEdit';
import { useEmployeeDelete } from './hooks/useEmployeeDelete';
import { useCsvImport } from './hooks/useCsvImport';
import { useEmployeeAdd } from './hooks/useEmployeeAdd';
import { useFormVisibility } from './hooks/useFormVisibility';

export const useEmployeeAdmin = (user) => {
  const {
    employees,
    setEmployees,
    loadingEmployees,
    errorEmployees,
    searchTerm,
    setSearchTerm,
    filteredEmployees,
    fetchEmployees
  } = useEmployeeList(user);

  const { showAddForm, setShowAddForm } = useFormVisibility();
  
  const {
    singleForm,
    singleError,
    singleSuccess,
    singleLoading,
    handleSingleChange,
    handleSingleSubmit
  } = useEmployeeAdd(fetchEmployees, setShowAddForm);
  
  const {
    csvError,
    csvSuccess,
    csvLoading,
    csvData,
    csvImportResult,
    csvInputRef,
    handleCsvDrop,
    handleCsvAdd,
    handleFileInputChange
  } = useCsvImport(fetchEmployees);
  
  const {
    editEmp,
    setEditEmp,
    editError,
    editSuccess,
    editLoading,
    handleEdit,
    updateEmployee
  } = useEmployeeEdit(fetchEmployees);
  
  const {
    modalDelete,
    setModalDelete,
    handleDelete,
    confirmDelete
  } = useEmployeeDelete(setEmployees);

  return {
    employees,
    loadingEmployees,
    errorEmployees,
    searchTerm,
    setSearchTerm,
    filteredEmployees,
    
    showAddForm,
    setShowAddForm,
    singleForm,
    singleError,
    singleSuccess,
    singleLoading,
    handleSingleChange,
    handleSingleSubmit,
    
    csvError,
    csvSuccess,
    csvLoading,
    csvData,
    csvImportResult,
    handleCsvDrop,
    handleCsvAdd,
    csvInputRef,
    handleFileInputChange,
    
    editEmp,
    setEditEmp,
    editError,
    editSuccess,
    editLoading,
    handleEdit,
    updateEmployee,
    
    modalDelete,
    setModalDelete,
    handleDelete,
    confirmDelete,
    
    fetchEmployees
  };
};
