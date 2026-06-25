import { Layers, Smartphone, Wifi } from "lucide-react";

import { useI18n } from "../localization/i18n.jsx";

export default function SourceTypeTabs({ value, onChange, includeAll = false }) {
  const { t } = useI18n();
  const allOptions = [
    { value: "", label: t.source.all, icon: Layers },
    { value: "mobile", label: t.source.mobile, icon: Smartphone },
    { value: "internet", label: t.source.internet, icon: Wifi }
  ];
  const uploadOptions = allOptions.slice(1);
  const options = includeAll ? allOptions : uploadOptions;

  return (
    <div className="source-tabs" role="group">
      {options.map((option) => {
        const Icon = option.icon;
        return (
          <button
            className={value === option.value ? "active" : ""}
            key={option.value}
            type="button"
            data-value={option.value}
            title={option.label}
            onClick={() => onChange(option.value)}
          >
            <Icon size={17} />
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
