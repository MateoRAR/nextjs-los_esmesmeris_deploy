import NavBarGeneral from "@/components/nav-bar-general/NavBarGeneral"

export default function GeneralLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <NavBarGeneral/> 
      {children}
    </>
  );
}

