import { Database, Filter, ListChecks, Search } from "lucide-react";

import PageHero from "../components/PageHero.jsx";
import { useI18n } from "../localization/i18n.jsx";
import RecordDetailModal from "./records/RecordDetailModal.jsx";
import RecordsFilters from "./records/RecordsFilters.jsx";
import RecordsPagination from "./records/RecordsPagination.jsx";
import RecordsTable from "./records/RecordsTable.jsx";
import { COLUMN_COUNT } from "./records/recordUtils.js";
import { useRecordsData } from "./records/useRecordsData.js";

export default function RecordsPage() {
  const { t } = useI18n();
  const {
    records,
    search,
    sourceType,
    filters,
    filterOptions,
    page,
    meta,
    loading,
    detail,
    detailLoading,
    setPage,
    handleSearch,
    handleSourceType,
    handleFilter,
    clearFilters,
    openDetail,
    closeDetail
  } = useRecordsData();

  return (
    <section className="page-stack">
      <PageHero
        kicker={t.records.heroKicker}
        title={t.records.title}
        description={t.records.description}
        icon={Database}
        stats={[
          { label: t.records.totalRecords, value: meta.count, icon: Database },
          { label: t.records.currentPage, value: records.length, icon: ListChecks },
          { label: t.common.operators, value: filterOptions.operators.length, icon: Filter },
          { label: t.records.columns, value: COLUMN_COUNT, icon: Search }
        ]}
      />

      <section className="panel">
        <RecordsFilters
          t={t}
          search={search}
          sourceType={sourceType}
          filters={filters}
          filterOptions={filterOptions}
          onSearch={handleSearch}
          onSourceTypeChange={handleSourceType}
          onFilterChange={handleFilter}
          onClearFilters={clearFilters}
        />
        <RecordsTable t={t} records={records} loading={loading} onOpenDetail={openDetail} />
        <RecordsPagination t={t} meta={meta} page={page} onPageChange={setPage} />
      </section>

      <RecordDetailModal
        t={t}
        detail={detail}
        detailLoading={detailLoading}
        onClose={closeDetail}
      />
    </section>
  );
}
