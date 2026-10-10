import { describe, expect, it } from 'vitest';
import { validateManifestInputs } from '@/lib/manifest';

const valid = { appName: 'payment-api', image: 'ghcr.io/company/payment-api:v1.2.0', replicas: 3, port: 8080, cpuLimit: '500m', memLimit: '512Mi' };
describe('Manifest input validation', () => {
  it('accepts supported inputs and resource quantities', () => {
    expect(validateManifestInputs(valid)).toEqual([]);
    expect(validateManifestInputs({ ...valid, cpuLimit: '0.1', memLimit: '1Gi' })).toEqual([]);
  });
  it.each([{ appName: 'Invalid Name' }, { appName: '1invalid' }, { image: 'nginx\nkind: Pod' },
    { port: 0 }, { port: 65536 }, { port: 1.5 }, { replicas: 0 }, { cpuLimit: '50m' },
    { cpuLimit: '500m"\nmalicious: true' }, { memLimit: '64Mi' }, { memLimit: 'nonsense' },
  ])('blocks invalid input: %j', (change) => {
    expect(validateManifestInputs({ ...valid, ...change }).length).toBeGreaterThan(0);
  });
});
