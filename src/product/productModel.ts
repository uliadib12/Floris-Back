import type VariantModel from "./variantModel"

export default class ProductModel {
    id: number
    name: string
    variants: VariantModel[]
    images: string[]
    description: string

    constructor({
        id = 0,
        name = '',
        variants = [],
        images = [],
        description = ''
    } : {
        id?: number,
        name?: string,
        variants?: VariantModel[],
        images?: string[],
        description?: string
    }) {
        this.id = id;
        this.name = name;
        this.variants = variants;
        this.images = images;
        this.description = description;
    }
}
