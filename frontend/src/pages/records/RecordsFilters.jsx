import { Search } from "lucide-react";

import CustomSelect from "../../components/CustomSelect.jsx";
import SourceTypeTabs from "../../components/SourceTypeTabs.jsx";

export default function RecordsFilters({
  t,
  title,
  canUseTeamFilters,
  search,
  sourceType,
  filters,
  filterOptions,
  onSearch,
  onSourceTypeChange,
  onFilterChange,
  onClearFilters
}) {
  const branchOptions = filterOptions.branches.filter(
    (branch) => !filters.assigned_region || String(branch.region) === String(filters.assigned_region)
  );

  return (
    <>
      <div className="panel-heading split records-filter-heading">
        <h2>{title}</h2>
        <div className="filter-bar">
          <SourceTypeTabs value={sourceType} onChange={onSourceTypeChange} includeAll />
          <label className="search-box">
            <Search size={18} />
            <input
              placeholder={t.records.searchPlaceholder}
              value={search}
              onChange={(event) => onSearch(event.target.value)}
            />
          </label>
        </div>
      </div>

      <div className="advanced-filters records-advanced-filters">
        <label>
          {t.records.importFrom}
          <input
            type="date"
            value={filters.date_from}
            onChange={(event) => onFilterChange("date_from", event.target.value)}
          />
        </label>
        <label>
          {t.records.importTo}
          <input
            type="date"
            value={filters.date_to}
            onChange={(event) => onFilterChange("date_to", event.target.value)}
          />
        </label>
        {canUseTeamFilters && filterOptions.operators.length > 0 && (
          <label>
            {t.common.operator}
            <CustomSelect
              value={filters.uploaded_by}
              onChange={(val) => onFilterChange("uploaded_by", val)}
              placeholder={t.common.all}
              options={filterOptions.operators.map((op) => ({ value: op.id, label: op.full_name }))}
            />
          </label>
        )}
        {canUseTeamFilters && filterOptions.organization_regions.length > 0 && (
          <label>
            {t.common.region}
            <CustomSelect
              value={filters.assigned_region}
              onChange={(val) => onFilterChange("assigned_region", val)}
              placeholder={t.common.all}
              options={filterOptions.organization_regions.map((region) => ({ value: region.id, label: region.name }))}
            />
          </label>
        )}
        {canUseTeamFilters && filterOptions.branches.length > 0 && (
          <label>
            {t.common.branch}
            <CustomSelect
              value={filters.assigned_branch}
              onChange={(val) => onFilterChange("assigned_branch", val)}
              placeholder={t.common.all}
              options={branchOptions.map((branch) => ({
                value: branch.id,
                label: branch.region_name ? `${branch.region_name} / ${branch.name}` : branch.name
              }))}
            />
          </label>
        )}
        <label>
          {t.records.region}
          <CustomSelect
            value={filters.region}
            onChange={(val) => onFilterChange("region", val)}
            placeholder={t.common.all}
            options={filterOptions.regions.map((r) => ({ value: r, label: r }))}
          />
        </label>
        <label>
          {t.records.dealer}
          <CustomSelect
            value={filters.dealer}
            onChange={(val) => onFilterChange("dealer", val)}
            placeholder={t.common.all}
            options={filterOptions.dealers.map((d) => ({ value: d, label: d }))}
          />
        </label>
        <label>
          {t.common.status}
          <CustomSelect
            value={filters.status}
            onChange={(val) => onFilterChange("status", val)}
            placeholder={t.common.all}
            options={filterOptions.statuses.map((s) => ({ value: s, label: s }))}
          />
        </label>
        <button className="records-clear-filter" type="button" onClick={onClearFilters}>
          {t.common.clear}
        </button>
      </div>
    </>
  );
}
