export const formatMoney = (value: unknown) => {
  const numericValue = Number(value);
  return `$${Number.isFinite(numericValue) ? numericValue.toFixed(2) : "0.00"}`;
};

export const formatPaymentMethod = (value: string) => {
  if (value === "PROMPTPAY") return "QR / PromptPay";
  if (value === "CREDIT_CARD") return "Credit Card";
  if (value === "CASH") return "Cash";
  return value;
};

export const formatPickupTime = (isoDate?: string | null) => {
  if (!isoDate) return "--:--";
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "--:--";
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
};

export const formatOrderDate = (isoDate?: string | null) => {
  if (!isoDate) return "--/--";
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "--/--";
  const day = date.getDate();
  const month = date.getMonth() + 1;
  return `${day}/${month}`;
};
