/**
 * TypeScript interfaces mirroring the blockchain pallet storage types.
 *
 * Each interface maps 1:1 to a SCALE-encoded struct in
 * pallets/content-rights/src/types.rs.
 *
 * @module types
 */

export interface Content {
  contentId: number;
  creatorId: string;
  metadataHash: string;
  title: string;
  subscriptionPrice: number;
  ppvPrice: number;
  ownershipPrice: number;
  periodLength: number;
  createdAt: string;
}

export interface Subscription {
  contentId: number;
  userId: string;
  expiryTime: string;
  createdAt: string;
}

export interface ViewPack {
  contentId: number;
  userId: string;
  viewsRemaining: number;
  createdAt: string;
}

export interface Ownership {
  contentId: number;
  userId: string;
  createdAt: string;
}

export interface AccessResult {
  contentId: number;
  userId: string;
  hasAccess: boolean;
  accessType: 'subscription' | 'views' | 'ownership' | 'none';
}
