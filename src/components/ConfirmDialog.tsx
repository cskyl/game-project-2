import { useLang } from "../i18n";

export function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel,
  danger,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  body: string;
  confirmLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const { ui } = useLang();
  if (!open) return null;
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">{title}</h2>
        <p className="modal-body">{body}</p>
        <div className="modal-actions">
          <button className="btn ghost" onClick={onCancel}>
            {ui.cancel}
          </button>
          <button className={"btn " + (danger ? "danger" : "primary")} onClick={onConfirm}>
            {confirmLabel ?? ui.confirm}
          </button>
        </div>
      </div>
    </div>
  );
}
