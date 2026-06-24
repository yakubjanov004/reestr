import { useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Database,
  FileSpreadsheet,
  Info,
  ListChecks,
  UploadCloud
} from "lucide-react";

import api from "../api/client.js";
import SourceTypeTabs from "../components/SourceTypeTabs.jsx";
import { useI18n } from "../localization/i18n.jsx";
import { formatDateTime } from "../utils/format.js";

export default function UploadPage() {
  const { t, fmt } = useI18n();
  const [file, setFile] = useState(null);
  const [sourceType, setSourceType] = useState("mobile");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  function handleFileSelection(selectedFile) {
    if (!selectedFile) {
      setFile(null);
      return;
    }

    const fileName = selectedFile.name.toLowerCase();
    if (!fileName.endsWith(".xlsx") && !fileName.endsWith(".xlsm")) {
      setFile(null);
      setError(t.upload.invalidFormat);
      return;
    }

    setFile(selectedFile);
    setError("");
  }

  function handleDrop(event) {
    event.preventDefault();
    handleFileSelection(event.dataTransfer.files?.[0] || null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!file) {
      setError(t.upload.fileRequired);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("source_type", sourceType);
    setUploading(true);
    setError("");
    setResult(null);

    try {
      const response = await api.post("/records/upload/", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setResult(response.data);
      setFile(null);
      event.target.reset();
    } catch {
      setError(t.upload.uploadError);
    } finally {
      setUploading(false);
    }
  }

  const resultMetrics = result
    ? [
        { label: t.upload.imported, value: result.imported_count, tone: "success" },
        { label: t.upload.duplicate, value: result.duplicate_count, tone: "neutral" },
        { label: t.upload.skipped, value: result.skipped_count, tone: "warning" },
        { label: t.upload.issues, value: result.import_errors?.length || 0, tone: "danger" }
      ]
    : [];
  const sourceTypeLabels = {
    mobile: t.source.mobile,
    internet: t.source.internet
  };
  const importSteps = t.upload.steps.map((step, index) => ({
    ...step,
    icon: [ListChecks, FileSpreadsheet, Database][index]
  }));

  return (
    <section className={`upload-page${result ? " has-result" : ""}`}>
      <div className="upload-shell">
        <aside className="upload-brief">
          <h2>{t.upload.briefTitle}</h2>
          <p>
            {t.upload.briefText}
          </p>

          <div className="upload-step-list">
            {importSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div className="upload-step" key={step.label}>
                  <span className="upload-step-index">{index + 1}</span>
                  <span className="upload-step-icon">
                    <Icon size={17} />
                  </span>
                  <span>
                    <strong>{step.label}</strong>
                    <small>{step.text}</small>
                  </span>
                </div>
              );
            })}
          </div>

          <div className="upload-note">
            <Info size={17} />
            <span>
              {t.upload.note}
            </span>
          </div>
        </aside>

        <section className="panel upload-panel">
          <form className="upload-form" onSubmit={handleSubmit}>
            <div className="form-block upload-source-block">
              <div className="source-block-header">
                <span className="field-title">REESTR TURI</span>
              </div>
              <SourceTypeTabs value={sourceType} onChange={setSourceType} />
            </div>

            <label
              className={`file-drop${file ? " has-file" : ""}`}
              onDragOver={(event) => event.preventDefault()}
              onDrop={handleDrop}
            >
              <span className="file-drop-icon">
                <UploadCloud size={80} />
              </span>
              <div className="file-info">
                <span>{file ? file.name : "Excel faylini shu yerga tashlang yoki bosing"}</span>
                <small>
                  {file
                    ? `${(file.size / 1024).toFixed(1)} KB`
                    : "Ruxsat etilgan formatlar: .xlsx, .xlsm"}
                </small>
              </div>
              <input
                type="file"
                accept=".xlsx,.xlsm"
                onChange={(event) => handleFileSelection(event.target.files?.[0] || null)}
              />
            </label>

            {error && (
              <div className="form-error upload-error">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <button className="primary-button upload-submit" type="submit" disabled={uploading}>
              <Database size={18} />
              <span>{uploading ? t.upload.uploading : "Bazaga yuklash"}</span>
            </button>
          </form>
        </section>
      </div>

      {result && (
        <section className="panel upload-result-panel">
          <div className="result-success-banner">
            <CheckCircle2 size={22} />
            <div>
              <strong>{t.upload.done}</strong>
              <span>{result.original_filename}</span>
            </div>
          </div>

          <div className="result-metrics">
            {resultMetrics.map((metric) => (
              <div className={`result-metric ${metric.tone}`} key={metric.label}>
                <span>{metric.label}</span>
                <strong>{metric.value}</strong>
              </div>
            ))}
          </div>

          <div className="result-grid upload-result-grid">
            <div>
              <span>{t.common.file}</span>
              <strong>{result.original_filename}</strong>
            </div>
            <div>
              <span>{t.common.type}</span>
              <strong>{sourceTypeLabels[result.source_type] || result.source_type}</strong>
            </div>
            <div>
              <span>{t.common.date}</span>
              <strong>{formatDateTime(result.created_at)}</strong>
            </div>
          </div>

          {result.import_errors?.length > 0 && (
            <div className="issue-list">
              <h3>
                <AlertTriangle size={17} />
                {t.upload.issueTitle}
              </h3>
              {result.import_errors.map((issue) => (
                <div className="issue-row" key={`${issue.row}-${issue.reason}`}>
                  <strong>{issue.row}-{t.upload.rowSuffix}</strong>
                  <span>{issue.reason}</span>
                  <small>{[issue.client_name, issue.identifier].filter(Boolean).join(" / ")}</small>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </section>
  );
}
