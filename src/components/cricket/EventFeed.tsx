export type FeedEvent = { id: number; over: string; text: string; type: "run" | "boundary" | "wicket" | "info" };

export const EventFeed = ({ events }: { events: FeedEvent[] }) => (
  <div className="nb-card p-4">
    <div className="flex items-center justify-between mb-3">
      <h3 className="font-display text-lg">BALL-BY-BALL</h3>
      <span className="nb-tag bg-nb-green">REAL-TIME</span>
    </div>
    <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
      {events.map((e) => {
        const color =
          e.type === "wicket" ? "bg-nb-red text-white" :
          e.type === "boundary" ? "bg-nb-yellow" :
          e.type === "info" ? "bg-secondary" : "bg-card";
        return (
          <div key={e.id} className={`nb-border ${color} p-2 flex gap-3 items-start animate-slide-up`}>
            <span className="font-display text-sm shrink-0 nb-border bg-background text-foreground px-2 py-0.5">
              {e.over}
            </span>
            <span className="text-sm font-semibold">{e.text}</span>
          </div>
        );
      })}
    </div>
  </div>
);
