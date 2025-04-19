export default function classifyRating(score) {
    if (score >= 0.7) return 5;
    if (score >= 0.4) return 4;
    if (score >= 0.1) return 3;
    if (score >= -0.2) return 2;
    return 1;
  }
  