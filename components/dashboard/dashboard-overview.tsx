"use client";

import { useEffect, useState } from 'react';
import { ProductList } from '@/components/dashboard/product-list';
import { ActivityLogList } from '@/components/dashboard/activity-log-list';
import { UserInfo } from '@/components/dashboard/user-info';

interface DashboardOverviewProps {
  userId: number;
}

interface DashboardData {
  totalProducts: number;
  recentProducts: any[];
  user: any;
  activityLogs: any[];
}

export default function DashboardOverview({ userId }: DashboardOverviewProps) {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalProducts: 0,
    recentProducts: [],
    user: null,
    activityLogs: [],
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch(`/api/dashboard/overview?userId=${userId}`);
        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, [userId]);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="p-4 bg-white rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Total Products</h2>
        <p className="text-2xl font-bold">{dashboardData.totalProducts}</p>
      </div>
      <div className="p-4 bg-white rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Recent Products</h2>
        <ProductList products={dashboardData.recentProducts} />
      </div>
      <div className="p-4 bg-white rounded shadow">
        <h2 className="text-lg font-semibold mb-2">User Information</h2>
        <UserInfo user={dashboardData.user} />
      </div>
      <div className="p-4 bg-white rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Recent Activity</h2>
        <ActivityLogList logs={dashboardData.activityLogs} />
      </div>
    </div>
  );
}
