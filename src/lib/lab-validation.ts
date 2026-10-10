import { parseDocument } from 'yaml';
import type { LabCriterionValidationResult } from '@/data/labs';

type ObjectValue = Record<string, unknown>;
function object(value: unknown): ObjectValue {
  return value !== null && typeof value === 'object' && !Array.isArray(value) ? value as ObjectValue : {};
}

export function validateKubernetesCriterion(code: string, criterion: 'probe' | 'memory' | 'security'): LabCriterionValidationResult {
  try {
    const document = parseDocument(code, { uniqueKeys: true });
    if (document.errors.length) throw new Error('Fix YAML syntax and duplicate keys before validating.');
    const resource = object(document.toJS({ maxAliasCount: 20 }));
    const pod = object(object(object(resource.spec).template).spec);
    const containers = pod.containers;
    if (resource.kind !== 'Deployment' || resource.apiVersion !== 'apps/v1' ||
      !Array.isArray(containers) || !containers.length || containers.some((container) => !object(container).name)) {
      throw new Error('Provide an apps/v1 Deployment with containers under spec.template.spec.');
    }
    const passed = containers.every((value) => {
      const container = object(value);
      if (criterion === 'probe') {
        const httpGet = object(object(container.livenessProbe).httpGet);
        return (httpGet.path === '/healthz' || httpGet.path === '/health') &&
          (typeof httpGet.port === 'string' || (Number.isInteger(httpGet.port) && Number(httpGet.port) > 0 && Number(httpGet.port) <= 65535));
      }
      if (criterion === 'memory') {
        const limits = object(object(container.resources).limits);
        const match = String(limits.memory ?? '').match(/^(\d+(?:\.\d+)?)(Ki|Mi|Gi|Ti|K|M|G|T)?$/);
        if (!match) return false;
        const units: Record<string, number> = { Ki: 1024, Mi: 1024 ** 2, Gi: 1024 ** 3, Ti: 1024 ** 4, K: 1000, M: 1000 ** 2, G: 1000 ** 3, T: 1000 ** 4 };
        return Number(match[1]) * (units[match[2]] ?? 1) >= 256 * 1024 ** 2;
      }
      const context = { ...object(pod.securityContext), ...object(container.securityContext) };
      return context.runAsNonRoot === true && Number.isInteger(context.runAsUser) && Number(context.runAsUser) > 0;
    });
    const feedback = {
      probe: passed ? 'Container liveness probes target a health endpoint.' : 'Every container needs a liveness HTTP probe at /healthz or /health with a valid port.',
      memory: passed ? 'Container memory limits are at least 256Mi.' : 'Set resources.limits.memory to at least 256Mi on every container.',
      security: passed ? 'All containers enforce a non-root UID.' : 'Set runAsNonRoot: true and a positive runAsUser at pod or container level.',
    };
    return { passed, feedback: feedback[criterion] };
  } catch (error) {
    return { passed: false, feedback: error instanceof Error ? error.message : 'Invalid Kubernetes YAML.' };
  }
}

// Keep quoted strings intact while excluding comments from text-based Dockerfile/HCL checks.
export function stripCodeComments(code: string, language: 'dockerfile' | 'hcl'): string {
  if (language === 'dockerfile') return code.split('\n').filter((line) => !line.trimStart().startsWith('#')).join('\n');
  return code.replace(/"(?:\\.|[^"\\])*"|\/\*[\s\S]*?\*\/|#[^\n]*|\/\/[^\n]*/g, (token) =>
    token.startsWith('"') ? token : token.replace(/[^\n]/g, ' '));
}
