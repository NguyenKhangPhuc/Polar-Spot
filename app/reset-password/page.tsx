import ResetPasswordClient from "./ResetPasswordClient";
import BackButton from "@/app/components/BackButton";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Home({ searchParams }: PageProps) {
  const resolveSearchParams = await searchParams;
  const userEmail = (resolveSearchParams.email as string) || "";

  return (
    <div className="w-full min-h-screen polar-snow-bg text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 select-none font-sans relative">
      <div className="w-full max-w-md space-y-4">
        <BackButton href="/login" label="BACK TO LOGIN" />
        <ResetPasswordClient email={userEmail} />
      </div>
    </div>
  );
}
