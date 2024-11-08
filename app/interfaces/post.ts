import { ModelObject } from "@adonisjs/lucid/types/model";
import { AttachmentResponse } from "app/interfaces/attachment";
import { BaseEntity } from "app/interfaces/base-entity";
import { UUID } from "crypto";

export interface PostResponse extends BaseEntity {
 id: UUID,
 content: string,
 user: ModelObject, // TODO: Complete this.
 attachments: {
  images: AttachmentResponse[];
 }
}
