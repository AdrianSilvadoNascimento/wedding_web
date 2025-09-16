export interface PresentOwnerRequest {
  name: string;
  action: 'RESERVED' | 'SOLD';
  notes?: string;
  estimated_delivery?: string;
}

export interface PresentOwnerResponse {
  id: string;
  name: string;
  notes: string;
  estimated_delivery: string;
  gift_id: string;
  created_at: string;
  updated_at: string;
}
