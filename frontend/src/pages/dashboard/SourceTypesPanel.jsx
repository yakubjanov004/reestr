import { MapPinned } from "lucide-react";

export default function SourceTypesPanel({ t, mobile, internet }) {
  return (
    <section className="panel dashboard-panel split-panel">
      <div className="panel-heading split">
        <div>
          <p className="panel-kicker">{t.dashboard.sections}</p>
          <h2>{t.dashboard.mobileInternet}</h2>
        </div>
        <MapPinned size={18} />
      </div>
      <div className="type-grid dashboard-type-grid">
        <section className="type-panel mobile">
          <h2>{t.source.mobile}</h2>
          <div>
            <span>{t.dashboard.registry}</span>
            <strong>{mobile.records || 0}</strong>
          </div>
          <div>
            <span>{t.dashboard.upload}</span>
            <strong>{mobile.uploads || 0}</strong>
          </div>
          <div>
            <span>{t.dashboard.thisMonth}</span>
            <strong>{mobile.imported_this_month || 0}</strong>
          </div>
        </section>
        <section className="type-panel internet">
          <h2>{t.source.internet}</h2>
          <div>
            <span>{t.dashboard.registry}</span>
            <strong>{internet.records || 0}</strong>
          </div>
          <div>
            <span>{t.dashboard.upload}</span>
            <strong>{internet.uploads || 0}</strong>
          </div>
          <div>
            <span>{t.dashboard.thisMonth}</span>
            <strong>{internet.imported_this_month || 0}</strong>
          </div>
        </section>
      </div>
    </section>
  );
}
