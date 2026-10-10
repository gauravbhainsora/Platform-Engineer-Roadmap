import { describe, expect, it } from 'vitest';
import { LAB_CHALLENGES, validateLabChallenge } from '@/data/labs';

describe('Lab validation respects active configuration', () => {
  it.each(LAB_CHALLENGES)('rejects comment-only solutions for $id', (lab) => {
    const commented = lab.modelSolution.split('\n').map((line) => `# ${line}`).join('\n');
    expect(validateLabChallenge(lab, commented).passed).toBe(false);
  });
  const kubernetes = LAB_CHALLENGES.find((lab) => lab.language === 'yaml')!;
  it('rejects malformed YAML and duplicate keys', () => {
    expect(validateLabChallenge(kubernetes, `${kubernetes.modelSolution}\nkind: Pod`).passed).toBe(false);
    expect(validateLabChallenge(kubernetes, 'apiVersion: [').passed).toBe(false);
  });
  it('ignores matching values in annotations instead of the pod spec', () => {
    const code = kubernetes.starterCode.replace('/healtzh', '/wrong') + '\n# path: /healthz\n# runAsNonRoot: true\n# limits:\n#   memory: 512Mi';
    expect(validateLabChallenge(kubernetes, code).passed).toBe(false);
  });
  it('rejects a root container overriding a safe pod security context', () => {
    const code = kubernetes.modelSolution.replace('- name: web', '- name: web\n        securityContext:\n          runAsUser: 0');
    expect(validateLabChallenge(kubernetes, code).results.find((result) => result.id === 'security-fix')?.passed).toBe(false);
  });
  it.each(LAB_CHALLENGES)('still accepts the model solution for $id', (lab) => {
    expect(validateLabChallenge(lab, lab.modelSolution).passed).toBe(true);
  });
});
