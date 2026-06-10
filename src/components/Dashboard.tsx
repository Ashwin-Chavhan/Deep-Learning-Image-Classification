import { useState } from "react";
import { Brain, LogOut, Upload, History as HistoryIcon } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { Classifier } from "./Classifier";
import { History } from "./History";

type Tab = "classify" | "history";

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("classify");
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img
                src="/images/logo.png"
                alt="VisionAI Logo"
                className="w-10 h-10 object-contain"
              />

              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  Deep Learning Image Classifier
                </h1>
                <p className="text-xs text-gray-500">
                  Powered by TensorFlow & Vision AI
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 hidden sm:block">
                {user?.email}
              </span>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-2 mb-8 bg-white rounded-xl p-1 shadow-sm border border-gray-200 w-fit">
          <button
            onClick={() => setActiveTab("classify")}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              activeTab === "classify"
                ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
            }`}
          >
            <Upload className="w-5 h-5" />
            Classify
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              activeTab === "history"
                ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
            }`}
          >
            <HistoryIcon className="w-5 h-5" />
            History
          </button>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeTab === "classify" ? <Classifier /> : <History />}
        </div>
      </div>

      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold text-gray-800">
              First Year Project
            </h3>
            <p className="text-sm text-gray-600">
              Image Classification System using Deep Learning (TensorFlow.js &
              Vision AI)
            </p>
            <p className="text-xs text-gray-500">
              Advanced Computer Vision | Real-time Classification | Production
              Ready
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
