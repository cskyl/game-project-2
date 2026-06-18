export type Severity = "good" | "normal" | "warn" | "danger";

export function StatBar({
  label,
  value,
  min = 0,
  max = 100,
  severity,
  hint,
  delta,
}: {
  label: string;
  value: number;
  min?: number;
  max?: number;
  severity: Severity;
  hint?: string;
  delta?: number;
}) {
  const pct = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
  return (
    <div className="statbar" title={hint}>
      <div className="statbar-head">
        <span className="statbar-label">{label}</span>
        <span className="statbar-value">
          {value}
          {delta ? (
            <em className={delta > 0 ? "d-up" : "d-down"}>
              {" "}
              {delta > 0 ? "+" : ""}
              {delta}
            </em>
          ) : null}
        </span>
      </div>
      <div
        className="statbar-track"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-label={label}
      >
        <div className={"statbar-fill sev-" + severity} style={{ width: pct + "%" }} />
      </div>
    </div>
  );
}
