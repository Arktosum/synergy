const FinanceUser = require("../models/financeUserSchema");
const Transaction = require("../models/transactionSchema");

const createFinanceUser = async (req, res) => {
  try {
    // Implied that unique attributes are set as required.
    const newData = new FinanceUser(req.body);
    await newData.save();
    res.status(201).json(newData);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
const fetchFinanceUserById = async (req, res) => {
  try {
    const user = await FinanceUser.findById(req.params.id);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateFinanceUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = await FinanceUser.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedData);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
const deleteFinanceUser = async (req, res) => {
  try {
    const { id } = req.params;
    await FinanceUser.findByIdAndDelete(id);
    res.json({ message: "Data deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
const fetchAllFinanceUsers = async (req, res) => {
  try {
    const data = await FinanceUser.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const fetchFinanceUsersRegex = async (req, res) => {
  try {
    const { regex } = req.params;
    const REGEXP = new RegExp(regex, "i"); // 'i' flag for case-insensitive matching
    const users = await FinanceUser.find({ transactee: REGEXP });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the transaction to be deleted
    const deleteItem = await Transaction.findById(id);
    if (!deleteItem) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Find the user associated with the transaction
    const user = await FinanceUser.findById(deleteItem.transactee);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove the transaction from the user's transactions array
    const updatedDoc = await FinanceUser.findByIdAndUpdate(
      deleteItem.transactee,
      { $pull: { transactions: deleteItem._id } },
      { new: true }
    );

    // Delete the transaction
    const deletedItem = await Transaction.findByIdAndDelete(deleteItem._id);
    if (!deletedItem) {
      return res.status(404).json({ message: "Failed to delete transaction" });
    }

    res.json(deletedItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const fetchAllTransactions = async (req, res) => {
  try {
    const data = await Transaction.find()
      .populate("transactee")
      .sort({ updatedAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const payFinanceUser = async (req, res) => {
  try {
    // Implied that unique attributes are set as required.
    const transaction = new Transaction(req.body);
    await transaction.save();

    const updatedDoc = await FinanceUser.findByIdAndUpdate(
      req.body.transactee,
      { $push: { transactions: transaction._id } },
      { new: true }
    );
    res.status(201).json({ message: "Paid user successfully!" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const fetchRecentUsers = async (req, res) => {
  try {
    const data = await FinanceUser.find().sort({ updatedAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
module.exports = {
  fetchRecentUsers,
  fetchFinanceUserById,
  fetchFinanceUsersRegex,
  createFinanceUser,
  updateFinanceUser,
  deleteFinanceUser,
  fetchAllFinanceUsers,
  deleteTransaction,
  fetchAllTransactions,
  payFinanceUser,
};
