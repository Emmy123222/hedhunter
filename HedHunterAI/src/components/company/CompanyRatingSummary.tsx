import { Star } from "lucide-react";

interface RatingBreakdown {
  total: number;
  average: number;
  distribution: Record<number, number>;
}

export function CompanyRatingSummary({ total, average, distribution }: RatingBreakdown) {
  return (
    <div className="space-y-4">
      <div className="flex items-end gap-3">
        <span className="text-4xl font-bold" style={{ color: "#0f172a" }}>{average.toFixed(1)}</span>
        <div className="pb-1">
          <StarRow rating={Math.round(average)} />
          <p className="text-xs font-mono mt-1" style={{ color: "#64748b" }}>{total} review{total !== 1 ? "s" : ""}</p>
        </div>
      </div>

      {total > 0 && (
        <div className="space-y-2">
          {[5,4,3,2,1].map(star => {
            const count = distribution[star] ?? 0;
            const pct   = total > 0 ? (count / total) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-2.5">
                <span className="font-mono text-[10px] w-3 flex-none" style={{ color: "#64748b" }}>{star}</span>
                <Star size={10} style={{ color: "#f5c518", flexShrink: 0 }} fill="#f5c518"/>
                <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,.07)" }}>
                  <div className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, background: "#f5c518" }}/>
                </div>
                <span className="font-mono text-[10px] w-5 text-right flex-none" style={{ color: "#94a3b8" }}>{count}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(s => (
        <Star key={s} size={13} fill={s <= rating ? "#f5c518" : "transparent"}
          style={{ color: s <= rating ? "#f5c518" : "#94a3b8" }}/>
      ))}
    </div>
  );
}
