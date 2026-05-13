import { Schema, model, type InferSchemaType } from 'mongoose';

const pageSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    template_type: {
      type: String,
      required: true,
      enum: ['geo', 'industry', 'pillar', 'solution', 'conversion'],
    },
    meta: {
      title: { type: String, required: true, maxlength: 60 },
      description: { type: String, required: true, maxlength: 160 },
      canonical_url: { type: String, required: true },
      og_image_url: { type: String },
    },
    sections: { type: Schema.Types.Mixed, default: {} },
    status: { type: String, enum: ['live', 'draft'], default: 'live', index: true },
    noindex: { type: Boolean, default: false },
    sitemap_shard: { type: Number, required: true, index: true },
    rank_history: [
      { date: Date, position: Number, impressions: Number },
    ],
    // render state (new for static POC)
    render_state: {
      type: String,
      enum: ['pending', 'rendering', 'done', 'failed'],
      default: 'pending',
      index: true,
    },
    rendered_at: { type: Date },
    s3_etag: { type: String },
    s3_size_bytes: { type: Number },
    render_failures: [
      {
        at: Date,
        error: String,
        retry_count: Number,
      },
    ],
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

pageSchema.index({ status: 1, sitemap_shard: 1 });
pageSchema.index({ template_type: 1 });
pageSchema.index({ updated_at: -1 });

export type PageDoc = InferSchemaType<typeof pageSchema>;
export const Page = model('Page', pageSchema);
