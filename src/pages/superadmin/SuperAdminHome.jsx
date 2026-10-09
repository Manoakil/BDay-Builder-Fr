import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../admin/AdminLayout";
import SuperAdminDashboard from "./SuperAdminDashboard";
import GlobalUsers from "./GlobalUsers";
import OrganizationsManagement from "./OrganizationsManagement";
import PlatformAnalytics from "./PlatformAnalytics";
import GlobalAuditLogs from "./GlobalAuditLogs";
import SubscriptionManagement from "./SubscriptionManagement";

export default function SuperAdminHome() {
  return (
    <AdminLayout role="super_admin">
      <Routes>
        <Route path="/" element={<SuperAdminDashboard />} />
        <Route path="/users" element={<GlobalUsers />} />
        <Route path="/organizations" element={<OrganizationsManagement />} />
        <Route path="/analytics" element={<PlatformAnalytics />} />
        <Route path="/audit" element={<GlobalAuditLogs />} />
        <Route path="/subscriptions" element={<SubscriptionManagement />} />
        
        <Route path="*" element={<Navigate to="/super-admin" replace />} />
      </Routes>
    </AdminLayout>
  );
}
