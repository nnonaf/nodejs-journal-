module.exports = (Schema) => {
    return new Schema({
        name: { type: String, required: true, unique: true },
        is_cancled: { type: Boolean, default: false },
    }, { timestamps: true });
}