import React from "react";
import {
  Spinner,
  PageLoader,
  InlineLoader,
  ButtonLoader,
  CardSkeleton,
  BlogCardSkeleton,
  TextSkeleton,
  AvatarSkeleton,
} from "./index";

// Example component showing all loader types
const LoaderExamples: React.FC = () => {
  return (
    <div className="p-8 space-y-8">
      <h2 className="text-2xl font-bold mb-4">Loader Components Examples</h2>

      {/* Spinner Examples */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Spinners</h3>
        <div className="flex items-center gap-4">
          <Spinner size="sm" color="brand-green" />
          <Spinner size="md" color="brand-purple" />
          <Spinner size="lg" color="primary" />
          <Spinner size="xl" color="secondary" />
        </div>
      </section>

      {/* Page Loader Example */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Page Loader</h3>
        <div className="border rounded-lg p-4 h-32">
          <PageLoader message="Loading content..." size="md" />
        </div>
      </section>

      {/* Inline Loader Examples */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Inline Loaders</h3>
        <div className="space-y-4">
          <InlineLoader text="Processing..." size="sm" />
          <InlineLoader
            text="Saving changes..."
            size="md"
            color="brand-purple"
          />
        </div>
      </section>

      {/* Button Loader Example */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Button Loader</h3>
        <ButtonLoader
          loading={true}
          className="bg-brand-green text-white px-4 py-2 rounded"
        >
          Submit
        </ButtonLoader>
      </section>

      {/* Skeleton Examples */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Skeleton Loaders</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <CardSkeleton />
          <BlogCardSkeleton />
          <div className="space-y-4">
            <AvatarSkeleton size="lg" />
            <TextSkeleton lines={3} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default LoaderExamples;
