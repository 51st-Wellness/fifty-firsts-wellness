import React, { useEffect, useState } from "react";
import {
  Users,
  ShoppingBag,
  Star,
  Clock,
  TrendingUp,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  fetchOverviewStats,
  fetchUserGrowth,
  type OverviewStats,
} from "@/api/stats.api";

const ManagementOverview: React.FC = () => {
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [userGrowthData, setUserGrowthData] = useState<
    { date: string; count: number }[]
  >([]);
  const [monthOffset, setMonthOffset] = useState(0);
  const [loadingChart, setLoadingChart] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadUserGrowth();
  }, [monthOffset]);

  const loadData = async () => {
    try {
      const overviewStats = await fetchOverviewStats();
      if (overviewStats) {
        setStats(overviewStats);
        setUserGrowthData(overviewStats.userGrowth);
      }
    } catch (error) {
      console.error("Failed to load stats data:", error);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  const loadUserGrowth = async () => {
    setLoadingChart(true);
    try {
      const growth = await fetchUserGrowth(monthOffset);
      if (growth) {
        setUserGrowthData(growth);
      }
    } catch (error) {
      console.error("Failed to load user growth data", error);
    } finally {
      setLoadingChart(false);
    }
  };

  const handlePrevMonth = () => {
    setMonthOffset((prev) => prev + 1);
  };

  const handleNextMonth = () => {
    if (monthOffset > 0) {
      setMonthOffset((prev) => prev - 1);
    }
  };

  // Extract stats values with fallbacks
  const totalUsers = stats?.totalUsers || 0;
  const totalOrders = stats?.totalOrders || 0;
  const reviewsThisWeek = stats?.reviewsThisWeek || 0;
  const totalPreOrders = stats?.totalPreOrders || 0;
  const userGrowthPercent = stats?.userGrowthPercentage || 0;
  const orderGrowthPercent = stats?.orderGrowthPercentage || 0;

  const getTrendPercent = (percent: number) => {
    return `${percent > 0 ? "+" : ""}${percent}%`;
  };

  // Swipe handlers for mobile carousel
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && carouselIndex < 1) {
      setCarouselIndex(carouselIndex + 1);
    }
    if (isRightSwipe && carouselIndex > 0) {
      setCarouselIndex(carouselIndex - 1);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 font-primary max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      {/* Header */}
      <div>
        <h1 
          className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight"
          style={{ fontFamily: '"League Spartan", sans-serif' }}
        >
          Dashboard Overview
        </h1>
        <p className="text-sm sm:text-base text-gray-500 mt-1 sm:mt-2">
          Welcome back! Here's what's happening with your wellness platform.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        <StatsCard
          title="Total Users"
          value={totalUsers}
          icon={<Users className="h-6 w-6 text-brand-green" />}
          subtext="Active"
          loading={loading}
          trendPercent={getTrendPercent(userGrowthPercent)}
          iconBg="bg-brand-green/10"
        />
        <StatsCard
          title="Total Orders"
          value={totalOrders}
          icon={<ShoppingBag className="h-6 w-6 text-blue-600" />}
          subtext="Completed"
          loading={loading}
          trendPercent={getTrendPercent(orderGrowthPercent)}
          iconBg="bg-blue-50"
        />
        <StatsCard
          title="Reviews (Week)"
          value={reviewsThisWeek}
          icon={<Star className="h-6 w-6 text-yellow-600" />}
          subtext={
            reviewsThisWeek > 0
              ? "New feedback received"
              : "No new reviews this week"
          }
          loading={loading}
          iconBg="bg-yellow-50"
        />
        <StatsCard
          title="Pre-Orders"
          value={totalPreOrders}
          icon={<Clock className="h-6 w-6 text-purple-600" />}
          subtext="Awaiting fulfillment"
          loading={loading}
          iconBg="bg-purple-50"
        />
      </div>

      {/* Charts Section - Desktop/Tablet Grid */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
        {/* User Growth Chart */}
        <div className="md:col-span-1 lg:col-span-2 bg-white rounded-xl md:rounded-2xl border border-gray-100 shadow-sm p-4 md:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
            <div>
              <h2 
                className="text-base sm:text-lg font-semibold text-gray-900"
                style={{ fontFamily: '"League Spartan", sans-serif' }}
              >
                User Growth
              </h2>
              <p className="text-xs sm:text-sm text-gray-500">New signups over 30 days</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handlePrevMonth}
                className="flex items-center gap-1 px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-all shadow-sm"
                title="Previous 30 Days"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Prev 30 Days</span>
                <span className="sm:hidden">Prev</span>
              </button>

              <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-brand-green bg-brand-green/10 px-2 sm:px-3 py-1.5 rounded-full font-medium border border-brand-green/20">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>
                  {userGrowthData.length > 0
                    ? userGrowthData[userGrowthData.length - 1].count
                    : 0}{" "}
                  <span className="hidden sm:inline">{monthOffset === 0 ? "today" : "on last day"}</span>
                </span>
              </div>

              <button
                onClick={handleNextMonth}
                disabled={monthOffset === 0}
                className={`flex items-center gap-1 px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium border border-gray-200 rounded-lg transition-all shadow-sm ${
                  monthOffset === 0
                    ? "bg-gray-50 text-gray-300 cursor-not-allowed border-gray-100"
                    : "bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
                title="Next 30 Days"
              >
                <span className="hidden sm:inline">Next 30 Days</span>
                <span className="sm:hidden">Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="h-[250px] sm:h-[300px] w-full min-w-0">
            {loading || loadingChart ? (
              <div className="h-full w-full flex items-center justify-center text-gray-400">
                Loading chart...
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <AreaChart
                  data={userGrowthData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00969b" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#00969b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#F3F4F6"
                  />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9CA3AF", fontSize: 12 }}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return `${date.getDate()}/${date.getMonth() + 1}`;
                    }}
                    minTickGap={30}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9CA3AF", fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      borderRadius: "8px",
                      border: "1px solid #E5E7EB",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                    labelStyle={{ color: "#6B7280", marginBottom: "4px" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#00969b"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorCount)"
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Quick Actions (Compact) */}
        <div className="bg-white rounded-xl md:rounded-2xl border border-gray-100 shadow-sm p-4 md:p-6">
          <h2 
            className="text-base md:text-lg font-semibold text-gray-900 mb-4 md:mb-6"
            style={{ fontFamily: '"League Spartan", sans-serif' }}
          >
            Quick Actions
          </h2>
          <div className="space-y-3 md:space-y-4">
            <QuickAction
              href="/management/programmes"
              title="Create Programme"
              description="Upload new video content"
              icon={<TrendingUp className="h-5 w-5 text-brand-green" />}
            />
            <QuickAction
              href="/management/marketplace"
              title="Manage Store"
              description="Add products & inventory"
              icon={<ShoppingBag className="h-5 w-5 text-blue-600" />}
            />
            <QuickAction
              href="/management/users"
              title="User Management"
              description="View and edit users"
              icon={<Users className="h-5 w-5 text-purple-600" />}
            />
          </div>
        </div>
      </div>

      {/* Charts Section - Mobile/Small Tablet Swipeable Carousel */}
      <div className="md:hidden">
        <div
          className="overflow-hidden"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div
            className="flex transition-transform duration-300 ease-out touch-pan-x"
            style={{ 
              transform: `translateX(-${carouselIndex * 100}%)`,
              willChange: 'transform'
            }}
          >
            {/* User Growth Chart */}
            <div className="w-full flex-shrink-0 px-2">
              <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
                  <div>
                    <h2 
                      className="text-base sm:text-lg font-semibold text-gray-900"
                      style={{ fontFamily: '"League Spartan", sans-serif' }}
                    >
                      User Growth
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-500">New signups over 30 days</p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={handlePrevMonth}
                      className="flex items-center gap-1 px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-all shadow-sm"
                      title="Previous 30 Days"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span className="hidden sm:inline">Prev 30 Days</span>
                      <span className="sm:hidden">Prev</span>
                    </button>

                    <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-brand-green bg-brand-green/10 px-2 sm:px-3 py-1.5 rounded-full font-medium border border-brand-green/20">
                      <TrendingUp className="h-3.5 w-3.5" />
                      <span>
                        {userGrowthData.length > 0
                          ? userGrowthData[userGrowthData.length - 1].count
                          : 0}{" "}
                        <span className="hidden sm:inline">{monthOffset === 0 ? "today" : "on last day"}</span>
                      </span>
                    </div>

                    <button
                      onClick={handleNextMonth}
                      disabled={monthOffset === 0}
                      className={`flex items-center gap-1 px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium border border-gray-200 rounded-lg transition-all shadow-sm ${
                        monthOffset === 0
                          ? "bg-gray-50 text-gray-300 cursor-not-allowed border-gray-100"
                          : "bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                      title="Next 30 Days"
                    >
                      <span className="hidden sm:inline">Next 30 Days</span>
                      <span className="sm:hidden">Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="h-[250px] sm:h-[300px] w-full min-w-0">
                  {loading || loadingChart ? (
                    <div className="h-full w-full flex items-center justify-center text-gray-400">
                      Loading chart...
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                      <AreaChart
                        data={userGrowthData}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#00969b" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#00969b" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke="#F3F4F6"
                        />
                        <XAxis
                          dataKey="date"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "#9CA3AF", fontSize: 12 }}
                          tickFormatter={(value) => {
                            const date = new Date(value);
                            return `${date.getDate()}/${date.getMonth() + 1}`;
                          }}
                          minTickGap={30}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "#9CA3AF", fontSize: 12 }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#fff",
                            borderRadius: "8px",
                            border: "1px solid #E5E7EB",
                            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                          }}
                          labelStyle={{ color: "#6B7280", marginBottom: "4px" }}
                        />
                        <Area
                          type="monotone"
                          dataKey="count"
                          stroke="#00969b"
                          strokeWidth={3}
                          fillOpacity={1}
                          fill="url(#colorCount)"
                          activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="w-full flex-shrink-0 px-2">
              <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6">
                <h2 
                  className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6"
                  style={{ fontFamily: '"League Spartan", sans-serif' }}
                >
                  Quick Actions
                </h2>
                <div className="space-y-3 sm:space-y-4">
                  <QuickAction
                    href="/management/programmes"
                    title="Create Programme"
                    description="Upload new video content"
                    icon={<TrendingUp className="h-5 w-5 text-brand-green" />}
                  />
                  <QuickAction
                    href="/management/marketplace"
                    title="Manage Store"
                    description="Add products & inventory"
                    icon={<ShoppingBag className="h-5 w-5 text-blue-600" />}
                  />
                  <QuickAction
                    href="/management/users"
                    title="User Management"
                    description="View and edit users"
                    icon={<Users className="h-5 w-5 text-purple-600" />}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Dots */}
        <div className="flex items-center justify-center gap-2 mt-4">
          {[0, 1].map((idx) => (
            <button
              key={idx}
              onClick={() => setCarouselIndex(idx)}
              className={`w-2 h-2 rounded-full transition-colors ${
                idx === carouselIndex
                  ? "bg-brand-green"
                  : "bg-gray-300"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  subtext: string;
  loading: boolean;
  trendPercent?: string;
  iconBg: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  subtext,
  loading,
  trendPercent,
  iconBg,
}) => (
  <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm p-3 sm:p-4 md:p-6 hover:shadow-md transition-shadow duration-200">
    <div className="flex items-start justify-between gap-2 sm:gap-3">
      <div className="flex-1 min-w-0">
        <p className="text-xs sm:text-sm font-medium text-gray-500">{title}</p>
        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mt-1 sm:mt-2 font-sans">
          {loading ? "—" : value.toLocaleString()}
        </h3>
      </div>
      <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl ${iconBg} flex-shrink-0`}>{icon}</div>
    </div>
    <div className="mt-2 sm:mt-3 md:mt-4 flex items-center justify-between gap-2">
      <p className="text-xs sm:text-sm text-gray-500">{subtext}</p>
      {trendPercent && (
        <div className="flex items-center text-xs font-medium text-brand-green bg-brand-green/10 px-2 py-1 rounded-lg border border-brand-green/20 whitespace-nowrap">
          <ArrowUpRight className="h-3 w-3 mr-1 flex-shrink-0" />
          <span>{trendPercent}</span>
        </div>
      )}
    </div>
  </div>
);

const QuickAction: React.FC<{
  href: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}> = ({ href, title, description, icon }) => (
  <a
    href={href}
    className="flex items-center p-3 sm:p-4 rounded-lg sm:rounded-xl border border-gray-100 hover:border-brand-green hover:bg-brand-green/5 transition-all duration-200 group"
  >
    <div className="bg-white p-2 rounded-lg shadow-sm group-hover:scale-110 transition-transform duration-200 border border-gray-100 flex-shrink-0">
      {icon}
    </div>
    <div className="ml-3 sm:ml-4 flex-1 min-w-0">
      <p 
        className="text-sm sm:text-base font-semibold text-gray-900 group-hover:text-brand-green transition-colors"
        style={{ fontFamily: '"League Spartan", sans-serif' }}
      >
        {title}
      </p>
      <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{description}</p>
    </div>
    <div className="ml-2 sm:ml-auto opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
      <ArrowUpRight className="h-4 w-4 text-brand-green" />
    </div>
  </a>
);

export default ManagementOverview;
