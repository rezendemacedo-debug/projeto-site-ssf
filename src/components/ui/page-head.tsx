import type { ReactNode } from "react";

export function PageHead({ title, hebrew, children }: { title: string; hebrew?: string; children?: ReactNode }) {
  return (
    <header className="page-head">
      <div className="wrap">
        {hebrew && <span className="he" lang="he" dir="rtl" style={{ textAlign: "left" }}>{hebrew}</span>}
        <h1>{title}</h1>
        {children && <p className="lead">{children}</p>}
      </div>
    </header>
  );
}
