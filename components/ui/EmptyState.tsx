interface EmptyStateProps {
  title?: string;
  description?: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
}

export const EmptyState = ({
  title = "Sonuç bulunamadı",
  description = "Filtreleri değiştirerek tekrar deneyebilirsin.",
  ctaLabel,
  onCtaClick,
}: EmptyStateProps) => (
  <div className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
    <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
    <p className="max-w-sm text-sm text-slate-500">{description}</p>
    {ctaLabel && onCtaClick ? (
      <button
        type="button"
        className="mt-2 rounded-full bg-brand px-6 py-2 text-sm font-semibold text-white transition hover:bg-brand-muted"
        onClick={onCtaClick}
      >
        {ctaLabel}
      </button>
    ) : null}
  </div>
);

