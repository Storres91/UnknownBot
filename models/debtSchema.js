const mongoose = require('mongoose');

const unknownDebtSchema = new mongoose.Schema({
    userID: { type: String, require: true, unique: true },
    debtAmount: { type: Number, require: true, default: 0},
})

const model = mongoose.model("unknownDebtModel", unknownDebtSchema);

module.exports = model;