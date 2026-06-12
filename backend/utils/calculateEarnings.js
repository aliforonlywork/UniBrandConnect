exports.calculateEarnings = (saleAmount, commissionRate) => {
  if (!saleAmount || !commissionRate) return 0;

  return (saleAmount * commissionRate) / 100;
};