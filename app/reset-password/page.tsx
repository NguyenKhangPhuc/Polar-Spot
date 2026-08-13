/**
 * PURPOSE:
 * Server Component for the password reset page.
 * Extracts email query parameter and mounts ResetPasswordClient inside an Arctic Cyber-Frost layout matching Login and Sign Up.
 *
 * CONTEXT/PARENT FILE:
 * Mounted at 'app/reset-password/page.tsx'.
 *
 * INPUTS / PARAMETERS:
 * - searchParams (Promise<{ email?: string }>): URL query parameter resolution object.
 */

import ResetPasswordClient from "./ResetPasswordClient";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Home({ searchParams }: PageProps) {
  const resolveSearchParams = await searchParams;
  const userEmail = (resolveSearchParams.email as string) || "";

  return (
    <div className="w-full min-h-screen polar-snow-bg text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 select-none font-sans relative">
      <div className="w-full max-w-xl space-y-6">
        <ResetPasswordClient email={userEmail} />
      </div>
    </div>
  );
}
