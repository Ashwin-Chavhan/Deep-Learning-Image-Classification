import { useEffect, useState } from "react";
import {
  History as HistoryIcon,
  Trash2,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { supabase, type Classification } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import { getConfidenceColor } from "../services/classifier";

export function History() {
  const [classifications, setClassifications] = useState<Classification[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadHistory();
  }, [user]);

  const loadHistory = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("classifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      setClassifications(data || []);
    } catch (error) {
      console.error("Error loading history:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("classifications")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setClassifications(classifications.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Error deleting classification:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <HistoryIcon className="w-7 h-7 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">
            Classification History
          </h2>
          <span className="ml-auto bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
            {classifications.length} total
          </span>
        </div>

        {classifications.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <HistoryIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              No classifications yet
            </h3>
            <p className="text-gray-500">
              Start by uploading and classifying some images
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {classifications.map((classification) => (
              <div
                key={classification.id}
                className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {classification.image_url.startsWith("data:image") ? (
                      <img
                        src={classification.image_url}
                        alt="Classified"
                        className="w-24 h-24 object-cover rounded-lg border-2 border-gray-200"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                        <HistoryIcon className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">
                          {classification.top_prediction}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(classification.created_at)}
                          </span>
                          <span
                            className={`flex items-center gap-1 font-semibold ${getConfidenceColor(classification.confidence)}`}
                          >
                            <TrendingUp className="w-4 h-4" />
                            {classification.confidence.toFixed(2)}% confidence
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDelete(classification.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="space-y-1">
                      {classification.predictions
                        .slice(0, 3)
                        .map((pred, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden flex-1">
                              <div
                                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                                style={{ width: `${pred.probability}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-600 w-32 truncate">
                              {pred.className}
                            </span>
                            <span className="text-xs font-semibold text-gray-700 w-12 text-right">
                              {pred.probability.toFixed(1)}%
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
