export const statusColors = {
  "En attente": "bg-yellow-300 text-yellow-900",
  "Validée": "bg-green-400 text-white",
  "Refusée": "bg-red-400 text-white",
};

export const remplacementStatusColors = {
  "Aucun": "bg-gray-300 text-gray-700",
  "En cours": "bg-yellow-300 text-yellow-900",
  "Validé": "bg-green-400 text-white",
};

export function isImageUrl(url) {
  return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
}

export function isPdfUrl(url) {
  return /\.pdf$/i.test(url);
}

export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString();
}

export function formatTime(dateString) {
  return new Date(dateString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
