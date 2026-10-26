import React from "react";
import prisma from "@/lib/prisma";
import AdminSettingsClient from "@/components/AdminSettingsClient";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settingsList = await prisma.siteSetting.findMany();

  const settingsMap = settingsList.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  return <AdminSettingsClient initialSettings={settingsMap} />;
}
