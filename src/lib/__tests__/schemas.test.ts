import { describe, it, expect } from 'vitest';
import {
  parseContract,
  parseContractList,
  parseReputation,
  parseStats,
} from '../schemas';

const validContract = {
  id: 1,
  title: 'Job',
  client: 'GCLIENT',
  freelancer: 'GFREE',
  token: 'USDC',
  milestones: [{ index: 0, title: 'M1', amount: 100, released: false }],
  totalAmount: 100,
  fundedAmount: 100,
  releasedAmount: 0,
  status: 'Funded',
  reputationIssued: false,
  extraIgnored: true,
};

describe('parseContract', () => {
  it('accepts valid payload and extra fields', () => {
    const r = parseContract(validContract);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data.id).toBe(1);
  });

  it('fails on string amount', () => {
    const bad = {
      ...validContract,
      milestones: [{ index: 0, title: 'M1', amount: '100', released: false }],
    };
    const r = parseContract(bad);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.path).toBe('data.milestones[0].amount');
  });

  it('fails on bad status', () => {
    const r = parseContract({ ...validContract, status: 'Nope' });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.path).toBe('data.status');
  });
});

describe('parseContractList', () => {
  it('names index in path', () => {
    const r = parseContractList([validContract, { ...validContract, id: 'x' }]);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.path).toBe('data[1].id');
  });
});

describe('parseReputation', () => {
  it('ok', () => {
    const r = parseReputation({
      address: 'G',
      completedContracts: 1,
      totalRating: 5,
      averageRating: 5,
    });
    expect(r.ok).toBe(true);
  });
});

describe('parseStats', () => {
  it('requires byStatus keys', () => {
    const r = parseStats({
      contracts: 1,
      totalEscrowed: 1,
      totalReleased: 0,
      byStatus: {
        Created: 0,
        Funded: 1,
        Completed: 0,
        Disputed: 0,
        Resolved: 0,
        Cancelled: 0,
      },
    });
    expect(r.ok).toBe(true);
  });
});
