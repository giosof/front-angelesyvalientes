'use client';

import PersonSideNav from "@/app/components/personSideNav";
import { useParams } from "next/navigation";

export default function PersonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const personId = params.person as string;

  return (
    <div className="flex max-h flex-col md:flex-row md:overflow-hidden">
      {personId !== "0" && 
        <aside className="w-full flex-shrink-0 md:w-64 bg-amber-50 ">
          <PersonSideNav personId={personId}/>
        </aside>
      } 
      <div className="flex-grow p-6 md:p-12 ">
        {children}
      </div>
    </div>
  );
}
