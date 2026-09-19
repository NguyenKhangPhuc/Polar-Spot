import VerifyAccount from "./VerifyAccountClient";
import BackButton from "@/app/components/BackButton";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Home({ searchParams }: PageProps) {
  const resolveSearchParams = await searchParams;
  const userEmail = (resolveSearchParams.email as string) || "";

  return (
    <div className="w-full min-h-screen bg-[#151312] text-[#e8e1df] font-mono flex items-center justify-center p-4 sm:p-6 lg:p-8 select-none">
      <div className="w-full max-w-md flex flex-col gap-2">
        <BackButton href="/login" label="BACK TO LOGIN" className="mb-0" />
        <VerifyAccount email={userEmail} />
      </div>
    </div>
  );
}