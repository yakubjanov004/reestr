import { X } from "lucide-react";
import { createPortal } from "react-dom";

import { getVisibleDetailSections } from "./recordUtils.js";

export default function RecordDetailModal({ t, detail, detailLoading, onClose }) {
  if (!detail && !detailLoading) {
    return null;
  }

  const visibleDetailSections = getVisibleDetailSections(detail, t);

  const modalContent = (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <section
        className="record-modal"
        role="dialog"
        aria-modal="true"
        aria-label={t.records.record}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-heading">
          <div>
            <span>{t.records.record}</span>
            <h2>{detail?.client_name || t.common.loading}</h2>
          </div>
          <button type="button" title={t.common.close} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {detailLoading && (
          <div className="skeleton-wrapper" style={{ padding: '20px' }}>
            <div className="skeleton-grid-2">
              <div className="skeleton-card" style={{ height: '80px' }}><div className="skeleton skeleton-title"/><div className="skeleton skeleton-text"/></div>
              <div className="skeleton-card" style={{ height: '80px' }}><div className="skeleton skeleton-title"/><div className="skeleton skeleton-text"/></div>
              <div className="skeleton-card" style={{ height: '80px' }}><div className="skeleton skeleton-title"/><div className="skeleton skeleton-text"/></div>
              <div className="skeleton-card" style={{ height: '80px' }}><div className="skeleton skeleton-title"/><div className="skeleton skeleton-text"/></div>
            </div>
          </div>
        )}

        {detail && (
          <div className="detail-sections">
            {visibleDetailSections.map((section) => (
              <section className="detail-section" key={section.title}>
                <h3>{section.title}</h3>
                <div className="detail-grid">
                  {section.fields.map((item) => (
                    <div className="detail-item" key={item.field}>
                      <span>{item.label}</span>
                      <strong>{item.value}</strong>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </section>
    </div>
  );

  return createPortal(modalContent, document.body);
}
