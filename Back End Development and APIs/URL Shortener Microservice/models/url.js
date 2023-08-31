import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const urlSchema = new Schema({
    originalUrl: {
        type: String,
        required: true
    },
    shortUrl: {
        type: Number,
        required: true,
        unique: true
    }
});

const Url = model("Url", urlSchema);

export default Url;
