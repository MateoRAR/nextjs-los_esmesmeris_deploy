import NavBarLanding from "@/components/nav-bar-landing/NavBarLanding"

export default function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <NavBarLanding/> 
      {children}
    </>
  );
}
