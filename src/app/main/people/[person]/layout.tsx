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
        <div className="flex h-screen max-h-md flex-col md:flex-row md:overflow-hidden">
            {personId !== "0" && 
              <aside className="w-full flex-none md:w-64 bg-amber-50">
                  <PersonSideNav personId={personId}/>
              </aside>
            } 
            <div className="flex-grow p-6 md:overflow-y-auto md:p-12">
                {children}
            </div>
        </div>
    );
};

export default PersonLayout;
