import PersonSideNav from "@/app/components/personSideNav";
import { PropsWithChildren, ReactNode } from "react";

interface PersonLayoutProps extends PropsWithChildren {
  children: ReactNode
  params: {
    person: string;
  };
}

const PersonLayout = async ({children, params}: PersonLayoutProps) => {
  const personParams = await params;
  const personId = personParams.person;
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
};

export default PersonLayout;
