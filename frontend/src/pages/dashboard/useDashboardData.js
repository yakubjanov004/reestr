import { useEffect, useState } from "react";

import api from "../../api/client.js";

export function useDashboardData(operatorId = "") {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (operatorId) {
      params.append("uploaded_by", operatorId);
    }
    
    api
      .get(`/records/stats/?${params.toString()}`)
      .then((response) => setStats(response.data))
      .finally(() => setLoading(false));
  }, [operatorId]);

  return { stats, loading };
}
