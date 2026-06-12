exports.calculateCommission = ({
  saleAmount,
  commissionRate,
  bonus = 0,
}) => {
  const baseCommission =
    (saleAmount * commissionRate) / 100;

  return baseCommission + bonus;
};