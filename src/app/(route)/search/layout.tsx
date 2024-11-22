import React from "react";
import CategoryList from "./_components/CategoryList";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grid grid-cols-4">
      <div className="hidden md:block">
        {/* category */}
        <CategoryList />
      </div>
      <div className="col-span-3 w-full md:col-span-3">{children}</div>
    </div>
  );
};

export default layout;
