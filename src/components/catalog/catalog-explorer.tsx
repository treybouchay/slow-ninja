"use client";

import {
  CatalogViewProvider,
  useCatalogView,
} from "@/components/catalog/catalog-view-picker";
import { ConstellationView } from "@/components/catalog/views/constellation";
import { DiagonalCaseView } from "@/components/catalog/views/diagonal-case";
import { DiagonalLaneView } from "@/components/catalog/views/diagonal-lane";
import { FileCaseView } from "@/components/catalog/views/file-case";
import { ShelfView } from "@/components/catalog/views/shelf";
import { StarlaneView } from "@/components/catalog/views/starlane";

export function CatalogExplorer() {
  return (
    <CatalogViewProvider>
      <CatalogStage />
    </CatalogViewProvider>
  );
}

function CatalogStage() {
  const { view } = useCatalogView();

  return (
    <div className="relative">
      <div aria-hidden className="page-seam-fall pointer-events-none absolute inset-x-0 top-0 z-30 h-24" />
      {view === "starlane" && <StarlaneView />}
      {view === "constellation" && <ConstellationView />}
      {view === "diagonal-lane" && <DiagonalLaneView />}
      {view === "shelf" && <ShelfView />}
      {view === "diagonal-case" && <DiagonalCaseView />}
      {view === "file-case" && <FileCaseView />}
    </div>
  );
}
