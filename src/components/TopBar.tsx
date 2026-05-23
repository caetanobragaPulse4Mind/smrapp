import { Link } from "@tanstack/react-router";

export function TopBar({ children }: { children?: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-30 bg-topbar text-topbar-foreground">
      <div className="flex h-12 items-center gap-4 px-4">
        <Link to="/" className="font-semibold tracking-tight">
          SMR <span className="text-topbar-foreground/70 font-normal">Perícia Contábil</span>
        </Link>
        <div className="flex-1">{children}</div>
      </div>
    </header>
  );
}
