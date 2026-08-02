import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { PropsWithChildren } from "react";

import { GuardedAuthContextProvider } from "@/contexts/AuthContext";
import { auth } from "@/lib/auth";

export default async function AuthenticatedLayout({ children }: Readonly<PropsWithChildren>) {
  const data = await auth.api.getSession({
    headers: await headers(),
  });

  if (data?.user) {
    return (
      <GuardedAuthContextProvider value={{ user: data.user }}>
        {children}
      </GuardedAuthContextProvider>
    );
  }
  return redirect("/login");
}
