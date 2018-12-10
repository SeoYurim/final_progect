const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;

var schema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  title: {type: String, trim: true, required: true},
  content: {type: String, trim: true, required: true},
  tags: [String],
  sponsor: {type: String, trim: true, required: true},
  intro: {type : String, trim: true, required: true},
  details: {type:String, trim: true, required: true},
  category: {type:String, trim: true, required: true},
  start: {type:Date},
  end: {type:Date},
  file: {type : Schema.Types.Mixed },
  host: {type:String, trim: true, required: true},
  contact: {type:String, trim: true, required: true},
  contact_email: {type:String, trim: true, required: true },
  numLikes: {type: Number, default: 0},
  numAnswers: {type: Number, default: 0},
  numReads: {type: Number, default: 0},
  createdAt: {type: Date, default: Date.now}
}, {
  toJSON: { virtuals: true},
  toObject: {virtuals: true}
});
schema.plugin(mongoosePaginate);
var Contest = mongoose.model('Contest', schema);

module.exports = Contest;