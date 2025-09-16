export class GiftModel {
  id!: string;
  name!: string;
  description!: string;
  price!: number;
  status!: GiftStatus;
  blocked_at!: Date;
  image!: string;
  link!: string;
  store!: string;
  presentOwner!: PresentOwnerModel;
}

export class PresentOwnerModel {
  id!: string;
  name!: string;
  createdAt!: Date;
  updatedAt!: Date;
}

export enum GiftStatus {
  AVAILABLE = 'disponível',
  BLOCK = 'reservado',
  SOLD = 'comprado',
  RESERVED = 'reservado',
}

export enum GiftStatusEnum {
  AVAILABLE = 'AVAILABLE',
  BLOCK = 'BLOCK',
  SOLD = 'SOLD',
  RESERVED = 'RESERVED',
}
