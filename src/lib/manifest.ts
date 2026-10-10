export interface ManifestInputs {
  appName: string; image: string; replicas: number; port: number; cpuLimit: string; memLimit: string;
}

export function validateManifestInputs(inputs: ManifestInputs): string[] {
  const errors: string[] = [];
  if (!/^[a-z]([-a-z0-9]*[a-z0-9])?$/.test(inputs.appName) || inputs.appName.length > 63) {
    errors.push('Service name must start with a lowercase letter and contain at most 63 lowercase letters, digits, or hyphens.');
  }
  if (!/^[a-zA-Z0-9][a-zA-Z0-9./_:@-]*$/.test(inputs.image)) errors.push('Enter a container image reference without whitespace or YAML characters.');
  if (!Number.isInteger(inputs.port) || inputs.port < 1 || inputs.port > 65535) errors.push('Target port must be an integer between 1 and 65535.');
  if (!Number.isInteger(inputs.replicas) || inputs.replicas < 1 || inputs.replicas > 10) errors.push('Replicas must be an integer between 1 and 10.');
  const cpu = inputs.cpuLimit.match(/^(\d+(?:\.\d{1,3})?)(m)?$/);
  const cpuCores = cpu ? Number(cpu[1]) / (cpu[2] ? 1000 : 1) : 0;
  if (!cpu || !Number.isFinite(cpuCores) || (cpu[2] && !Number.isInteger(Number(cpu[1]))) || cpuCores < 0.1) errors.push('CPU limit must be at least the 100m request (for example 500m or 1).');
  const memory = inputs.memLimit.match(/^(\d+(?:\.\d+)?)(Ki|Mi|Gi|Ti|K|M|G|T)?$/);
  const units: Record<string, number> = { Ki: 1024, Mi: 1024 ** 2, Gi: 1024 ** 3, Ti: 1024 ** 4, K: 1000, M: 1000 ** 2, G: 1000 ** 3, T: 1000 ** 4 };
  const memoryBytes = memory ? Number(memory[1]) * (units[memory[2]] ?? 1) : 0;
  if (!memory || !Number.isFinite(memoryBytes) || memoryBytes < 128 * 1024 ** 2) errors.push('Memory limit must be at least the 128Mi request (for example 512Mi or 1Gi).');
  return errors;
}
