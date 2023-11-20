import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Loading from "@/components/Loading";
import MeanContent from "@/components/MeanContent";
import InjuryListTable from "@/components/InjuryListTable";
import React from "react";
import { useUser } from "@auth0/nextjs-auth0/client";

export default function Home() {
  const { user, error: userError, isLoading } = useUser();
  if (isLoading) return <Loading />;

  return (
    <main>
      <Header />
      {!user ? <MeanContent /> : <InjuryListTable />}
      <Footer />
    </main>
  );
}
