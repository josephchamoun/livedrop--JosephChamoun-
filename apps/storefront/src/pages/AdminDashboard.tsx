/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Card, CardContent } from "../components/atoms/DashboardCard";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid,
} from "recharts";
import { getDashboardMetrics } from "../lib/api";
import { MainLayout } from "../components/templates/MainLayout";

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
];

interface DashboardMetrics {
  business: {
    totalRevenue: number;
    totalOrders: number;
    avgOrderValue: number;
    ordersByStatus: Array<{ status: string; count: number }>;
  };
  performance: {
    avgLatency: number;
    activeSSEConnections: number;
    failedRequests: number;
    llmAvgResponseTime?: number;
  };
  assistant: {
    totalQueries: number;
    intentDistribution: Array<{ intent: string; count: number }>;
    functionFrequency: Array<{ function: string; count: number }>;
    avgResponseTimeByIntent?: Array<{
      intent: string;
      avgResponseTime: number;
      count: number;
    }>;
  };
  health: {
    dbStatus: string;
    llmStatus: string;
    lastUpdate?: string;
  };
  revenue: Array<{ date: string; revenue: number; orderCount: number }>;
}

export default function Dashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    async function fetchMetrics() {
      try {
        setLoading(true);
        const res = await getDashboardMetrics();
        setMetrics(res);
        setLastUpdate(new Date());
        setError(null);
      } catch (err: any) {
        console.error("Failed to fetch dashboard metrics:", err);
        setError(err.message || "Failed to load metrics");
      } finally {
        setLoading(false);
      }
    }

    fetchMetrics();

    // Auto-refresh every 10 seconds
    const interval = setInterval(fetchMetrics, 10000);

    return () => clearInterval(interval);
  }, []);

  if (loading && !metrics) {
    return (
      <MainLayout>
        <div className="p-6 flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <div className="text-lg text-gray-600">Loading dashboard...</div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            <strong>Error:</strong> {error}
            <button
              onClick={() => window.location.reload()}
              className="ml-4 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
            >
              Retry
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!metrics) {
    return (
      <MainLayout>
        <div className="p-6 text-center text-gray-600">
          No metrics available
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-1">Real-time system monitoring</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </p>
            <p className="text-xs text-gray-400">Auto-refresh: 10s</p>
          </div>
        </div>

        {/* ========== SYSTEM HEALTH STATUS BAR ========== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Database
                  </h3>
                  <p className="text-lg font-semibold text-gray-900">
                    {metrics.health.dbStatus}
                  </p>
                </div>
                <div
                  className={`w-4 h-4 rounded-full ${
                    metrics.health.dbStatus === "Connected"
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    LLM Service
                  </h3>
                  <p className="text-lg font-semibold text-gray-900">
                    {metrics.health.llmStatus}
                  </p>
                </div>
                <div
                  className={`w-4 h-4 rounded-full ${
                    metrics.health.llmStatus === "Online"
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Active SSE
                  </h3>
                  <p className="text-lg font-semibold text-gray-900">
                    {metrics.performance.activeSSEConnections}
                  </p>
                </div>
                <div className="text-2xl">📡</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ========== 1️⃣ BUSINESS METRICS ========== */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            📊 Business Metrics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Total Revenue */}
            <Card>
              <CardContent>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Total Revenue
                </h3>
                <p className="text-3xl font-bold text-green-600">
                  ${metrics.business.totalRevenue.toFixed(2)}
                </p>
              </CardContent>
            </Card>

            {/* Total Orders */}
            <Card>
              <CardContent>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Total Orders
                </h3>
                <p className="text-3xl font-bold text-blue-600">
                  {metrics.business.totalOrders}
                </p>
              </CardContent>
            </Card>

            {/* Avg Order Value */}
            <Card>
              <CardContent>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Avg Order Value
                </h3>
                <p className="text-3xl font-bold text-purple-600">
                  ${metrics.business.avgOrderValue.toFixed(2)}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Revenue Chart & Orders by Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Revenue Chart */}
          <Card>
            <CardContent>
              <h2 className="text-xl font-semibold mb-4">
                📈 Daily Revenue (Last 30 Days)
              </h2>
              {metrics.revenue && metrics.revenue.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={metrics.revenue}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 10 }}
                      angle={-45}
                      textAnchor="end"
                      height={70}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                      formatter={(value: any) => `$${value.toFixed(2)}`}
                    />
                    <Legend />
                    <Bar dataKey="revenue" fill="#3b82f6" name="Revenue ($)" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No revenue data available for the last 30 days.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Orders by Status Breakdown */}
          <Card>
            <CardContent>
              <h2 className="text-xl font-semibold mb-4">
                📦 Orders by Status
              </h2>
              {metrics.business.ordersByStatus &&
              metrics.business.ordersByStatus.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={metrics.business.ordersByStatus}
                      dataKey="count"
                      nameKey="status"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({ status, count }) => `${status}: ${count}`}
                    >
                      {metrics.business.ordersByStatus.map(
                        (_: any, index: number) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        )
                      )}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No order status data available.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* ========== 2️⃣ PERFORMANCE MONITORING ========== */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            ⚡ Performance Monitoring
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Avg API Latency
                </h3>
                <p className="text-2xl font-bold text-blue-600">
                  {metrics.performance.avgLatency.toFixed(0)}ms
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  LLM Avg Response
                </h3>
                <p className="text-2xl font-bold text-purple-600">
                  {(metrics.performance.llmAvgResponseTime || 0).toFixed(0)}ms
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Active SSE Connections
                </h3>
                <p className="text-2xl font-bold text-green-600">
                  {metrics.performance.activeSSEConnections}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Failed Requests
                </h3>
                <p className="text-2xl font-bold text-red-600">
                  {metrics.performance.failedRequests}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* ========== 3️⃣ ASSISTANT ANALYTICS ========== */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            🤖 Assistant Analytics
          </h2>

          {/* Total Queries Card */}
          <div className="mb-4">
            <Card>
              <CardContent>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Total Assistant Queries
                </h3>
                <p className="text-3xl font-bold text-indigo-600">
                  {metrics.assistant.totalQueries}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Intent Distribution */}
            <Card>
              <CardContent>
                <h3 className="text-xl font-semibold mb-4">
                  Intent Distribution
                </h3>
                {metrics.assistant.intentDistribution &&
                metrics.assistant.intentDistribution.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={metrics.assistant.intentDistribution}
                        dataKey="count"
                        nameKey="intent"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={({ intent, count }) => `${intent}: ${count}`}
                      >
                        {metrics.assistant.intentDistribution.map(
                          (_: any, index: number) => (
                            <Cell
                              key={`intent-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          )
                        )}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    No assistant queries yet. Try sending some messages!
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Function Calls Breakdown */}
            <Card>
              <CardContent>
                <h3 className="text-xl font-semibold mb-4">
                  Function Calls Breakdown
                </h3>
                {metrics.assistant.functionFrequency &&
                metrics.assistant.functionFrequency.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={metrics.assistant.functionFrequency}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="function"
                        tick={{ fontSize: 10 }}
                        angle={-45}
                        textAnchor="end"
                        height={70}
                      />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    No function calls logged yet.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Avg Response Time by Intent */}
            {metrics.assistant.avgResponseTimeByIntent &&
              metrics.assistant.avgResponseTimeByIntent.length > 0 && (
                <Card>
                  <CardContent>
                    <h3 className="text-xl font-semibold mb-4">
                      Avg Response Time by Intent
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={metrics.assistant.avgResponseTimeByIntent}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="intent"
                          tick={{ fontSize: 10 }}
                          angle={-45}
                          textAnchor="end"
                          height={70}
                        />
                        <YAxis
                          label={{
                            value: "ms",
                            angle: -90,
                            position: "insideLeft",
                          }}
                        />
                        <Tooltip formatter={(value: any) => `${value}ms`} />
                        <Bar dataKey="avgResponseTime" fill="#8b5cf6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
