import React, { ReactNode } from "react";
 
interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="bg-black">
      <main>{children}</main>
    </div>
  );
};

export default Layout; 