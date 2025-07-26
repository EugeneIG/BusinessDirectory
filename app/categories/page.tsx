import { Suspense } from "react";
import CategoriesClient from "./CategoriesClient";

export default function CategoriesPage() {
  return (
    <Suspense fallback={<div>Loading categories...</div>}>
      <CategoriesClient />
    </Suspense>
  );
} 