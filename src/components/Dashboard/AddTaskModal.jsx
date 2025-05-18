// Reexport from TaskComponents directory 
import { AddTaskModal as TaskModal } from "./TaskComponents";

export default function AddTaskModal(props) {
  // Cette fonction wrapper est maintenue pour la compatibilité avec le code existant
  return <TaskModal {...props} />;
}
