import { useEffect, useRef } from "react";

type ConfirmDialogProps = {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  loadingLabel: string;
  deleting: boolean;
  error: string;
  onConfirm: () => void;
  onClose: () => void;
};

function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel,
  loadingLabel,
  deleting,
  error,
  onConfirm,
  onClose}: ConfirmDialogProps) {
    const dialogRef = useRef<HTMLDivElement>(null);
    const cancelRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
      if(isOpen) {
        cancelRef.current?.focus();
      }
    }, [isOpen]);

    useEffect(() => {
      if(deleting) {
        dialogRef.current?.focus();
      }
    }, [deleting]);

    useEffect(() => {
      function handleKeyDown(event: KeyboardEvent) {
        if (event.key === "Escape" && !deleting) {
          onClose();
        }

        if(event.key !== "Tab") {
          return;
        }

        const dialog = dialogRef.current;

        if(!dialog) {
          return;
        }

        const focusableElements = dialog.querySelectorAll<HTMLElement>(
          "button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])"
        );

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if(!firstElement || !lastElement) {
          return;
        }

        if(event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }

        if(!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }

      if (!isOpen) {
        return;
      }

      document.addEventListener("keydown", handleKeyDown);

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }, [isOpen, deleting, onClose]);

    if (!isOpen) {
      return null;
    }

    return (
      <div className="dialog-backdrop">
        <div className="dialog" ref={dialogRef} tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-labelledby="dialog-title"
          aria-describedby="dialog-message"
        >
          <h2 id="dialog-title">{title}</h2>
          <p id="dialog-message">{message}</p>
          {error && <p role="alert">{error}</p>}
          <button type="button" ref={cancelRef} onClick={onClose} disabled={deleting}>Cancel</button>
          <button type="button" onClick={onConfirm} disabled={deleting}>
            {deleting ? loadingLabel : confirmLabel}
          </button>
        </div>
      </div>
    );
}

export default ConfirmDialog