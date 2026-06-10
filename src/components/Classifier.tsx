import { useState, useRef } from "react";
import { Upload, Loader2, Image as ImageIcon, Sparkles, X } from "lucide-react";
import {
  classifyImage,
  getConfidenceColor,
  getConfidenceBgColor,
  type Prediction,
} from "../services/classifier";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";

export function Classifier() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isClassifying, setIsClassifying] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const { user } = useAuth();

  const handleImageSelect = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setPredictions([]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleImageSelect(e.target.files[0]);
    }
  };

  const handleClassify = async () => {
    if (!imageRef.current || !selectedImage) return;

    setIsClassifying(true);
    try {
      const results = await classifyImage(imageRef.current);
      setPredictions(results);

      if (user && results.length > 0) {
        await supabase.from("classifications").insert({
          user_id: user.id,
          image_url: selectedImage.substring(0, 1000),
          predictions: results,
          top_prediction: results[0].className,
          confidence: results[0].probability,
        });
      }
    } catch (error) {
      console.error("Classification error:", error);
    } finally {
      setIsClassifying(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setPredictions([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div
        className={`relative border-2 border-dashed rounded-2xl transition-all duration-300 ${
          dragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 bg-white hover:border-blue-400"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
        />

        {!selectedImage ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="cursor-pointer p-12 text-center"
          >
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-br from-blue-100 to-cyan-100 p-6 rounded-full">
                <Upload className="w-12 h-12 text-blue-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Upload an image to classify
            </h3>
            <p className="text-gray-600 mb-4">
              Drag and drop or click to select an image
            </p>
            <p className="text-sm text-gray-500">
              Supports JPG, PNG, GIF up to 10MB
            </p>
          </div>
        ) : (
          <div className="p-6">
            <div className="relative">
              <img
                ref={imageRef}
                src={selectedImage}
                alt="Selected"
                className="w-full h-auto max-h-96 object-contain rounded-lg"
                crossOrigin="anonymous"
              />
              <button
                onClick={handleReset}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {predictions.length === 0 && (
              <button
                onClick={handleClassify}
                disabled={isClassifying}
                className="w-full mt-6 bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isClassifying ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Classifying with Deep Learning...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Classify Image
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>

      {predictions.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-2 mb-6">
            <ImageIcon className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-800">
              Classification Results
            </h2>
          </div>

          <div className="space-y-3">
            {predictions.map((pred, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl border-2 transition-all duration-300 ${getConfidenceBgColor(
                  pred.probability,
                )}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-800 text-lg">
                    {pred.className}
                  </span>
                  <span
                    className={`font-bold text-xl ${getConfidenceColor(pred.probability)}`}
                  >
                    {pred.probability.toFixed(2)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      pred.probability >= 80
                        ? "bg-gradient-to-r from-green-500 to-green-600"
                        : pred.probability >= 60
                          ? "bg-gradient-to-r from-blue-500 to-blue-600"
                          : pred.probability >= 40
                            ? "bg-gradient-to-r from-yellow-500 to-yellow-600"
                            : "bg-gradient-to-r from-orange-500 to-orange-600"
                    }`}
                    style={{ width: `${pred.probability}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleReset}
            className="w-full mt-6 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
          >
            Classify Another Image
          </button>
        </div>
      )}
    </div>
  );
}
