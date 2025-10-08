import groundTruth from "./ground-truth.json";
import { getOrderStatus } from "../lib/api";

export interface Answer {
  qid?: string;
  text: string;
}

interface GroundTruthItem {
  qid: string;
  question: string;
  answer: string;
}

export function findAnswer(query: string): Answer {
  // Detect order ID
  const orderMatch = query.match(/[A-Z0-9]{10,}/);
  if (orderMatch) {
    const status = getOrderStatus(orderMatch[0]);
    const displayId = status.orderId.slice(-4).padStart(status.orderId.length, "*");
    return {
      text: `Order ${displayId} is currently ${status.status}${
        status.carrier ? ` with ${status.carrier}` : ""
      }${status.eta ? `, ETA: ${status.eta}` : ""}. [Q00]`,
      qid: "Q00", // you can reserve Q00 for system responses like order status
    };
  }

  // Keyword matching with ground-truth.json
  const words = query.toLowerCase().split(/\s+/);
  let bestMatch: { score: number; item: GroundTruthItem } | null = null;

  for (const item of groundTruth as GroundTruthItem[]) {
    const text = item.question.toLowerCase();
    const score = words.filter((w) => text.includes(w)).length;
    if (!bestMatch || score > bestMatch.score) {
      bestMatch = { score, item };
    }
  }

  // Threshold: at least 2 keyword matches
  if (bestMatch && bestMatch.score >= 2) {
    return {
      qid: bestMatch.item.qid,
      text: `${bestMatch.item.answer} [${bestMatch.item.qid}]`,
    };
  }

  return { text: "Sorry, I don’t have information about that." };
}
