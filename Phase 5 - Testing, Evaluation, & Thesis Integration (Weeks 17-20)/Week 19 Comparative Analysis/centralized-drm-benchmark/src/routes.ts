/**
 * REST API routes implementing the same 6 content rights operations
 * as the blockchain pallet.
 *
 * Each route wraps its logic in a SQLite transaction to match the
 * atomic extrinsic semantics of the blockchain.
 *
 * @module routes
 */

import { Router, Request, Response } from 'express';
import { getDb } from './database.js';

const router = Router();

function queryOne(sql: string, params: any[] = []): any {
  const db = getDb();
  const stmt = db.prepare(sql);
  stmt.bind(params);
  if (stmt.step()) {
    const row = stmt.getAsObject();
    stmt.free();
    return row;
  }
  stmt.free();
  return null;
}

function exec(sql: string, params: any[] = []): void {
  const db = getDb();
  const stmt = db.prepare(sql);
  stmt.bind(params);
  stmt.step();
  stmt.free();
}

function lastInsertId(): number {
  const row = queryOne('SELECT last_insert_rowid() as id');
  return row ? row.id : 0;
}

/** POST /content — mirrors register_content extrinsic. */
router.post('/content', (req: Request, res: Response) => {
  const start = process.hrtime.bigint();
  const { creatorId, metadataHash, title, subscriptionPrice, ppvPrice, ownershipPrice, periodLength } = req.body;

  try {
    const db = getDb();
    db.run('BEGIN');

    const balance = queryOne('SELECT amount FROM balance WHERE user_id = ?', [creatorId]);
    if (!balance || balance.amount < 1) {
      db.run('ROLLBACK');
      return res.status(400).json({ error: 'InsufficientBalance' });
    }
    exec('UPDATE balance SET amount = amount - 1 WHERE user_id = ?', [creatorId]);
    exec(
      'INSERT INTO content (creator_id, metadata_hash, title, subscription_price, ppv_price, ownership_price, period_length) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [creatorId, metadataHash, title, subscriptionPrice, ppvPrice, ownershipPrice, periodLength]
    );
    const contentId = lastInsertId();
    exec('INSERT INTO event_log (event_type, payload) VALUES (?, ?)', ['ContentRegistered', JSON.stringify({ contentId, creatorId })]);

    db.run('COMMIT');
    const elapsed = Number(process.hrtime.bigint() - start) / 1e6;
    res.json({ contentId, latencyMs: elapsed });
  } catch (e: any) {
    getDb().run('ROLLBACK');
    res.status(400).json({ error: e.message });
  }
});

/** POST /content/:id/subscribe — mirrors subscribe extrinsic. */
router.post('/content/:id/subscribe', (req: Request, res: Response) => {
  const start = process.hrtime.bigint();
  const contentId = parseInt(req.params.id);
  const { userId } = req.body;

  try {
    const db = getDb();
    db.run('BEGIN');

    const content = queryOne('SELECT * FROM content WHERE content_id = ?', [contentId]);
    if (!content) { db.run('ROLLBACK'); return res.status(400).json({ error: 'ContentNotFound' }); }

    const existing = queryOne('SELECT 1 as x FROM subscription WHERE content_id = ? AND user_id = ?', [contentId, userId]);
    if (existing) { db.run('ROLLBACK'); return res.status(400).json({ error: 'SubscriptionAlreadyExists' }); }

    const balance = queryOne('SELECT amount FROM balance WHERE user_id = ?', [userId]);
    if (!balance || balance.amount < content.subscription_price) {
      db.run('ROLLBACK');
      return res.status(400).json({ error: 'InsufficientBalance' });
    }
    exec('UPDATE balance SET amount = amount - ? WHERE user_id = ?', [content.subscription_price, userId]);
    exec('UPDATE balance SET amount = amount + ? WHERE user_id = ?', [content.subscription_price, content.creator_id]);

    const expiryTime = new Date(Date.now() + content.period_length * 1000).toISOString();
    exec('INSERT INTO subscription (content_id, user_id, expiry_time) VALUES (?, ?, ?)', [contentId, userId, expiryTime]);
    exec('INSERT INTO event_log (event_type, payload) VALUES (?, ?)', ['Subscribed', JSON.stringify({ contentId, userId })]);

    db.run('COMMIT');
    const elapsed = Number(process.hrtime.bigint() - start) / 1e6;
    res.json({ contentId, userId, expiryTime, latencyMs: elapsed });
  } catch (e: any) {
    getDb().run('ROLLBACK');
    res.status(400).json({ error: e.message });
  }
});

/** POST /content/:id/views — mirrors purchase_views extrinsic. */
router.post('/content/:id/views', (req: Request, res: Response) => {
  const start = process.hrtime.bigint();
  const contentId = parseInt(req.params.id);
  const { userId, numViews } = req.body;

  try {
    const db = getDb();
    db.run('BEGIN');

    const content = queryOne('SELECT * FROM content WHERE content_id = ?', [contentId]);
    if (!content) { db.run('ROLLBACK'); return res.status(400).json({ error: 'ContentNotFound' }); }

    const totalCost = content.ppv_price * numViews;
    const balance = queryOne('SELECT amount FROM balance WHERE user_id = ?', [userId]);
    if (!balance || balance.amount < totalCost) {
      db.run('ROLLBACK');
      return res.status(400).json({ error: 'InsufficientBalance' });
    }
    exec('UPDATE balance SET amount = amount - ? WHERE user_id = ?', [totalCost, userId]);
    exec('UPDATE balance SET amount = amount + ? WHERE user_id = ?', [totalCost, content.creator_id]);

    const existing = queryOne('SELECT 1 as x FROM view_pack WHERE content_id = ? AND user_id = ?', [contentId, userId]);
    if (existing) {
      exec('UPDATE view_pack SET views_remaining = ? WHERE content_id = ? AND user_id = ?', [numViews, contentId, userId]);
    } else {
      exec('INSERT INTO view_pack (content_id, user_id, views_remaining) VALUES (?, ?, ?)', [contentId, userId, numViews]);
    }
    exec('INSERT INTO event_log (event_type, payload) VALUES (?, ?)', ['ViewsPurchased', JSON.stringify({ contentId, userId, numViews })]);

    db.run('COMMIT');
    const elapsed = Number(process.hrtime.bigint() - start) / 1e6;
    res.json({ contentId, userId, numViews, latencyMs: elapsed });
  } catch (e: any) {
    getDb().run('ROLLBACK');
    res.status(400).json({ error: e.message });
  }
});

/** POST /content/:id/consume — mirrors consume_view extrinsic. */
router.post('/content/:id/consume', (req: Request, res: Response) => {
  const start = process.hrtime.bigint();
  const contentId = parseInt(req.params.id);
  const { userId } = req.body;

  try {
    const db = getDb();
    db.run('BEGIN');

    const pack = queryOne('SELECT * FROM view_pack WHERE content_id = ? AND user_id = ?', [contentId, userId]);
    if (!pack) { db.run('ROLLBACK'); return res.status(400).json({ error: 'ViewPackNotFound' }); }
    if (pack.views_remaining <= 0) { db.run('ROLLBACK'); return res.status(400).json({ error: 'NoViewsRemaining' }); }

    exec('UPDATE view_pack SET views_remaining = views_remaining - 1 WHERE content_id = ? AND user_id = ?', [contentId, userId]);
    exec('INSERT INTO event_log (event_type, payload) VALUES (?, ?)', ['ViewConsumed', JSON.stringify({ contentId, userId })]);

    db.run('COMMIT');
    const elapsed = Number(process.hrtime.bigint() - start) / 1e6;
    res.json({ contentId, userId, latencyMs: elapsed });
  } catch (e: any) {
    getDb().run('ROLLBACK');
    res.status(400).json({ error: e.message });
  }
});

/** POST /content/:id/own — mirrors purchase_ownership extrinsic. */
router.post('/content/:id/own', (req: Request, res: Response) => {
  const start = process.hrtime.bigint();
  const contentId = parseInt(req.params.id);
  const { userId } = req.body;

  try {
    const db = getDb();
    db.run('BEGIN');

    const content = queryOne('SELECT * FROM content WHERE content_id = ?', [contentId]);
    if (!content) { db.run('ROLLBACK'); return res.status(400).json({ error: 'ContentNotFound' }); }

    const existing = queryOne('SELECT 1 as x FROM ownership WHERE content_id = ? AND user_id = ?', [contentId, userId]);
    if (existing) { db.run('ROLLBACK'); return res.status(400).json({ error: 'AlreadyOwned' }); }

    const balance = queryOne('SELECT amount FROM balance WHERE user_id = ?', [userId]);
    if (!balance || balance.amount < content.ownership_price) {
      db.run('ROLLBACK');
      return res.status(400).json({ error: 'InsufficientBalance' });
    }
    exec('UPDATE balance SET amount = amount - ? WHERE user_id = ?', [content.ownership_price, userId]);
    exec('UPDATE balance SET amount = amount + ? WHERE user_id = ?', [content.ownership_price, content.creator_id]);

    exec('INSERT INTO ownership (content_id, user_id) VALUES (?, ?)', [contentId, userId]);
    exec('INSERT INTO event_log (event_type, payload) VALUES (?, ?)', ['OwnershipPurchased', JSON.stringify({ contentId, userId })]);

    db.run('COMMIT');
    const elapsed = Number(process.hrtime.bigint() - start) / 1e6;
    res.json({ contentId, userId, latencyMs: elapsed });
  } catch (e: any) {
    getDb().run('ROLLBACK');
    res.status(400).json({ error: e.message });
  }
});

/** GET /content/:id/access/:userId — mirrors check_access extrinsic. */
router.get('/content/:id/access/:userId', (req: Request, res: Response) => {
  const start = process.hrtime.bigint();
  const contentId = parseInt(req.params.id);
  const userId = req.params.userId;

  const owned = queryOne('SELECT 1 as x FROM ownership WHERE content_id = ? AND user_id = ?', [contentId, userId]);
  if (owned) {
    const elapsed = Number(process.hrtime.bigint() - start) / 1e6;
    return res.json({ contentId, userId, hasAccess: true, accessType: 'ownership', latencyMs: elapsed });
  }

  const sub = queryOne('SELECT expiry_time FROM subscription WHERE content_id = ? AND user_id = ?', [contentId, userId]);
  if (sub && new Date(sub.expiry_time) > new Date()) {
    const elapsed = Number(process.hrtime.bigint() - start) / 1e6;
    return res.json({ contentId, userId, hasAccess: true, accessType: 'subscription', latencyMs: elapsed });
  }

  const pack = queryOne('SELECT views_remaining FROM view_pack WHERE content_id = ? AND user_id = ?', [contentId, userId]);
  if (pack && pack.views_remaining > 0) {
    const elapsed = Number(process.hrtime.bigint() - start) / 1e6;
    return res.json({ contentId, userId, hasAccess: true, accessType: 'views', latencyMs: elapsed });
  }

  const elapsed = Number(process.hrtime.bigint() - start) / 1e6;
  res.json({ contentId, userId, hasAccess: false, accessType: 'none', latencyMs: elapsed });
});

/** POST /setup/balance — utility endpoint to fund test accounts. */
router.post('/setup/balance', (req: Request, res: Response) => {
  const { userId, amount } = req.body;
  const existing = queryOne('SELECT 1 as x FROM balance WHERE user_id = ?', [userId]);
  if (existing) {
    exec('UPDATE balance SET amount = ? WHERE user_id = ?', [amount, userId]);
  } else {
    exec('INSERT INTO balance (user_id, amount) VALUES (?, ?)', [userId, amount]);
  }
  res.json({ userId, amount });
});

/** POST /setup/reset — utility endpoint to reset database. */
router.post('/setup/reset', (_req: Request, res: Response) => {
  getDb().run('DELETE FROM event_log; DELETE FROM ownership; DELETE FROM view_pack; DELETE FROM subscription; DELETE FROM content; DELETE FROM balance;');
  res.json({ status: 'reset' });
});

export default router;
