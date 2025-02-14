"use server";

import Product from "../models/product.model"
import { connectToDB } from "../mongoose"
import User from "../models/user.model";
import { revalidatePath } from "next/cache";
import Value from "../models/value.model";
import { CreateUrlParams, ProductType } from "../types/types";
import { clearCatalogCache } from "./redis/catalog.actions";
import Order from "../models/order.model";
import clearCache from "./cache";
import Category from "../models/category.model";
import { updateCategories } from "./categories.actions";

interface CreateParams {
    id: string,
    name: string,
    quantity: number,
    images: string[],
    url: string,
    price: number,
    priceToShow: number,
    vendor: string,
    category?: string,
    description: string,
    isAvailable: boolean,
    params: {
        Model: string,
        Width: string,
        Height: string,
        Depth: string,
        Type: string,
        Color: string,
    },
    customParams?: {
        name: string,
        value:string,
    }[]
}


interface InterfaceProps {
    productId: string,
    email: string,
    path: string,
}

const DELETEDPRODUCT_ID = "67081c925bb87b6f68d83c50";

export async function createUrlProduct({ id, name, isAvailable, quantity, url, priceToShow, price, images, vendor, description, params, isFetched, category }: CreateUrlParams){
    try {
        connectToDB();
        
        const createdProduct = await Product.create({
            id: id,
            name: name,
            isAvailable: isAvailable,
            quantity: quantity,
            url: url,
            priceToShow: priceToShow,
            price: price,
            images: images,
            vendor: vendor,
            description: description,
            params: params,
            isFetched: isFetched,
            category: category ? category : "No-category"
        })

        clearCache("createProduct")
    } catch (error: any) {
        throw new Error(`Error creating url-product, ${error.message}`)
    }
}

export async function createUrlProductsMany(products: CreateUrlParams[]) {
    try {
      connectToDB();
  
      const createdProducts = await Product.insertMany(products);

      await updateCategories(createdProducts, "create")
  
      clearCache("createProduct");
    } catch (error: any) {
      throw new Error(`Error creating url-product, ${error.message}`);
    }
  }
  

export async function updateUrlProductsMany(products: Partial<CreateUrlParams>[]) {
    try {
        await connectToDB();

        const bulkOperations = products.map(product => ({
            updateOne: {
                filter: { _id: product._id },
                update: { $set: product },
            },
        }));

        await Product.bulkWrite(bulkOperations);

        clearCache("createProduct");
    } catch (error: any) {
        throw new Error(`Error updating url-products in bulk, ${error.message}`);
    }
}

export async function createProduct({ id, name, quantity, images, url, priceToShow, price, vendor, category, description, isAvailable, params, customParams }: CreateParams){
    try {
        connectToDB();
        
        await Product.create({
            id: id,
            name: name,
            images: images,
            quantity: quantity,
            url: url,
            price: price,
            priceToShow: priceToShow,
            category: category ? category : "",
            vendor: vendor,
            description: description,
            isAvailable: isAvailable,
            params: [
               { name: "Товар", value: params.Model.replace(/ /g, '_') },
               { name: "Ширина, см", value: parseFloat(params.Width).toFixed(2).toString() },
               { name: "Висота, см", value: parseFloat(params.Height).toFixed(2).toString() },
               { name: "Глибина, см", value: parseFloat(params.Depth).toFixed(2).toString() },
               { name: "Вид", value: params.Type },
               { name: "Колір", value: params.Color },
            ],
        })
        
        const createdProduct = await Product.findOne({ id: id });

        if(customParams){
            for(const customParam of customParams){
                createdProduct.params.push({ name: customParam.name, value: customParam.value });
            }
        }

        await createdProduct.save();

        await clearCatalogCache();

        clearCache("createProduct")
    } catch (error: any) {
        throw new Error(`Error creating new product, ${error.message}`)
    }
}

export async function updateUrlProduct({_id, id, name, isAvailable, quantity, url, priceToShow, price, images, vendor, description, params, isFetched, category }: CreateUrlParams){
    try {
        connectToDB();
        
        const product = await Product.findByIdAndUpdate(_id, {
            id: id,
            name: name,
            isAvailable: isAvailable,
            quantity: quantity,
            url: url,
            priceToShow: priceToShow,
            price: price,
            images: images,
            vendor: vendor,
            description: description,
            params: params,
            isFetched: isFetched,
            category: category ? category : "No-category"
        })
        
        clearCache("updateProduct")
        //console.log(product);
    } catch (error: any) {
        throw new Error(`Error creating url-product, ${error.message}`)
    }
}

export async function deleteUrlProducts(){
    try {
        connectToDB();

        await Product.deleteMany({ isFetched: true});

        clearCache("deleteProduct")
    } catch (error: any) {
        throw new Error(`Error deleting fetched products, ${error.message}`)
    }
}

export async function fetchUrlProducts(type?: "json"){
    try {
        connectToDB();
        
        const urlProducts = await Product.find({_id: {$ne: DELETEDPRODUCT_ID}, isFetched: true });

        if(type === "json"){
            return JSON.stringify(urlProducts)
        } else{
            return urlProducts;
        }
    } catch (error: any) {
        throw new Error(`Error finding url-added products: ${error.message}`)
    }
}

export async function fetchAllProducts() {
    try {
        connectToDB();
        
        const fetchedProducts = await Product.find({ _id: { $ne: DELETEDPRODUCT_ID }, isAvailable: true, quantity: { $gt: 0 } })
        .populate({
            path: 'likedBy',
            model: User,
            select: "_id email"
        })
        return fetchedProducts

    } catch (error:any) {
        throw new Error(`Error fetching all available products, ${error.message}`)
    }
}

export async function fetchProducts(){
    try {
        connectToDB();

        const products = await Product.find({ _id: { $ne: DELETEDPRODUCT_ID } });
        
        return products
    } catch (error:any) {
        throw new Error(`Error fetching products, ${error.message}`)
    }
}

export async function fetchLastProducts() {
    try {
        connectToDB();
        

        const last12Products = await Product.find({ _id: { $ne: DELETEDPRODUCT_ID }, isAvailable: true })
        .populate({
            path: 'likedBy',
            model: User,
            select: "_id email"
        })
        .sort({ _id: -1 }) // Сортуємо за спаданням _id (останні додані товари будуть першими)
        .limit(12); // Обмежуємо результат до 12 товарів
        

        return last12Products;

    } catch (error:any) {
        throw new Error(`Error fetching all available products, ${error.message}`)
    }
}



export async function addLike({ productId, email, path }: InterfaceProps) {
    try {
        connectToDB();
        
        const product = await Product.findOne({id:productId});
        if(email) {
            const currentUser = await User.findOne({ email: email }); 

            const isLiked = product.likedBy.includes(currentUser._id);

            if(isLiked) {
                await product.likedBy.pull(currentUser._id);
                await currentUser.likes.pull(product._id);
            } else {
                await product.likedBy.push(currentUser._id);
                await currentUser.likes.push(product._id);
            }
    
    
            await product.save();
            await currentUser.save();

            revalidatePath(path);
            revalidatePath(`/liked/${currentUser._id}`);
        }

        clearCache("likeProduct")
    } catch (error: any) {
        throw new Error(`Error adding like to the product, ${error.message}`)
    }
}

export async function fetchLikedProducts(userId: string){
    try {
        connectToDB();

        const likedProducts = await Product.find({ isAvailable: true, likedBy: userId })
            .populate({
                path: 'likedBy',
                model: User,
                select: "_id email"
            })

        return likedProducts;
    } catch (error: any) {
        throw new Error(`Error fecthing liked posts, ${error.message}`)
    }
}

export async function getProductsProperities(productId: string, type?: "json") {
    try {
        connectToDB();

        const products = await Product.find({});
        const product = await Product.findOne({ _id: productId });

        let allCategories: { [key: string]: number } = {};

        for(const product of products) {

            if(product.category){
                if(!allCategories[`${product.category}`]) {
                    allCategories[`${product.category}`] = 0
                }
        
                allCategories[`${product.category}`] = product.id;
            }
        }

        const categories = Object.entries(allCategories).map(([name, amount]) => ({
            name,
            amount,
        }))

        if(type === "json") {
            return JSON.stringify({
            properities: [
                { name: "id", value: product.id }, 
                { name: "name", value: product.name }, 
                { name: "price", value: product.price.toString() }, 
                { name: "priceToShow",  value: product.priceToShow.toString() }, 
                { name: "description", value: product.description }, 
                { name: "url", value: product.url }, 
                { name: "quantity", value: product.quantity.toString() }, 
                { name: "category", value: product.category }, 
                { name: "vendor", value: product.vendor },
                { name: "images", value: product.images },
                { name: "isAvailable", value: product.isAvailable }
            ], 
            params: product.params,
            categories: categories
        })
        } else {
            return {
                properities: [
                    { name: "id", value: productId }, 
                    { name: "name", value: product.name }, 
                    { name: "price", value: product.price.toString() }, 
                    { name: "priceToShow",  value: product.priceToShow.toString() }, 
                    { name: "description", value: product.description }, 
                    { name: "url", value: product.url }, 
                    { name: "quantity", value: product.quantity.toString() }, 
                    { name: "category", value: product.category }, 
                    { name: "vendor", value: product.vendor },
                    { name: "images", value: product.images },
                    { name: "isAvailable", value: product.isAvailable }
                ], 
                params: product.params,
                categories: categories
            }
        }
    } catch (error: any) {
        throw new Error(`Error fetching product properities: ${error.message}`)
    }
}

export async function editProduct({ id, name, quantity, images, url, priceToShow, price, vendor, category, description, isAvailable, params, customParams }: CreateParams){
    try {
        connectToDB();
        
        const createdProduct = await Product.findOne({ id: id })

        createdProduct.name = name;
        createdProduct.quantity = quantity;
        createdProduct.images = images;
        createdProduct.url = url;
        createdProduct.priceToShow = priceToShow;
        createdProduct.price = price;
        createdProduct.vendor = vendor;
        createdProduct.category = category ? category : "";
        createdProduct.description = description;
        createdProduct.isAvailable = isAvailable;

        createdProduct.params = [];
        
        createdProduct.params.push({ name: "Товар", value: params.Model.replace(/ /g, '_') });
        createdProduct.params.push({ name: "Ширина, см", value: parseFloat(params.Width).toFixed(2).toString() });
        createdProduct.params.push({ name: "Висота, см", value: parseFloat(params.Height).toFixed(2).toString() });
        createdProduct.params.push({ name: "Глибина, см", value: parseFloat(params.Depth).toFixed(2).toString() });
        createdProduct.params.push({ name: "Вид", value: params.Type });
        createdProduct.params.push({ name: "Колір", value: params.Color });

        if(customParams){
            for(const customParam of customParams){
                createdProduct.params.push({ name: customParam.name, value: customParam.value });
            }
        }

        await createdProduct.save();

        await clearCatalogCache();

        clearCache("updateProduct")
    } catch (error: any) {
        throw new Error(`Error creating url-product, ${error.message}`)
    }
}

export async function productAddedToCart(id: string) {
    try {
        connectToDB();

        const product = await Product.findById(id);

        await product.addedToCart.push(Date.now())

        await product.save();

        //console.log(product);

        clearCache("addToCart")
    } catch (error: any) {
        throw new Error(`Error adding prduct to cart: ${error.message}`)
    }
}

export async function findAllProductsCategories(type?: "json") {
  try {
    connectToDB();

    let allCategories: { [key: string]: number } = {};

    const products = await Product.find({});

    for(const product of products) {

        if(product.category){
            if(!allCategories[`${product.category}`]) {
                allCategories[`${product.category}`] = 0
            }
    
            allCategories[`${product.category}`] = product.id;
        }
    }

    const categories = Object.entries(allCategories).map(([name, amount]) => ({
        name,
        amount,
    }))

    //console.log("Categories", allCategories);

    if(type === "json") {
        return JSON.stringify(categories);
    } else {
        return categories
    }
  } catch (error: any) {
    throw new Error(`${error.message}`)
  }
}

export async function deleteManyProducts(_ids: string[], cache?: "keep-catalog-cache") {
    try {
        connectToDB();

        // Find products by their IDs
        const products = await Product.find({ _id: { $in: _ids}});

        if (!products.length) {
            throw new Error("No products found for deletion");
        }

        // Loop over the products to handle likes and orders before deletion
        for (const product of products) {
            const usersWhoLikedProduct = await User.find({ _id: { $in: product.likedBy }});

            if (usersWhoLikedProduct) {
                for (const user of usersWhoLikedProduct) {
                    user.likes.pull(product._id);
                    await user.save();
                }
            }

            const orders = await Order.find({ 'products.product': product._id });

            for (const order of orders) {
                for (const orderedProduct of order.products) {
                    orderedProduct.product = DELETEDPRODUCT_ID;
                }

                await order.save();
            }

            // Delete the product
            await Product.deleteOne({ _id: product._id });
        }

        if (!cache) {
            await clearCatalogCache();
        } else {
            console.log("Catalog cache cleared.");
        }

        console.log("Deleted products")
        clearCache("deleteProduct");

    } catch (error: any) {
        throw new Error(`Error deleting products: ${error.message}`);
    }
}


export async function deleteProduct(id: { productId: string} | {product_id: string}, path: string, cache?: "keep-catalog-cache") {
  try {
    connectToDB();

    if(id){
        const productId = "productId" in id ? id.productId : id.product_id;
        const searchParam = "productId" in id ? "id" : "_id";

        let product;

        if(searchParam === "id") {
            product = await Product.findOne({ id: productId });
        } else if (searchParam === "_id") {
            product = await Product.findOne({ _id: productId });
        }

        //console.log("Product", product);
    
        if(product){
            
            const usersWhoLikedProduct = await User.find({ _id: { $in: product.likedBy }});
        
            if(!product) {
                throw new Error("Product not found");
            }
        
            //console.log("Liked by", usersWhoLikedProduct);
        
            if(usersWhoLikedProduct){
                for(const user of usersWhoLikedProduct) {
                    user.likes.pull(product._id);
            
                    await user.save();
                }
            }
        
            const orders = await Order.find({ 'products.product': product._id })

            for(const order of orders) {
                for(const orderedProduct of order.products) {
                    orderedProduct.product = DELETEDPRODUCT_ID;

                    //console.log("Product", orderedProduct)
                }

                
                await order.save();
            }

            if(searchParam === "id") {
                await Product.deleteOne({ id: productId });
            } else if(searchParam === "_id") {
                await Product.deleteOne({ _id: productId })
            }
        
            if(!cache){
                await clearCatalogCache();
            } else {
                console.log("Catalog cache cleared.");
            }
            revalidatePath(path);
            
            clearCache("deleteProduct")
        }

    }
  } catch (error: any) {
    throw new Error(`Error deleting product: ${id} ${error.message}`)
  }
}

export async function changeProductsCategory({productsIds, categoryName}: {productsIds: string[], categoryName: string}) {
    try {
        connectToDB(); 

        const products = await Product.find({ _id: { $in: productsIds } });

        for(const product of products) {
            product.category = categoryName;

            await product.save()
        }

        await clearCatalogCache();

        clearCache("updateProduct")
    } catch (error: any) {
        throw new Error(`Error changing products' category: ${error.message}`)        
    }
}

export async function fetchCategoriesProducts(categoryName: string, type?: 'json') {
  try {
    connectToDB();

    const products = await Product.find({ category: categoryName });


    if(type === 'json'){
       return JSON.stringify(products)
    } else {
       return products
    }
    
  } catch (error: any) {
    throw new Error(`Error fetching categories products: ${error.message}`)
  }
}

export async function changeCategoryName({ categoryName, newName }: { categoryName: string, newName: string }) {
  try {
    connectToDB();

    const products = await Product.find({ category: categoryName });

    for(const product of products) {
        product.category = newName;

        await product.save();
    }

    await clearCatalogCache();

    clearCache("updateProduct")
  } catch (error: any) {
    throw new Error(`Error changing categorie's name: ${error.message}`)
  }
}

type DeleteCategoryProps = {
    categoryName: string;
} & ( { removeProducts: true } | { removeProducts: false, categoryToMoveProducts: string})

export async function deleteCategory(props: DeleteCategoryProps) {
    try {
        connectToDB();

        const products = await Product.find({ category: props.categoryName});

        const productIds: string[] = []

        for(const product of products) {
            if(props.removeProducts) {
                productIds.push(product._id)
            } else {
                product.category = props.categoryToMoveProducts;

                await product.save();
            }
        }

        //console.log(productIds);

        if(props.removeProducts) {
            for(const _id of productIds) {
                //console.log(productIds);
                //console.log("Id", _id)
                await deleteProduct({product_id: _id}, "/admin")
            }

            const orders = await Order.find({  'products.product': { $in: productIds } })

            for(const order of orders) {
                for(let product of order.products) {
                    if(productIds.includes(product)) {
                        product = DELETEDPRODUCT_ID
                    }
                }

                await order.save();
            }
        } 

        await clearCatalogCache();

        clearCache("updateProduct")
    } catch (error: any) {
        throw new Error(`Error deleting category: ${error.message}`)
    }
}




