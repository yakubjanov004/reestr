import { useAuth } from "../../auth/AuthContext.jsx";
import {
  ROLE_ADMIN,
  ROLE_MANAGER,
  ROLE_OPERATOR,
  ROLE_SUPERVISOR,
  effectiveRole
} from "../../auth/roles.js";
import { useI18n } from "../../localization/i18n.jsx";
import RecordDetailModal from "./RecordDetailModal.jsx";
import RecordsFilters from "./RecordsFilters.jsx";
import RecordsPagination from "./RecordsPagination.jsx";
import RecordsTable from "./RecordsTable.jsx";
import { useRecordsData } from "./useRecordsData.js";

function resolveRecordsCopy(t, role) {
  if (role === ROLE_ADMIN) {
    return {
      title: t.records.adminTitle,
      description: t.records.adminDescription
    };
  }
  if (role === ROLE_MANAGER) {
    return {
      title: t.records.managerTitle,
      description: t.records.managerDescription
    };
  }
  if (role === ROLE_SUPERVISOR) {
    return {
      title: t.records.supervisorTitle,
      description: t.records.supervisorDescription
    };
  }
  return {
    title: t.records.operatorTitle,
    description: t.records.operatorDescription
  };
}

export default function RecordsPage() {
  const { user } = useAuth();
  const { t } = useI18n();
  const currentRole = effectiveRole(user) || ROLE_OPERATOR;
  const canUseTeamFilters = currentRole !== ROLE_OPERATOR;
  const pageCopy = resolveRecordsCopy(t, currentRole);
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
    <section className="page-stack records-page">
      <section className="panel records-table-panel">
        <RecordsFilters
          t={t}
          title={pageCopy.title}
          canUseTeamFilters={canUseTeamFilters}
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
        <RecordsPagination
          t={t}
          meta={meta}
          page={page}
          itemCount={records.length}
          onPageChange={setPage}
        />
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
