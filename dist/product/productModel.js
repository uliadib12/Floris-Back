"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ProductModel {
    constructor({ id = 0, name = '', variants = [], images = [], description = '' }) {
        this.id = id;
        this.name = name;
        this.variants = variants;
        this.images = images;
        this.description = description;
    }
}
exports.default = ProductModel;
