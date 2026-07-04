import { X } from "lucide-react";
import Button from "./Button.jsx";
import styles from "./Modal.module.css";

const Modal = ({ children, isOpen, onClose, title }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.overlay} role="presentation">
      <section className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <header className={styles.header}>
          <h2 id="modal-title">{title}</h2>
          <Button type="button" variant="ghost" size="icon" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </Button>
        </header>
        {children}
      </section>
    </div>
  );
};

export default Modal;
