const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    type: {
        type: String,
        trim: true,
        required: true,
    },
    age: {
        type: Number,
        trim: true,
        min: 50,
        max: 100,
        required: true
    },
    pandas: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Panda'
    }],
    deleted: {
        _state: {
            type: Boolean,
            default: false
        },
        _at: {
            type: Date,
        }
    },
    created: {
        _at: {
            type: Date,
            default: () => Date.now()
        }
    }
});

// index all string attributes for search
CategorySchema.index({'$**': 'text'});

//*********  for soft remove ********* 
CategorySchema.pre('aggregate', function () {
    if(this._pipeline[0]['$match'].deleted === undefined)
        this._pipeline[0]['$match'].deleted = {_state: false};
});

CategorySchema.pre('countDocuments', function () {
    if(this._conditions.deleted === undefined)
        this.where({deleted: {_state: false}});
});

CategorySchema.pre('find', function () {
    if(this._conditions.deleted === undefined)
        this.where({deleted: {_state: false}});
    this.populate('pandas');
});

CategorySchema.pre('findOne', function () {
    if(this._conditions.deleted === undefined)
        this.where({deleted: {_state: false}});
    this.populate('pandas');
});

CategorySchema.pre('findOneAndUpdate', function () {
    if(this._conditions.deleted === undefined)
        this.where({deleted: {_state: false}});
    this.options.new = true;
    this.options.runValidators = true;

});

module.exports = mongoose.model('Category', CategorySchema);

