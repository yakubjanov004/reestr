import { useEffect, useState } from "react";

import api from "../../api/client.js";
import { EMPTY_FILTERS } from "./recordUtils.js";

export function useRecordsData() {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [sourceType, setSourceType] = useState("");
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [filterOptions, setFilterOptions] = useState({
    regions: [],
    dealers: [],
    statuses: [],
    operators: []
  });
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ count: 0, next: null, previous: null });
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    if (detail || detailLoading) {
      if (document.body.style.position !== "fixed") {
        const scrollY = window.scrollY;
        document.body.style.position = "fixed";
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = "100%";
        document.body.style.overflowY = "scroll";
      }
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflowY = "";
      if (scrollY) {
        const y = parseInt(scrollY || "0") * -1;
        const html = document.documentElement;
        const originalBehavior = html.style.scrollBehavior;
        html.style.scrollBehavior = "auto";
        window.scrollTo(0, y);
        html.style.scrollBehavior = originalBehavior;
      }
    }
  }, [detail, detailLoading]);

  useEffect(() => {
    api.get("/records/filter-options/").then((response) => {
      setFilterOptions({
        regions: response.data.regions || [],
        dealers: response.data.dealers || [],
        statuses: response.data.statuses || [],
        operators: response.data.operators || []
      });
    });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true);
      const params = {
        search,
        page,
        source_type: sourceType || undefined,
        ...Object.fromEntries(Object.entries(filters).filter(([, value]) => value))
      };
      api
        .get("/records/", { params })
        .then((response) => {
          setRecords(response.data.results || []);
          setMeta({
            count: response.data.count || 0,
            next: response.data.next,
            previous: response.data.previous
          });
        })
        .finally(() => setLoading(false));
    }, 250);

    return () => clearTimeout(timer);
  }, [search, page, sourceType, filters]);

  function handleSearch(value) {
    setSearch(value);
    setPage(1);
  }

  function handleSourceType(value) {
    setSourceType(value);
    setPage(1);
  }

  function handleFilter(field, value) {
    setFilters((current) => ({ ...current, [field]: value }));
    setPage(1);
  }

  function clearFilters() {
    setFilters(EMPTY_FILTERS);
    setSearch("");
    setSourceType("");
    setPage(1);
  }

  async function openDetail(recordId) {
    setDetailLoading(true);
    setDetail(null);
    try {
      const response = await api.get(`/records/${recordId}/`);
      setDetail(response.data);
    } finally {
      setDetailLoading(false);
    }
  }

  function closeDetail() {
    setDetail(null);
    setDetailLoading(false);
  }

  return {
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
  };
}
