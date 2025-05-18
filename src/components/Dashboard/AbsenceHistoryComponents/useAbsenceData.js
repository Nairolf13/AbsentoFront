import { useState, useEffect } from 'react';
import { getMyAbsences, getAllAbsences, validateAbsence, refuseAbsence, deleteAbsence } from '../../../api/absento';
import { fetchEmployees } from '../../../api/employees';
import { proposerRemplacant } from '../../../api/remplacement';

export function useAbsenceData(user) {
  const [absences, setAbsences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAbsence, setSelectedAbsence] = useState(null);
  const [remplacantId, setRemplacantId] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [justificatifPreview, setJustificatifPreview] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    loadAbsences();
  }, [user]);

  const loadAbsences = async () => {
    setLoading(true);
    setError(null);
    try {
      const privilegedRoles = ["ADMIN", "RH", "MANAGER"];
      const fetchAbsences = privilegedRoles.includes(user?.role)
        ? getAllAbsences
        : getMyAbsences;
      const data = await fetchAbsences();
      setAbsences(data);
    } catch (e) {
      setError(e?.response?.data?.error || e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = async (id) => {
    try {
      const { absence } = await validateAbsence(id);
      setAbsences(absences => absences.map(a => a.id === id ? { ...a, status: absence.status } : a));
      refreshAbsenceCounter();
    } catch (e) {
      alert("Erreur lors de la validation : " + (e?.response?.data?.error || e.message));
    }
  };

  const handleRefuse = async (id) => {
    try {
      const { absence } = await refuseAbsence(id);
      setAbsences(absences => absences.map(a => a.id === id ? { ...a, status: absence.status } : a));
      refreshAbsenceCounter();
    } catch (e) {
      alert("Erreur lors du refus : " + (e?.response?.data?.error || e.message));
    }
  };

  const handleOpenModifier = async (absence) => {
    setSelectedAbsence(absence);
    setRemplacantId("");
    try {
      const emps = await fetchEmployees();
      setEmployees(emps);
    } catch (e) {
      setEmployees([]);
    }
  };

  const handleChangeRemplacant = async () => {
    if (!remplacantId) return;
    setActionLoading(true);
    try {
      await proposerRemplacant(selectedAbsence.id, remplacantId);
      setAbsences(absences => absences.map(a =>
        a.id === selectedAbsence.id
          ? { ...a, remplacement: { ...a.remplacement, remplacant: employees.find(e => e.id === Number(remplacantId)) } }
          : a
      ));
      setSelectedAbsence(null);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteAbsence = async (id) => {
    setDeleteLoading(true);
    try {
      await deleteAbsence(id);
      setAbsences(absences => absences.filter(a => a.id !== id));
      refreshAbsenceCounter();
    } catch (e) {
      alert("Erreur lors de la suppression : " + (e?.response?.data?.error || e.message));
    } finally {
      setDeleteLoading(false);
      setConfirmDeleteId(null);
    }
  };

  const refreshAbsenceCounter = () => {
    window.dispatchEvent(new CustomEvent("refreshAbsenceCounter"));
  };

  return {
    absences,
    loading,
    error,
    selectedAbsence,
    setSelectedAbsence,
    remplacantId,
    setRemplacantId,
    actionLoading,
    employees,
    justificatifPreview,
    setJustificatifPreview,
    confirmDeleteId,
    setConfirmDeleteId,
    deleteLoading,
    handleValidate,
    handleRefuse,
    handleOpenModifier,
    handleChangeRemplacant,
    handleDeleteAbsence
  };
}
