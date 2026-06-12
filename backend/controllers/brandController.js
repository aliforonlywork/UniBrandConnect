const Brand = require("../models/Brand");
const BrandWallet = require("../models/BrandWallet");
const BrandTransaction = require("../models/BrandTransaction");

// GET /api/brand/wallet
exports.getBrandWallet = async (req, res) => {
  try {
    const brand = await Brand.findOne({ userId: req.user._id });
    if (!brand) return res.status(404).json({ error: "Brand not found" });
    
    const wallet = await BrandWallet.findOne({ brandId: brand._id });
    res.json(wallet || { totalRevenue: 0, totalGMV: 0, totalPaidToStudents: 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/brand/transactions  
exports.getBrandTransactions = async (req, res) => {
  try {
    const brand = await Brand.findOne({ userId: req.user._id });
    if (!brand) return res.status(404).json({ error: "Brand not found" });
    
    const txns = await BrandTransaction.find({ brandId: brand._id })
      .populate("campaignId", "title productPrice")
      .sort({ createdAt: -1 });
    res.json(txns);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};