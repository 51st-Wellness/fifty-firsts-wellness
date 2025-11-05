import React, { useEffect, useState } from "react";
import { Users, ShoppingBag, Play, Clock, Star } from "lucide-react";
import { fetchProgrammeStats, type ProgrammeStats } from "@/api/stats.api";

const ManagementOverview: React.FC = () => {
  const [stats, setStats] = useState<ProgrammeStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const programmeStats = await fetchProgrammeStats();
      if (programmeStats) {
        setStats(programmeStats);
      }
    } catch (error) {
      console.error("Failed to load stats data:", error);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  // Extract stats values with fallbacks
  const totalProgrammes = stats?.totalProgrammes || 0;
  const publishedProgrammes = stats?.publishedProgrammes || 0;
  const draftProgrammes = stats?.draftProgrammes || 0;
  const featuredProgrammes = stats?.featuredProgrammes || 0;

  return (
    <div className="space-y-8 font-primary">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-accent font-semibold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-2 font-primary">
          Welcome back! Here's what's happening with your wellness platform.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Programmes
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {loading ? "—" : totalProgrammes}
              </p>
            </div>
            <div className="bg-brand-green/10 p-3 rounded-lg">
              <Play className="h-6 w-6 text-brand-green" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <span className="text-gray-500">
              {totalProgrammes > 0
                ? `${publishedProgrammes} published, ${draftProgrammes} drafts`
                : "No programmes created yet"}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Published</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {loading ? "—" : publishedProgrammes}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <span className="text-gray-500">
              {publishedProgrammes > 0
                ? `Live and accessible to users`
                : "No published content yet"}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Drafts</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {loading ? "—" : draftProgrammes}
              </p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <span className="text-gray-500">
              {draftProgrammes > 0
                ? `Ready to publish when you are`
                : "No drafts in progress"}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Featured</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {loading ? "—" : featuredProgrammes}
              </p>
            </div>
            <div className="bg-brand-purple/10 p-3 rounded-lg">
              <Star className="h-6 w-6 text-brand-purple" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <span className="text-gray-500">
              {featuredProgrammes > 0
                ? `Prominently displayed to users`
                : "No featured content yet"}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-xl font-accent font-semibold mb-4 text-gray-900">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="/management/programmes"
            className="flex items-center p-4 rounded-lg border border-gray-200 hover:border-brand-green hover:bg-brand-green/5 transition-colors group"
          >
            <div className="bg-brand-green/10 p-2 rounded-lg group-hover:bg-brand-green/20 transition-colors">
              <Play className="h-5 w-5 text-brand-green" />
            </div>
            <div className="ml-3">
              <p className="font-medium text-gray-900">Create Programme</p>
              <p className="text-sm text-gray-500">
                Upload a new video programme
              </p>
            </div>
          </a>

          <a
            href="/management/marketplace"
            className="flex items-center p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors group"
          >
            <div className="bg-green-100 p-2 rounded-lg group-hover:bg-green-200 transition-colors">
              <ShoppingBag className="h-5 w-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="font-medium text-gray-900">Manage Store</p>
              <p className="text-sm text-gray-500">
                Add products to marketplace
              </p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ManagementOverview;