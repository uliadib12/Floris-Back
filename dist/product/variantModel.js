"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class VariantModel {
    constructor({ name = '', price = 0, stock = 0, size = '' }) {
        this.name = name;
        this.price = price;
        this.stock = stock;
        this.size = size;
    }
}
exports.default = VariantModel;
