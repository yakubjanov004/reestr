import { useEffect, useState } from "react";

import api from "../../api/client.js";

export function useDashboardData(operatorId = "", organizationFilters = {}) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (operatorId) {
      params.append("uploaded_by", operatorId);
    }
    if (organizationFilters.assigned_region) {
      params.append("assigned_region", organizationFilters.assigned_region);
    }
    if (organizationFilters.assigned_branch) {
      params.append("assigned_branch", organizationFilters.assigned_branch);
    }
    
    api
      .get(`/records/stats/?${params.toString()}`)
      .then((response) => setStats(response.data))
      .finally(() => setLoading(false));
  }, [operatorId, organizationFilters.assigned_region, organizationFilters.assigned_branch]);

  return { stats, loading };
}
