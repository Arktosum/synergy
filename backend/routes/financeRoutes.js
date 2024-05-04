const express = require("express");

const financeController = require("../controllers/financeController");
const financeRouter = express.Router();

financeRouter.post("/user/", financeController.createFinanceUser);
financeRouter.put("/user/:id", financeController.updateFinanceUser);
financeRouter.delete("/user/:id", financeController.deleteFinanceUser);

financeRouter.get("/user/", financeController.fetchAllFinanceUsers);
financeRouter.get("/user/recent", financeController.fetchRecentUsers);
financeRouter.get("/user/:id", financeController.fetchFinanceUserById);
financeRouter.get("/user/regex/:regex", financeController.fetchFinanceUsersRegex);

// financeRouter.post("/", financeController.createTransaction);
financeRouter.delete("/transaction/:id", financeController.deleteTransaction);
financeRouter.get("/transaction", financeController.fetchAllTransactions);
financeRouter.post("/transaction", financeController.payFinanceUser);

module.exports = financeRouter;
