import slugify from "slugify";
import Product from "../models/product.js";
import fs from "fs";

export const create = async (req, res) => {
    try {
        //console.log(req.fields)
        //console.log(req.files)
        const { name, description, price, category, quantity, shipping } = req.fields;
        const { photo } = req.files;
        //validation
        switch (true) {
            case !name.trim():
                res.json({ error: "name is required" });
            case !description.trim():
                res.json({ error: "description is required" });
            case !price.trim():
                res.json({ error: "price is required" });
            case !category.trim():
                res.json({ error: "Category is required" });
            case !quantity.trim():
                res.json({ error: "quantity is required" });
            case !shipping.trim():
                res.json({ error: "shipping is required" });
            case photo && photo.size > 1000000:
                res.json({ error: "image should be lees than 1mb in size" });
                
        }
        // create product
        const product = new Product({ ...req.fields, slug: slugify(name) });
        if (photo) {
            product.photo.data = fs.readFileSync(photo.path);
            product.photo.contentType = photo.type;
        }
        await product.save();
        res.json(product);

    } catch (err) {
        console.log(err)
        return res.status(400).json(err.message)
    }
};
export const list = async (req, res) => {
    try {
        const products = await Product.find({})
            .populate("category")
            .select("-photo")
            .limit(12).
            sort({ createdAt: -1 });
        res.json(products);
    } catch (err) {
        console.log(err);
    }
};
export const read = async (req, res) => {
    try {
        const product = await Product.findOne({ slug: req.params.slug }).select(
            '-photo'
        ).populate("category");
        res.json(product);
    } catch (err) {
        console.log(err);
    }
};
export const photo = async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId).select("photo");
        if (product.photo.data) {
            res.set("content-Type", product.photo.contentType);
            return res.send(product.photo.data);
        }
    } catch (err) {
        console.log(err)
    }
};
export const remove = async (req, res) => {
    try {
        const product = await Product.findOneAndDelete(req.params.productId).select("-photo");
        res.json(product);
    } catch (err) {
        console.log(err)
    }
};
//update product


export const update = async (req, res) => {
    try {
        //console.log(req.fields)
        //console.log(req.files)
        const { name, description, price, category, quantity, shipping } = req.fields;
        const { photo } = req.files;
        //validation
        switch (true) {
            case !name.trim():
                res.json({ error: "name is required" });
            case !description.trim():
                res.json({ error: "description is required" });
            case !price.trim():
                res.json({ error: "price is required" });
            case !category.trim():
                res.json({ error: "Category is required" });
            case !quantity.trim():
                res.json({ error: "quantity is required" });
            case !shipping.trim():
                res.json({ error: "shipping is required" });
            case photo && photo.size > 1000000:
                res.json({ error: "image should be lees than 1mb in size" });
                
        }
        // update product
        const product = await Product.findByIdAndUpdate(
            req.params.productId,
            {
            ...req.fields,
           slug: slugify(name), 
        },
            {new:true}
        );
        if (photo) {
            product.photo.data = fs.readFileSync(photo.path);
            product.photo.contentType = photo.type;
        }
        await product.save();
        res.json(product);

    } catch (err) {
        console.log(err)
        return res.status(400).json(err.message)
    }
};