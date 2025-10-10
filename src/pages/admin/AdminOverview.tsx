import React, { useEffect, useState } from "react";
import { Users, ShoppingBag, Play, TrendingUp, Clock, Star } from "lucide-react";
import { fetchProgrammes, type Programme } from "@/api/programme.api";

const AdminOverview: React.FC = () => {
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await fetchProgrammes({ page: 1, limit: 10 });
      setProgrammes((res.data as any)?.items || []);
    } catch (error) {
      console.error("Failed to load overview data:", error);
    } finally {
      setLoading(false);
    }
  };

  const publishedProgrammes = programmes.filter(p => p.isPublished);
  const draftProgrammes = programmes.filter(p => !p.isPublished);
  const featuredProgrammes = programmes.filter(p => p.isFeatured);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your wellness platform.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Programmes</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {loading ? "—" : programmes.length}
              </p>
            </div>
            <div className="bg-indigo-100 p-3 rounded-lg">
              <Play className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-600 font-medium">+12%</span>
            <span className="text-gray-500 ml-1">from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Published</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {loading ? "—" : publishedProgrammes.length}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <span className="text-gray-500">
              {programmes.length > 0 
                ? `${Math.round((publishedProgrammes.length / programmes.length) * 100)}% of total`
                : "No programmes yet"
              }
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Drafts</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {loading ? "—" : draftProgrammes.length}
              </p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <span className="text-gray-500">Awaiting publication</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Featured</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {loading ? "—" : featuredProgrammes.length}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Star className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <span className="text-gray-500">Highlighted content</span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Recent Programmes</h2>
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-8 bg-gray-200 rounded"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 mt-1"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : programmes.length === 0 ? (
            <div className="text-center py-8">
              <Play className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No programmes yet</p>
              <p className="text-sm text-gray-400">Create your first programme to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {programmes.slice(0, 5).map((programme) => (
                <div key={programme.productId} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-12 h-8 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                    {programme.thumbnail ? (
                      <img
                        src={programme.thumbnail}
                        alt={programme.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Play className="h-4 w-4 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{programme.title}</p>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span className={programme.isPublished ? "text-green-600" : "text-yellow-600"}>
                        {programme.isPublished ? "Published" : "Draft"}
                      </span>
                      {programme.duration && programme.duration > 0 && (
                        <>
                          <span>•</span>
                          <span>{Math.round(programme.duration / 60)} min</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Quick Actions</h2>
          <div className="space-y-3">
            <a
              href="/admin/programmes"
              className="flex items-center p-4 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors group"
            >
              <div className="bg-indigo-100 p-2 rounded-lg group-hover:bg-indigo-200 transition-colors">
                <Play className="h-5 w-5 text-indigo-600" />
              </div>
              <div className="ml-3">
                <p className="font-medium text-gray-900">Create Programme</p>
                <p className="text-sm text-gray-500">Upload a new video programme</p>
              </div>
            </a>
            
            <a
              href="/admin/marketplace"
              className="flex items-center p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors group"
            >
              <div className="bg-green-100 p-2 rounded-lg group-hover:bg-green-200 transition-colors">
                <ShoppingBag className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="font-medium text-gray-900">Manage Store</p>
                <p className="text-sm text-gray-500">Add products to marketplace</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
