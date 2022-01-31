const crudHelper = require('crud-helper');
const categoryModel = require('../models/category');
const extra = require('../helpers/extra');


module.exports = {
    create: crudHelper.create(categoryModel,(req)=>{
        const {name,type, age, pandas} = req.body;
        return {name,type, age, pandas};
    }),
    getByMany: crudHelper.get(categoryModel,'find',(req)=>{
        return {};
    }),
    getById: crudHelper.get(categoryModel,'findOne',(req)=>{
        return {_id: req.params.id};
    }),
    updateById: crudHelper.update(categoryModel,'findOneAndUpdate',(req)=>{
        return {_id: req.params.id};
    },(req)=>{
        const {name, type, age, pandas} = req.body;
        const myBody = {name, type, age, pandas};
        return extra.flexible(myBody);
    }),
    deleteById: crudHelper.delete(categoryModel,'findOneAndUpdate',(req)=>{
    return {_id: req.params.id};
    }),

}
