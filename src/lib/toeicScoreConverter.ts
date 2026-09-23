// Bảng quy đổi điểm TOEIC chuẩn ETS (Thang điểm 10 - 990)

export function convertListeningScore(correctCount: number): number {
  if (correctCount <= 0) return 5;
  if (correctCount >= 96) return 495;
  if (correctCount >= 93) return 490;
  if (correctCount >= 90) return 480;
  if (correctCount >= 85) return 465;
  if (correctCount >= 80) return 445;
  if (correctCount >= 75) return 420;
  if (correctCount >= 70) return 395;
  if (correctCount >= 65) return 370;
  if (correctCount >= 60) return 340;
  if (correctCount >= 55) return 310;
  if (correctCount >= 50) return 280;
  if (correctCount >= 45) return 250;
  if (correctCount >= 40) return 220;
  if (correctCount >= 35) return 190;
  if (correctCount >= 30) return 160;
  if (correctCount >= 25) return 130;
  if (correctCount >= 20) return 100;
  if (correctCount >= 15) return 70;
  if (correctCount >= 10) return 40;
  return Math.max(5, correctCount * 4);
}

export function convertReadingScore(correctCount: number): number {
  if (correctCount <= 0) return 5;
  if (correctCount >= 97) return 495;
  if (correctCount >= 94) return 490;
  if (correctCount >= 90) return 470;
  if (correctCount >= 85) return 445;
  if (correctCount >= 80) return 420;
  if (correctCount >= 75) return 395;
  if (correctCount >= 70) return 365;
  if (correctCount >= 65) return 335;
  if (correctCount >= 60) return 305;
  if (correctCount >= 55) return 275;
  if (correctCount >= 50) return 245;
  if (correctCount >= 45) return 215;
  if (correctCount >= 40) return 185;
  if (correctCount >= 35) return 155;
  if (correctCount >= 30) return 125;
  if (correctCount >= 25) return 95;
  if (correctCount >= 20) return 70;
  if (correctCount >= 15) return 45;
  if (correctCount >= 10) return 25;
  return Math.max(5, correctCount * 2.5);
}

export function calculateToeicScores(listeningCorrect: number, readingCorrect: number) {
  const listeningScore = convertListeningScore(listeningCorrect);
  const readingScore = convertReadingScore(readingCorrect);
  const totalScore = listeningScore + readingScore;

  let levelEvaluation = "Cần nỗ lực nhiều hơn";
  let badge = "🌱 Hạt mầm";

  if (totalScore >= 860) {
    levelEvaluation = "Xuất sắc (Chuyên nghiệp quốc tế - Trình độ C1)";
    badge = "👑 Bậc thầy TOEIC";
  } else if (totalScore >= 730) {
    levelEvaluation = "Tốt (Giao tiếp công việc trôi chảy - B2)";
    badge = "⭐ Cao thủ TOEIC";
  } else if (totalScore >= 550) {
    levelEvaluation = "Khá (Đáp ứng tốt chuẩn đầu ra đại học - B1)";
    badge = "🚀 Đang bứt phá";
  } else if (totalScore >= 450) {
    levelEvaluation = "Trung bình (Giao tiếp cơ bản)";
    badge = "🌿 LET'S English";
  }

  return {
    listeningScore,
    readingScore,
    totalScore,
    levelEvaluation,
    badge,
  };
}
