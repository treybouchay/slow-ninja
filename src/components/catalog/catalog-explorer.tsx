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
    <>
      {view === "starlane" && <StarlaneView />}
      {view === "constellation" && <ConstellationView />}
      {view === "diagonal-lane" && <DiagonalLaneView />}
      {view === "shelf" && <ShelfView />}
      {view === "diagonal-case" && <DiagonalCaseView />}
      {view === "file-case" && <FileCaseView />}
    </>
  );
}
