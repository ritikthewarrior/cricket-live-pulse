export type Notif = { id: number; text: string; tone: "alert" | "info" | "success" };

export const Notifications = ({ items }: { items: Notif[] }) => (
  <div className="fixed top-4 right-4 z-40 space-y-2 w-72 max-w-[calc(100vw-2rem)]">
    {items.map((n) => {
      const c = n.tone === "alert" ? "bg-nb-red text-white" : n.tone === "success" ? "bg-nb-green" : "bg-nb-yellow";
      return (
        <div key={n.id} className={`nb-border-thick ${c} p-3 nb-shadow-sm animate-slide-up font-bold text-sm`}>
          {n.text}
        </div>
      );
    })}
  </div>
);
