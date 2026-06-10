import * as mobilenet from "@tensorflow-models/mobilenet";
import * as tf from "@tensorflow/tfjs";

let model: mobilenet.MobileNet | null = null;

export async function loadModel() {
  if (!model) {
    await tf.ready();
    model = await mobilenet.load();
  }
  return model;
}

export interface Prediction {
  className: string;
  probability: number;
}

export async function classifyImage(
  imageElement: HTMLImageElement,
): Promise<Prediction[]> {
  const loadedModel = await loadModel();
  const predictions = await loadedModel.classify(imageElement);

  return predictions.map((pred) => ({
    className: pred.className,
    probability: pred.probability * 100,
  }));
}

export function getConfidenceColor(confidence: number): string {
  if (confidence >= 80) return "text-green-600";
  if (confidence >= 60) return "text-blue-600";
  if (confidence >= 40) return "text-yellow-600";
  return "text-orange-600";
}

export function getConfidenceBgColor(confidence: number): string {
  if (confidence >= 80) return "bg-green-50 border-green-200";
  if (confidence >= 60) return "bg-blue-50 border-blue-200";
  if (confidence >= 40) return "bg-yellow-50 border-yellow-200";
  return "bg-orange-50 border-orange-200";
}
