import crypto from "crypto";

const VNPAY_TIME_ZONE = "Asia/Ho_Chi_Minh";

export const createVNPayPaymentUrl = (orderId, amount, orderInfo, ipAddr) => {
  const vnpUrl = process.env.VNP_URL || "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
  const returnUrl = process.env.VNP_RETURN_URL || "http://localhost:5000/api/payment/vnpay/callback";
  const tmnCode = process.env.VNP_TMN_CODE;
  const secretKey = process.env.VNP_HASH_SECRET;

  if (!tmnCode || !secretKey) {
    throw new Error("VNPay configuration is missing");
  }

  const date = new Date();
  const createDate = formatVNPayDate(date);
  const expireDate = formatVNPayDate(new Date(date.getTime() + 15 * 60 * 1000));

  // Đảm bảo amount là số nguyên
  const normalizedAmount = Math.round(Number(amount));
  if (!Number.isFinite(normalizedAmount) || normalizedAmount <= 0) {
    throw new Error("Invalid VNPay amount");
  }

  const vnpAmount = normalizedAmount * 100;

  let vnpParams = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: tmnCode,
    vnp_Locale: "vn",
    vnp_CurrCode: "VND",
    vnp_TxnRef: String(orderId),
    vnp_OrderInfo: orderInfo,
    vnp_OrderType: "other",
    vnp_Amount: vnpAmount,
    vnp_ReturnUrl: returnUrl,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate: createDate,
    vnp_ExpireDate: expireDate
  };

  vnpParams = sortObject(vnpParams);

  const signData = buildQueryString(vnpParams);
  const hmac = crypto.createHmac("sha512", secretKey);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
  vnpParams.vnp_SecureHash = signed;

  return `${vnpUrl}?${buildQueryString(vnpParams)}`;
};

export const verifyVNPayCallback = (vnpParams) => {
  const secureHash = vnpParams.vnp_SecureHash;
  delete vnpParams.vnp_SecureHash;
  delete vnpParams.vnp_SecureHashType;

  const sortedParams = sortObject(vnpParams);
  const secretKey = process.env.VNP_HASH_SECRET;
  const signData = buildQueryString(sortedParams);
  const hmac = crypto.createHmac("sha512", secretKey);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  return secureHash === signed;
};

function sortObject(obj) {
  const sorted = {};
  const keys = Object.keys(obj).sort();
  keys.forEach((key) => {
    sorted[key] = obj[key];
  });
  return sorted;
}

function buildQueryString(params) {
  return Object.entries(params)
    .map(([key, value]) => `${encodeVNPayValue(key)}=${encodeVNPayValue(value)}`)
    .join("&");
}

function encodeVNPayValue(value) {
  return encodeURIComponent(String(value)).replace(/%20/g, "+");
}

function formatVNPayDate(date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: VNPAY_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    hourCycle: "h23"
  }).formatToParts(date);

  const getPart = (type) => parts.find((part) => part.type === type)?.value || "";

  return [
    getPart("year"),
    getPart("month"),
    getPart("day"),
    getPart("hour"),
    getPart("minute"),
    getPart("second")
  ].join("");
}
