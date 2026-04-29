
'use strict';
const { Item, User, UserProfile, Tag } = require('../models');
const { formatRupiah, formatDate, truncate } = require('../helpers/format');
const { Op } = require('sequelize');
const multer = require('multer');
const path = require('path');
 
// multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});
 
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    if (ext) return cb(null, true);
    cb(new Error('Hanya file gambar yang diizinkan (jpg, png, webp)'));
  }
}).single('image');
 
class ItemController {
 
  // GET /
  static async index(req, res) {
    try {
      const { search, sort, message } = req.query;
      const where = {};
      const order = [];
 
      // search filter
      if (search) {
        where[Op.or] = [
          { name: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } }
        ];
      }
 
      // sort order
      if (sort === 'price_asc') order.push(['price', 'ASC']);
      else if (sort === 'price_desc') order.push(['price', 'DESC']);
      else if (sort === 'oldest') order.push(['createdAt', 'ASC']);
      else order.push(['createdAt', 'DESC']);
 
      // eager loading
      const items = await Item.findAll({
        where,
        order,
        include: [
          { model: User, include: [UserProfile] },
          { model: Tag }
        ]
      });
 
      const tags = await Tag.findAll({ order: [['name', 'ASC']] });
 
      res.render('index', {
        title: 'Prelovetinaja - Jual Beli Barang Preloved',
        items,
        tags,
        search,
        sort,
        message,
        formatRupiah,
        formatDate,
        truncate
      });
    } catch (error) {
      res.redirect(`/?errors=${encodeURIComponent(error.message)}`);
    }
  }
 
  // GET /items
  static async myItems(req, res) {
    try {
      const items = await Item.findAll({
        where: { UserId: req.session.user.id },
        order: [['createdAt', 'DESC']],
        include: [{ model: Tag }]
      });
 
      const { message, errors } = req.query;
      let errorArr = errors ? decodeURIComponent(errors).split(',') : [];
 
      res.render('items/index', {
        title: 'Item Saya',
        items,
        message,
        errors: errorArr,
        formatRupiah,
        formatDate,
        truncate
      });
    } catch (error) {
      res.redirect(`/items?errors=${encodeURIComponent(error.message)}`);
    }
  }

    // GET /items/detail/:id
  static async showDetail(req, res) {
    try {
      // eager loading
      const item = await Item.findByPk(req.params.id, {
        include: [
          { model: User, include: [UserProfile] },
          { model: Tag }
        ]
      });

      if (!item) {
        return res.redirect(`/?errors=${encodeURIComponent('Item tidak ditemukan')}`);
      }

      const { message } = req.query;

      res.render('items/detail', {
        title: item.name,
        item,
        message,
        formatRupiah,
        formatDate
      });
    } catch (error) {
      res.redirect(`/?errors=${encodeURIComponent(error.message)}`);
    }
  }
 
  // GET /items/add
  static async showAdd(req, res) {
    try {
      const tags = await Tag.findAll({ order: [['name', 'ASC']] });
      const { errors } = req.query;
      let errorArr = errors ? decodeURIComponent(errors).split(',') : [];
 
      res.render('items/add', {
        title: 'Tambah Item',
        tags,
        errors: errorArr
      });
    } catch (error) {
      res.redirect(`/items/add?errors=${encodeURIComponent(error.message)}`);
    }
  }
 
  // multer middleware
  static upload(req, res, next) {
    upload(req, res, (err) => {
      if (err) {
        return res.redirect(`/items/add?errors=${encodeURIComponent(err.message)}`);
      }
      next();
    });
  }
 
  // POST /items/add
  static async addItem(req, res) {
    try {
      const { name, description, price, stock, condition, tagIds } = req.body;
      const imageUrl = req.file ? '/uploads/' + req.file.filename : null;
 
      // promise chaining
      const item = await Item.create({
        name, description, price, stock, condition, imageUrl,
        UserId: req.session.user.id
      }).then(async (newItem) => {
        if (tagIds) {
          const ids = Array.isArray(tagIds) ? tagIds : [tagIds];
          await newItem.setTags(ids.map(Number));
        }
        return newItem;
      });
 
      res.redirect(`/items?message=${encodeURIComponent(`Item "${item.name}" berhasil ditambahkan!`)}`);
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        const errors = error.errors.map(e => e.message);
        return res.redirect(`/items/add?errors=${encodeURIComponent(errors)}`);
      }
      res.redirect(`/items/add?errors=${encodeURIComponent(error.message)}`);
    }
  }
 
  // GET /items/:id/edit
  static async showEdit(req, res) {
    try {
      const item = await Item.findByPk(req.params.id, { include: [Tag] });
      const tags = await Tag.findAll({ order: [['name', 'ASC']] });
      const selectedTagIds = item.Tags ? item.Tags.map(t => t.id) : [];
      const { errors } = req.query;
      let errorArr = errors ? decodeURIComponent(errors).split(',') : [];
 
      res.render('items/edit', {
        title: 'Edit Item',
        item,
        tags,
        selectedTagIds,
        errors: errorArr,
        formatRupiah
      });
    } catch (error) {
      res.redirect(`/items?errors=${encodeURIComponent(error.message)}`);
    }
  }
 
  // POST /items/:id/edit
  static async editItem(req, res) {
    try {
      const { name, description, price, stock, condition, tagIds } = req.body;
      const imageUrl = req.file ? '/uploads/' + req.file.filename : req.body.existingImageUrl;
 
      // promise chaining
      await Item.update(
        { name, description, price, stock, condition, imageUrl },
        { where: { id: req.params.id }, validate: true }
      ).then(async () => {
        const item = await Item.findByPk(req.params.id);
        const ids = tagIds ? (Array.isArray(tagIds) ? tagIds : [tagIds]) : [];
        await item.setTags(ids.map(Number));
      });
 
      res.redirect(`/items?message=${encodeURIComponent('Item berhasil diperbarui!')}`);
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        const errors = error.errors.map(e => e.message);
        return res.redirect(`/items/${req.params.id}/edit?errors=${encodeURIComponent(errors)}`);
      }
      res.redirect(`/items/${req.params.id}/edit?errors=${encodeURIComponent(error.message)}`);
    }
  }
 
  // POST /items/:id/delete
  static async deleteItem(req, res) {
    try {
      // promise chaining - notifikasi delete
      await Item.findByPk(req.params.id)
        .then(item => {
          if (!item) throw new Error('Item tidak ditemukan');
          const itemName = item.name;
          return Item.destroy({ where: { id: req.params.id } })
            .then(() => itemName);
        })
        .then(itemName => {
          res.redirect(`/items?message=${encodeURIComponent(`Item "${itemName}" berhasil dihapus.`)}`);
        });
    } catch (error) {
      res.redirect(`/items?errors=${encodeURIComponent(error.message)}`);
    }
  }

}
 
module.exports = ItemController;