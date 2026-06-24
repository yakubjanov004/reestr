export default function RecordsPagination({ t, meta, page, onPageChange }) {
  return (
    <div className="pagination">
      <span>{t.common.total}: {meta.count}</span>
      <div>
        <button type="button" disabled={!meta.previous} onClick={() => onPageChange(page - 1)}>
          {t.common.previous}
        </button>
        <strong>{page}</strong>
        <button type="button" disabled={!meta.next} onClick={() => onPageChange(page + 1)}>
          {t.common.next}
        </button>
      </div>
    </div>
  );
}
