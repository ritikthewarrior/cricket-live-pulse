export const WicketBanner = ({ playerName, onClose }: { playerName: string; onClose: () => void }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm animate-pop-in"
    onClick={onClose}
  >
    <div className="text-center px-6">
      <div className="inline-block bg-nb-red text-white nb-border-thick nb-shadow-lg px-8 md:px-16 py-6 md:py-10 -rotate-2 animate-shake">
        <div className="font-display text-6xl md:text-9xl leading-none">WICKET!</div>
        <div className="font-display text-xl md:text-3xl mt-2">{playerName} OUT</div>
      </div>
      <div className="mt-6 inline-block nb-border bg-nb-yellow px-4 py-2 nb-shadow-sm rotate-2 font-bold uppercase">
        Tap anywhere to continue
      </div>
    </div>
  </div>
);
