module.exports = (Schema) => {
    return new Schema({
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        journal: { type: Schema.Types.ObjectId, ref: 'Journal' },
        customer: { type: Schema.Types.ObjectId, ref: 'Customer' },
        particular: { type: Schema.Types.ObjectId, ref: 'Particular' },
        amount: { type: Number },
        is_cancled: { type: Boolean, default: false },
    }, { timestamps: true });
}
