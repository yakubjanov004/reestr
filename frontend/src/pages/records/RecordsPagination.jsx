const PAGE_SIZE = 30;

export default function RecordsPagination({ t, meta, page, itemCount, onPageChange }) {
  const rangeStart = meta.count === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min((page - 1) * PAGE_SIZE + itemCount, meta.count);

  return (
    <div className="pagination records-pagination">
      <span>{rangeStart}-{rangeEnd} / {meta.count}</span>
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
