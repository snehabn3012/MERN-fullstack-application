const { errorHandler } = require('../helpers/dbErrorHandler');
const Product = require('../models/product');
const { formidable } = require('formidable');
const _ = require('lodash');
const sharp = require('sharp');

// Compress uploaded image: resize to max 800px wide, convert to JPEG q=80
async function compressImage(filepath) {
    const buffer = await sharp(filepath)
        .resize({ width: 800, withoutEnlargement: true })
        .jpeg({ quality: 80, progressive: true })
        .toBuffer();
    return buffer;
}

exports.productById = async (req, res, next, id) => {
    try {
        const product = await Product.findById(id).exec();
        if (!product) return res.status(404).json({ error: 'Product not found' });
        req.product = product;
        next();
    } catch (err) {
        return res.status(400).json({ error: err });
    }
};

exports.read = (req, res) => {
    req.product.photo = undefined;
    res.json(req.product);
};

exports.create = (req, res) => {
    try {
        const form = formidable({ multiples: true });
        form.keepExtensions = true;

        form.parse(req, async (err, fields, files) => {
            if (err) return res.status(400).json({ error: 'Image could not be uploaded' });

            const _fields = {};
            Object.keys(fields).forEach(key => { _fields[key] = fields[key][0]; });

            const { name, description, price, category, quantity, shipping } = _fields;
            if (!name || !description || !price || !category || !quantity || !shipping) {
                return res.status(400).json({ error: 'All fields are required' });
            }
            if (name.trim().length > 100) {
                return res.status(400).json({ error: 'Name must be 100 characters or less' });
            }
            if (description.trim().length > 2000) {
                return res.status(400).json({ error: 'Description must be 2000 characters or less' });
            }
            const priceNum = parseFloat(price);
            if (isNaN(priceNum) || priceNum < 0) {
                return res.status(400).json({ error: 'Price must be a positive number' });
            }
            const quantityNum = parseInt(quantity);
            if (isNaN(quantityNum) || quantityNum < 0) {
                return res.status(400).json({ error: 'Quantity must be a non-negative integer' });
            }

            try {
                const createdProduct = await Product.create(_fields);

                if (files.photo) {
                    const photo = files.photo[0];
                    if (photo.size > 1000000) {
                        await Product.findByIdAndDelete(createdProduct._id);
                        return res.status(400).json({ error: 'Image should be less than 1mb in size' });
                    }
                    createdProduct.photo.data = await compressImage(photo.filepath);
                    createdProduct.photo.contentType = 'image/jpeg';
                }

                const result = await createdProduct.save();
                res.json({ result, data: 'Successfully created' });
            } catch (innerErr) {
                console.error('Product creation error:', innerErr);
                return res.status(500).json({ error: 'An unexpected error occurred during product creation.' });
            }
        });
    } catch (err) {
        console.error('Product creation error:', err);
        return res.status(500).json({ error: 'An unexpected error occurred during product creation.' });
    }
};

exports.remove = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.productId);
        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        return res.status(400).json({ error: errorHandler(err) });
    }
};

exports.update = async (req, res) => {
    try {
        const form = formidable({ multiples: true });
        form.keepExtensions = true;

        form.parse(req, async (err, fields, files) => {
            if (err) return res.status(400).json({ error: 'Image could not be uploaded' });

            const _fields = {};
            Object.keys(fields).forEach(key => { _fields[key] = fields[key][0]; });

            const { name, description, price, category, quantity, shipping } = _fields;
            if (!name || !description || !price || !category || !quantity || !shipping) {
                return res.status(400).json({ error: 'All fields are required' });
            }
            if (name.trim().length > 100) {
                return res.status(400).json({ error: 'Name must be 100 characters or less' });
            }
            if (description.trim().length > 2000) {
                return res.status(400).json({ error: 'Description must be 2000 characters or less' });
            }
            const priceNum = parseFloat(price);
            if (isNaN(priceNum) || priceNum < 0) {
                return res.status(400).json({ error: 'Price must be a positive number' });
            }
            const quantityNum = parseInt(quantity);
            if (isNaN(quantityNum) || quantityNum < 0) {
                return res.status(400).json({ error: 'Quantity must be a non-negative integer' });
            }

            let product = req.product;
            product = _.extend(product, _fields);

            try {
                if (files.photo) {
                    const photo = files.photo[0];
                    if (photo.size > 1000000) {
                        return res.status(400).json({ error: 'Image should be less than 1mb in size' });
                    }
                    product.photo.data = await compressImage(photo.filepath);
                    product.photo.contentType = 'image/jpeg';
                }

                const result = await product.save();
                res.json({ result });
            } catch (innerErr) {
                console.error('Product update error:', innerErr);
                return res.status(400).json({ error: errorHandler(innerErr) });
            }
        });
    } catch (err) {
        console.error('Product update error:', err);
        return res.status(400).json({ error: errorHandler(err) });
    }
};

exports.list = (req, res) => {
    const order  = req.query.order   || 'desc';
    const sortBy = req.query.sortBy  || '_id';
    const limit  = parseInt(req.query.limit) || 6;

    Product.find()
        .select('-photo')
        .populate('category')
        .sort([[sortBy, order]])
        .limit(limit)
        .lean()
        .exec()
        .then(data => res.status(200).json({ data }))
        .catch(err => res.status(400).json({ error: errorHandler(err) }));
};

exports.listRelated = (req, res) => {
    const limit = parseInt(req.query.limit) || 6;

    Product.find({ _id: { $ne: req.product._id }, category: req.product.category })
        .select('-photo')
        .populate('category', '_id name')
        .limit(limit)
        .lean()
        .exec()
        .then(products => res.status(200).json({ products }))
        .catch(err => res.status(400).json({ error: errorHandler(err) }));
};

exports.listCategories = (req, res) => {
    Product.distinct('category', {})
        .then(data => res.json({ data }))
        .catch(err => res.status(400).json({ error: errorHandler(err) }));
};

exports.listBySearch = (req, res) => {
    const order  = req.body.order   || 'desc';
    const sortBy = req.body.sortBy  || '_id';
    const limit  = parseInt(req.body.limit) || 100;
    const skip   = parseInt(req.body.skip)  || 0;
    const findArgs = {};

    for (const key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            findArgs[key] = key === 'price'
                ? { $gte: req.body.filters[key][0], $lte: req.body.filters[key][1] }
                : req.body.filters[key];
        }
    }

    Product.find(findArgs)
        .select('-photo')
        .populate('category')
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .lean()
        .exec()
        .then(data => res.json({ size: data.length, data }))
        .catch(err => res.status(400).json({ error: errorHandler(err) }));
};

// Serve photo with strong HTTP caching (ETag + Cache-Control)
exports.photo = (req, res, next) => {
    if (!req.product?.photo?.data) return next();

    const etag = `"${req.product._id}-${req.product.updatedAt?.getTime()}"`;

    if (req.headers['if-none-match'] === etag) {
        return res.status(304).end();
    }

    res.set({
        'Content-Type':  req.product.photo.contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'ETag':          etag,
        'Last-Modified': req.product.updatedAt?.toUTCString(),
        'Vary':          'Accept-Encoding',
    });
    return res.send(req.product.photo.data);
};

exports.listSearch = (req, res) => {
    if (!req.query.search) return res.json([]);

    const escaped = req.query.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const query = { name: { $regex: escaped, $options: 'i' } };
    if (req.query.category && req.query.category !== 'All') {
        query.category = req.query.category;
    }

    Product.find(query)
        .select('-photo')
        .limit(20)
        .lean()
        .then(products => res.json(products))
        .catch(err => res.status(400).json({ error: errorHandler(err) }));
};

exports.decreaseQuantity = (req, res, next) => {
    const bulkOps = req.body.order.products.map(item => ({
        updateOne: {
            filter: { _id: item._id },
            update: { $inc: { quantity: -item.count, sold: +item.count } },
        },
    }));

    Product.bulkWrite(bulkOps, {})
        .then(() => next())
        .catch(err => res.status(400).json({ error: errorHandler(err) }));
};
