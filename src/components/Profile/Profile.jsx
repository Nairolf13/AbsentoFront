import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthProvider";
import { getEntreprise, deleteEntreprise, updateEntreprise } from "../../api/entreprise";
import { updateUser, deleteUser } from "../../api/user";

export default function Profile() {
  const { user, loginUser, refreshUser } = useAuth();
  const [tab, setTab] = useState("profil");
  const [entreprise, setEntreprise] = useState(null);
  const [loadingEntreprise, setLoadingEntreprise] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editValues, setEditValues] = useState({
    nom: "",
    siret: "",
    secteur: "",
    taille: "",
    adresse: "",
    telephone: "",
    emailContact: "",
    responsablePrenom: "",
    responsableNom: "",
    emailResponsable: ""
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState(null);
  const [editUserMode, setEditUserMode] = useState(false);
  const [editUserValues, setEditUserValues] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    dateNaissance: "",
    adresse: "",
    poste: "",
    role: ""
  });
  const [editUserLoading, setEditUserLoading] = useState(false);
  const [editUserError, setEditUserError] = useState(null);
  const [deleteUserLoading, setDeleteUserLoading] = useState(false);
  const [deleteUserError, setDeleteUserError] = useState(null);
  const [deleteUserSuccess, setDeleteUserSuccess] = useState(false);
  const [editUserPassword, setEditUserPassword] = useState("");
  const [editUserPasswordConfirm, setEditUserPasswordConfirm] = useState("");
  const [editUserPasswordError, setEditUserPasswordError] = useState(null);
  const [editUserSuccess, setEditUserSuccess] = useState(false);

  const resetEditUserValues = () => {
    setEditUserValues({
      nom: user?.nom || "",
      prenom: user?.prenom || "",
      email: user?.email || "",
      telephone: user?.telephone || "",
      dateNaissance: user?.dateNaissance ? (
        user.dateNaissance.includes('T') ? 
          user.dateNaissance.split('T')[0] : 
          user.dateNaissance
      ) : "",
      adresse: user?.adresse || "",
      poste: user?.poste || "",
      role: user?.role || ""
    });
  };

  const resetEntrepriseValues = (entreprise) => {
    setEditValues({
      nom: entreprise?.nom || "",
      siret: entreprise?.siret || "",
      secteur: entreprise?.secteur || "",
      taille: entreprise?.taille || "",
      adresse: entreprise?.adresse || "",
      telephone: entreprise?.telephone || "",
      emailContact: entreprise?.emailContact || "",
      responsablePrenom: entreprise?.responsablePrenom || "",
      responsableNom: entreprise?.responsableNom || "",
      emailResponsable: entreprise?.emailResponsable || ""
    });
  };

  useEffect(() => {
    if (user && user.poste && user.poste.toUpperCase() === "RESPONSABLE" && user.entrepriseId) {
      setLoadingEntreprise(true);
      getEntreprise(user.entrepriseId)
        .then(setEntreprise)
        .finally(() => setLoadingEntreprise(false));
    }
    if (user) {
      resetEditUserValues();
    }
  }, [user]);

  useEffect(() => {
    if (!editUserMode) {
      resetEditUserValues();
    }
  }, [editUserMode]);

  useEffect(() => {
    if (entreprise && editMode) {
      resetEntrepriseValues(entreprise);
    }
  }, [entreprise, editMode]);

  const handleEditChange = (e) => {
    setEditValues({ ...editValues, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError(null);
    try {
      await updateEntreprise(entreprise.id, editValues);
      const updated = await getEntreprise(entreprise.id);
      setEntreprise(updated);
      setEditMode(false);
    } catch (err) {
      setEditError(err?.response?.data?.error || 'Erreur lors de la modification');
    } finally {
      setEditLoading(false);
    }
  };

  const handleEditUserChange = (e) => {
    setEditUserValues({ ...editUserValues, [e.target.name]: e.target.value });
  };

  const handleEditUserSubmit = async (e) => {
    e.preventDefault();
    setEditUserPasswordError(null);
    setEditUserLoading(true);
    setEditUserError(null);
    setEditUserSuccess(false);
    try {
      let motDePasse = undefined;
      if (editUserPassword || editUserPasswordConfirm) {
        if (editUserPassword !== editUserPasswordConfirm) {
          setEditUserPasswordError("Les mots de passe ne correspondent pas.");
          setEditUserLoading(false);
          return;
        }
        if (editUserPassword.length < 8) {
          setEditUserPasswordError("Le mot de passe doit contenir au moins 8 caractères.");
          setEditUserLoading(false);
          return;
        }
        motDePasse = editUserPassword;
      }
      
      let formattedDateNaissance = editUserValues.dateNaissance || "";
      if (formattedDateNaissance && formattedDateNaissance.includes('T')) {
        formattedDateNaissance = formattedDateNaissance.split('T')[0];
      }
      
      const payload = {
        nom: editUserValues.nom || "",
        prenom: editUserValues.prenom || "",
        email: editUserValues.email || "",
        telephone: editUserValues.telephone || "",
        dateNaissance: formattedDateNaissance,
        adresse: editUserValues.adresse || "",
        poste: editUserValues.poste || "",
        role: editUserValues.role || ""
      };
      if (motDePasse) payload.motDePasse = motDePasse;
      await updateUser(user.id, payload);
      setEditUserSuccess(true);
      if (motDePasse) {
        await loginUser(payload.email || user.email, motDePasse);
      } else {
        await refreshUser();
      }
      setEditUserMode(false);
      setEditUserPassword("");
      setEditUserPasswordConfirm("");
    } catch (err) {
      console.error("Erreur updateUser ou loginUser", err);
      setEditUserError(err?.message || err?.response?.data?.error || 'Erreur lors de la modification du profil');
    } finally {
      setEditUserLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer définitivement votre compte ? Cette action est irréversible.")) return;
    setDeleteUserLoading(true);
    setDeleteUserError(null);
    try {
      await deleteUser(user.id);
      setDeleteUserSuccess(true);
      setTimeout(() => {
        window.location.href = "/logout";
      }, 2000);
    } catch (e) {
      setDeleteUserError(e?.response?.data?.error || "Erreur lors de la suppression du compte");
    } finally {
      setDeleteUserLoading(false);
    }
  };

  if (!user) return <div>Chargement...</div>;

  const isResponsable = user.poste && user.poste.toUpperCase() === "RESPONSABLE";

  return (
    <div className="max-w-lg mx-auto bg-white rounded-xl shadow-md p-4 mt-4 sm:p-6 sm:mt-8 w-full max-h-[90vh] overflow-y-auto flex flex-col" style={{fontSize: '0.95rem'}}>
      {/* Titre général modal */}
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center">Profil</h1>
      {isResponsable && (
        <div className="flex gap-2 sm:gap-4 mb-4 sm:mb-6 justify-center">
          <button
            className={`px-2 sm:px-4 py-2 rounded-lg font-semibold ${tab === "profil" ? "bg-primary text-white" : "bg-gray-100 text-primary"}`}
            onClick={() => setTab("profil")}
          >
            Employé
          </button>
          <button
            className={`px-2 sm:px-4 py-2 rounded-lg font-semibold ${tab === "entreprise" ? "bg-primary text-white" : "bg-gray-100 text-primary"}`}
            onClick={() => setTab("entreprise")}
          >
            Entreprise
          </button>
        </div>
      )}
      {(!isResponsable || tab === "profil") && (
        <>
          {/* Nouveau titre pour la section employé */}
          <h2 className="text-lg font-bold mb-3 text-primary text-center">Informations de l'employé</h2>
          {editUserMode ? (
            <form onSubmit={handleEditUserSubmit} className="space-y-2 text-lg">
              {editUserError && <div className="text-red-600 mb-2">{editUserError}</div>}
              {editUserSuccess && <div className="text-green-600 mb-2">Profil modifié avec succès !</div>}
              {editUserPasswordError && <div className="text-red-600 mb-2">{editUserPasswordError}</div>}
              <div>
                <label className="font-semibold">Nom : </label>
                <input name="nom" value={editUserValues.nom || ""} onChange={handleEditUserChange} className="border rounded px-2 py-1 w-full" />
              </div>
              <div>
                <label className="font-semibold">Prénom : </label>
                <input name="prenom" value={editUserValues.prenom || ""} onChange={handleEditUserChange} className="border rounded px-2 py-1 w-full" />
              </div>
              <div>
                <label className="font-semibold">Email : </label>
                <input name="email" value={editUserValues.email || ""} onChange={handleEditUserChange} className="border rounded px-2 py-1 w-full" />
              </div>
              <div>
                <label className="font-semibold">Téléphone : </label>
                <input name="telephone" value={editUserValues.telephone || ""} onChange={handleEditUserChange} className="border rounded px-2 py-1 w-full" />
              </div>
              <div>
                <label className="font-semibold">Date de naissance : </label>
                <input 
                  name="dateNaissance" 
                  type="date" 
                  value={
                    editUserValues.dateNaissance ? (
                      editUserValues.dateNaissance.includes('T') ? 
                        editUserValues.dateNaissance.split('T')[0] : 
                        editUserValues.dateNaissance
                    ) : ""
                  } 
                  onChange={handleEditUserChange} 
                  className="border rounded px-2 py-1 w-full" 
                />
              </div>
              <div>
                <label className="font-semibold">Adresse : </label>
                <input name="adresse" value={editUserValues.adresse || ""} onChange={handleEditUserChange} className="border rounded px-2 py-1 w-full" />
              </div>
              <div>
                <label className="font-semibold">Poste : </label>
                <input name="poste" value={editUserValues.poste || ""} className="border rounded px-2 py-1 w-full bg-gray-100 cursor-not-allowed" disabled readOnly />
              </div>
              <div>
                <label className="font-semibold">Rôle : </label>
                <input name="role" value={editUserValues.role || ""} className="border rounded px-2 py-1 w-full bg-gray-100 cursor-not-allowed" disabled readOnly />
              </div>
              <div>
                <label className="font-semibold">Nouveau mot de passe : </label>
                <input name="motDePasse" type="password" value={editUserPassword} onChange={e => setEditUserPassword(e.target.value)} className="border rounded px-2 py-1 w-full" autoComplete="new-password" />
              </div>
              <div>
                <label className="font-semibold">Confirmer le mot de passe : </label>
                <input name="motDePasseConfirm" type="password" value={editUserPasswordConfirm} onChange={e => setEditUserPasswordConfirm(e.target.value)} className="border rounded px-2 py-1 w-full" autoComplete="new-password" />
              </div>
              <div className="pt-4 flex gap-2">
                <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold" disabled={editUserLoading}>{editUserLoading ? 'Enregistrement...' : 'Enregistrer'}</button>
                <button type="button" className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-lg font-bold" onClick={() => setEditUserMode(false)} disabled={editUserLoading}>Annuler</button>
              </div>
            </form>
          ) : (
            <>
              {/* Desktop/tablette : présentation classique */}
              <div className="space-y-2 text-lg">
                <div><span className="font-semibold">Nom :</span> {user.nom}</div>
                <div><span className="font-semibold">Prénom :</span> {user.prenom}</div>
                <div><span className="font-semibold">Email :</span> {user.email}</div>
                <div><span className="font-semibold">Téléphone :</span> {user.telephone}</div>
                <div><span className="font-semibold">Date de naissance :</span> {
                  user.dateNaissance && 
                  (typeof user.dateNaissance === 'string' ? 
                    new Date(user.dateNaissance).toLocaleDateString() : 
                    user.dateNaissance.toLocaleDateString())
                }</div>
                <div><span className="font-semibold">Adresse :</span> {user.adresse}</div>
                <div><span className="font-semibold">Poste :</span> {user.poste}</div>
                <div><span className="font-semibold">Rôle :</span> {user.role}</div>
              </div>
              {/* Actions : Modifier et Supprimer pour l'employé */}
              <div className="pt-8 flex flex-col gap-2">
                <button
                  className={`bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-bold w-full`}
                  onClick={() => setEditUserMode(true)}
                  disabled={deleteUserLoading}
                >
                  Modifier
                </button>
                <button
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold w-full"
                  onClick={handleDeleteUser}
                  disabled={deleteUserLoading}
                >
                  {deleteUserLoading ? "Suppression..." : "Supprimer le compte"}
                </button>
                {deleteUserError && <div className="text-red-600 mt-2">{deleteUserError}</div>}
                {deleteUserSuccess && <div className="text-green-600 mt-2">Compte supprimé avec succès.</div>}
              </div>
            </>
          )}
        </>
      )}
      {isResponsable && tab === "entreprise" && (
        <div>
          <h2 className="text-lg font-bold mb-3 text-primary text-center">Informations de l'entreprise</h2>
          {loadingEntreprise ? (
            <div>Chargement...</div>
          ) : entreprise ? (
            editMode ? (
              <form onSubmit={handleEditSubmit} className="space-y-2 text-lg">
                {editError && <div className="text-red-600 mb-2">{editError}</div>}
                <div>
                  <label className="font-semibold">Nom : </label>
                  <input name="nom" value={editValues.nom || ""} onChange={handleEditChange} className="border rounded px-2 py-1 w-full" />
                </div>
                <div>
                  <label className="font-semibold">SIRET : </label>
                  <input name="siret" value={editValues.siret || ""} onChange={handleEditChange} className="border rounded px-2 py-1 w-full" />
                </div>
                <div>
                  <label className="font-semibold">Secteur : </label>
                  <input name="secteur" value={editValues.secteur || ""} onChange={handleEditChange} className="border rounded px-2 py-1 w-full" />
                </div>
                <div>
                  <label className="font-semibold">Taille : </label>
                  <input name="taille" value={editValues.taille || ""} onChange={handleEditChange} className="border rounded px-2 py-1 w-full" />
                </div>
                <div>
                  <label className="font-semibold">Adresse : </label>
                  <input name="adresse" value={editValues.adresse || ""} onChange={handleEditChange} className="border rounded px-2 py-1 w-full" />
                </div>
                <div>
                  <label className="font-semibold">Téléphone : </label>
                  <input name="telephone" value={editValues.telephone || ""} onChange={handleEditChange} className="border rounded px-2 py-1 w-full" />
                </div>
                <div>
                  <label className="font-semibold">Email contact : </label>
                  <input name="emailContact" value={editValues.emailContact || ""} onChange={handleEditChange} className="border rounded px-2 py-1 w-full" />
                </div>
                <div>
                  <label className="font-semibold">Responsable : </label>
                  <input name="responsablePrenom" value={editValues.responsablePrenom || ""} onChange={handleEditChange} className="border rounded px-2 py-1 w-1/2 inline-block mr-2" placeholder="Prénom" />
                  <input name="responsableNom" value={editValues.responsableNom || ""} onChange={handleEditChange} className="border rounded px-2 py-1 w-1/2 inline-block" placeholder="Nom" />
                </div>
                <div>
                  <label className="font-semibold">Email responsable : </label>
                  <input name="emailResponsable" value={editValues.emailResponsable || ""} onChange={handleEditChange} className="border rounded px-2 py-1 w-full" />
                </div>
                <div className="pt-4 flex gap-2">
                  <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold" disabled={editLoading}>{editLoading ? 'Enregistrement...' : 'Enregistrer'}</button>
                  <button type="button" className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-lg font-bold" onClick={() => setEditMode(false)} disabled={editLoading}>Annuler</button>
                </div>
              </form>
            ) : (
              <div className="space-y-2 text-lg">
                <div><span className="font-semibold">Nom :</span> {entreprise.nom}</div>
                <div><span className="font-semibold">SIRET :</span> {entreprise.siret}</div>
                <div><span className="font-semibold">Secteur :</span> {entreprise.secteur}</div>
                <div><span className="font-semibold">Taille :</span> {entreprise.taille}</div>
                <div><span className="font-semibold">Adresse :</span> {entreprise.adresse}</div>
                <div><span className="font-semibold">Téléphone :</span> {entreprise.telephone}</div>
                <div><span className="font-semibold">Email contact :</span> {entreprise.emailContact}</div>
                <div><span className="font-semibold">Responsable :</span> {entreprise.responsablePrenom} {entreprise.responsableNom}</div>
                <div><span className="font-semibold">Email responsable :</span> {entreprise.emailResponsable}</div>
              </div>
            )
          ) : (
            <div className="text-red-600">Impossible de charger les informations de l'entreprise.</div>
          )}
          {/* Actions : Modifier et Supprimer */}
          <div className="pt-8 flex flex-col gap-2">
            <button
              className={`bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-bold w-full`}
              onClick={() => setEditMode((v) => !v)}
              disabled={deleteLoading}
            >
              {editMode ? "Annuler" : "Modifier"}
            </button>
            <button
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold w-full"
              onClick={async () => {
                if (!window.confirm("Êtes-vous sûr de vouloir supprimer définitivement l'entreprise et toutes les données liées ? Cette action est irréversible.")) return;
                setDeleteLoading(true);
                setDeleteError(null);
                try {
                  await deleteEntreprise(entreprise.id);
                  setDeleteSuccess(true);
                  setTimeout(() => {
                    window.location.href = "/";
                  }, 2000);
                } catch (e) {
                  setDeleteError(e?.response?.data?.error || "Erreur lors de la suppression");
                } finally {
                  setDeleteLoading(false);
                }
              }}
              disabled={deleteLoading}
            >
              {deleteLoading ? "Suppression..." : "Supprimer l'entreprise"}
            </button>
            {deleteError && <div className="text-red-600 mt-2">{deleteError}</div>}
            {deleteSuccess && <div className="text-green-600 mt-2">Entreprise supprimée avec succès.</div>}
          </div>
        </div>
      )}
    </div>
  );
}
