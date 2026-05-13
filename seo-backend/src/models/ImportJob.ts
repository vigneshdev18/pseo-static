import { Schema, model, type InferSchemaType } from 'mongoose';

const importJobSchema = new Schema(
  {
    job_id: { type: String, required: true, unique: true },
    source_path: { type: String, required: true },
    file_sha256: { type: String, index: true },
    status: {
      type: String,
      enum: ['queued', 'running', 'done', 'failed'],
      default: 'queued',
      index: true,
    },
    total_rows: { type: Number, default: 0 },
    processed: { type: Number, default: 0 },
    failed: { type: Number, default: 0 },
    conflicts: [
      { row: Number, slug: String, reason: String },
    ],
    affected_shards: [{ type: Number }],
    render_jobs_enqueued: { type: Number, default: 0 },
    error: { type: String },
    completed_at: { type: Date },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

export type ImportJobDoc = InferSchemaType<typeof importJobSchema>;
export const ImportJob = model('ImportJob', importJobSchema);
