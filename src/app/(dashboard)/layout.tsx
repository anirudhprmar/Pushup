import DashboardSideBar from "./_components/Sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    
  return (
   <>
    <div className="flex h-screen overflow-hidden w-full">
      <DashboardSideBar />
      <main className="flex-1 overflow-y-auto">
          {children}
      </main>
    </div>
   </>
  )
}