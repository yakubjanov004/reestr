import { Users, UploadCloud, Database, Activity, UserCircle } from "lucide-react";

export default function OperatorListPanel({ t, operators }) {
  if (!operators || operators.length === 0) return null;

  return (
    <section className="panel dashboard-panel premium-operator-panel" style={{ 
      gridColumn: '1 / -1', 
      borderRadius: '16px', 
      border: 'none', 
      boxShadow: '0 4px 12px rgba(21, 32, 55, 0.04)', 
      background: '#ffffff',
      overflow: 'hidden'
    }}>
      <div className="panel-heading split" style={{ padding: '20px 24px 16px', borderBottom: '1px solid #f1f5f9' }}>
        <div>
          <p className="panel-kicker" style={{ color: 'var(--primary)', fontWeight: '700', letterSpacing: '0.05em', marginBottom: '2px', fontSize: '11px' }}>{t.dashboard.team}</p>
          <h2 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--ink)' }}>{t.dashboard.operatorRatingStats}</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--primary-light)', padding: '6px 12px', borderRadius: '8px', color: 'var(--primary)' }}>
          <Users size={14} strokeWidth={2.5} />
          <span style={{ fontWeight: '700', fontSize: '12px' }}>{operators.length} {t.dashboard.employeeWord}</span>
        </div>
      </div>
      
      <div className="table-wrap premium-table-wrap" style={{ padding: '0 16px 12px' }}>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 4px' }}>
          <thead>
            <tr>
              <th style={{ padding: '12px 16px', color: '#8a95a8', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t.common.operator}</th>
              <th style={{ padding: '12px 16px', textAlign: 'center', color: '#8a95a8', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t.common.status}</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', color: '#8a95a8', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t.dashboard.uploads}</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', color: '#8a95a8', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t.dashboard.enteredCount}</th>
            </tr>
          </thead>
          <tbody>
            {operators.map((op) => (
              <tr key={op.id} style={{ transition: 'all 0.2s ease' }} className="operator-row-hover">
                <td style={{ padding: '10px 16px', background: '#f8fafc', borderRadius: '8px 0 0 8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <UserCircle size={18} strokeWidth={2} />
                    </div>
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '13px', color: 'var(--ink)' }}>{op.full_name || op.username}</div>
                      {op.full_name && op.full_name !== op.username && (
                        <div style={{ fontSize: '11px', color: '#8a95a8', marginTop: '1px', fontWeight: '500' }}>
                          @{op.username}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td style={{ padding: '10px 16px', background: '#f8fafc', textAlign: 'center' }}>
                  <span style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '4px', 
                    padding: '4px 10px', 
                    borderRadius: '12px', 
                    fontSize: '11px', 
                    fontWeight: '700',
                    background: op.is_active ? '#e0f2fe' : '#f1f5f9',
                    color: op.is_active ? '#0284c7' : '#94a3b8'
                  }}>
                    {op.is_active && <Activity size={12} strokeWidth={3} />}
                    {op.is_active ? t.common.active : t.monitoring.inactive}
                  </span>
                </td>
                <td style={{ padding: '10px 16px', background: '#f8fafc', textAlign: 'right' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                    <span style={{ fontWeight: '700', fontSize: '14px', color: 'var(--ink)' }}>{op.uploads_count.toLocaleString()}</span>
                    <UploadCloud size={14} color="#94a3b8" />
                  </div>
                </td>
                <td style={{ padding: '10px 16px', background: '#f8fafc', textAlign: 'right', borderRadius: '0 8px 8px 0' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--primary)', color: 'white', padding: '4px 10px', borderRadius: '8px' }}>
                    <Database size={12} />
                    <span style={{ fontWeight: '700', fontSize: '13px' }}>{op.records_count.toLocaleString()}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <style>{`
        .operator-row-hover:hover td {
          background: #f1f5f9 !important;
        }
      `}</style>
    </section>
  );
}
