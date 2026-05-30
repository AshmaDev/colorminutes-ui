export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border/60 bg-white">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-center px-6">
        <p className="text-sm text-muted-foreground">
          © {year} ColorMinutes. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
