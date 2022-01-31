const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category');

router.route('/')
    .post(
        categoryController.create
    )
    .get(
        categoryController.getByMany
    )

router.route('/:id')
    .get(
        categoryController.getById
    )
    .put(
        categoryController.updateById
    )
    .delete(
        categoryController.deleteById
    )


module.exports = router;
