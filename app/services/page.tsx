// ServicesPage.js (Server Component)
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import ClientServicesPage from "./ClientServicesPage";

export default async function ServicesPage() {
  const session = await getServerSession(authOptions);
  
  // Pass the session to the client component
  return <ClientServicesPage session={session} />;
}