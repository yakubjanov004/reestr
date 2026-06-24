export function createDashboardModel(stats) {
  const daySeries = stats.records_by_day_30 || stats.records_by_day || [];
  const operatorRanking = stats.operator_ranking || [];
  const regionSummary = stats.region_summary || [];
  const statusSummary = stats.status_summary || [];
  const sourceSummary = Object.entries(stats.source_summary || {}).map(([sourceType, item]) => ({
    sourceType,
    ...item
  }));
  const totalRowsInFiles = Number(stats.total_rows_in_files || 0);
  const totalImportedRows = Number(stats.total_imported_rows || 0);
  const totalDuplicateRows = Number(stats.total_duplicate_rows || 0);
  const totalSkippedRows = Number(stats.total_skipped_rows || 0);
  const processedRows = totalImportedRows + totalDuplicateRows + totalSkippedRows;
  const importSuccessRate =
    processedRows > 0 ? Math.round((totalImportedRows / processedRows) * 100) : 0;

  return {
    daySeries,
    maxDay: Math.max(...daySeries.map((item) => item.count), 1),
    mobile: stats.source_summary?.mobile || {},
    internet: stats.source_summary?.internet || {},
    missingYesterday: stats.upload_alerts?.missing_yesterday || [],
    operatorRanking,
    recentBatches: stats.recent_batches || [],
    regionSummary,
    statusSummary,
    sourceSummary,
    totalSourceRecords:
      sourceSummary.reduce((sum, item) => sum + (item.records || 0), 0) || 0,
    totalRowsInFiles,
    totalImportedRows,
    totalDuplicateRows,
    totalSkippedRows,
    processedRows,
    importSuccessRate,
    topOperator: operatorRanking[0],
    topRegion: regionSummary[0],
    topStatus: statusSummary[0],
    operators: stats.operators || []
  };
}
