const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;

function validateEmail(email) {
  return emailRegex.test(String(email || "").trim().toLowerCase());
}

function validatePassword(password) {
  return passwordRegex.test(String(password || ""));
}

function getTimeBucket(time) {
  const [hours] = String(time || "0:00").split(":").map(Number);
  if (hours < 12) return "morning";
  if (hours < 18) return "afternoon";
  return "evening";
}

function calculateRefundPercentage(journeyDate, journeyTime) {
  const departure = new Date(`${journeyDate}T${journeyTime}:00`);
  const hoursDiff = (departure.getTime() - Date.now()) / (1000 * 60 * 60);
  return hoursDiff > 24 ? 80 : 50;
}

module.exports = {
  validateEmail,
  validatePassword,
  getTimeBucket,
  calculateRefundPercentage
};
