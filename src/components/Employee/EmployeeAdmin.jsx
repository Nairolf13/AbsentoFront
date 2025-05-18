import React from "react";
import { useAuth } from "../../context/AuthProvider";
import ConfirmModal from "../ui/ConfirmModal";
import "../ui/animations.css";

import {
  useEmployeeAdmin,
  EmployeeSearch,
  EmployeeMobileList,
  EmployeeDesktopList,
  AddEmployeeButton,
  AddEmployeeModal,
  EditEmployeeForm
} from "./EmployeeAdminComponents";

export default function EmployeeAdmin() {
  const { user } = useAuth();
  const {
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
    csvInputRef,
    csvData,
    csvImportResult,
    csvError,
    csvSuccess,
    csvLoading,
    handleCsvDrop,
    handleCsvAdd,
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
    confirmDelete
  } = useEmployeeAdmin(user);

  return (
    <div className="flex flex-col items-center bg-accent py-12">
      <div className="w-full mx-auto relative">
        <AddEmployeeButton showAddForm={showAddForm} setShowAddForm={setShowAddForm} />
        <div className={`bg-white rounded-2xl shadow-lg px-10 py-8 border border-gray-200 transition-all duration-300 w-full max-w-[98vw] ${showAddForm ? 'opacity-40 pointer-events-none select-none' : ''}`} style={{height: 'auto', overflowY: 'visible'}}>
          <h2 className="text-2xl font-bold mb-6 text-primary text-center">Liste des employés</h2>
          <EmployeeSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} filteredEmployees={filteredEmployees} loadingEmployees={loadingEmployees} />
          {loadingEmployees ? (
            <div>Chargement…</div>
          ) : errorEmployees ? (
            <div className="text-red-500 text-center">{errorEmployees}</div>
          ) : filteredEmployees.length === 0 ? (
            <div>Il n'y a pas d'employés à afficher.</div>
          ) : (
            <>
              <EmployeeMobileList employees={filteredEmployees} onEdit={handleEdit} onDelete={handleDelete} />
              <EmployeeDesktopList employees={filteredEmployees} onEdit={handleEdit} onDelete={handleDelete} />
            </>
          )}
        </div>
        <AddEmployeeModal
          showAddForm={showAddForm}
          setShowAddForm={setShowAddForm}
          formProps={{
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
          }}
        />
      </div>
      <ConfirmModal
        open={modalDelete.open}
        onClose={() => setModalDelete({ open: false, emp: null })}
        onConfirm={confirmDelete}
        title="Confirmer la suppression"
        description={modalDelete.emp ? `Supprimer l'employé ${modalDelete.emp.prenom} ${modalDelete.emp.nom} ?` : ''}
      />
      {editEmp && (
        <EditEmployeeForm
          editEmp={editEmp}
          setEditEmp={setEditEmp}
          editError={editError}
          editSuccess={editSuccess}
          editLoading={editLoading}
          onSubmit={updateEmployee}
        />
      )}
    </div>
  );
}
