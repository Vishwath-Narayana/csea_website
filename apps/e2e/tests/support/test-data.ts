const E2E_DATA_PREFIX = process.env.E2E_DATA_PREFIX ?? 'e2e';

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export function makeE2eSlug(scope: string, name: string) {
  return [E2E_DATA_PREFIX, scope, slugify(name)].filter(Boolean).join('-');
}

export function makeE2eTitle(scope: string, name: string) {
  return `[${E2E_DATA_PREFIX.toUpperCase()}] ${scope}: ${name}`;
}

export function makeE2eEmail(roleOrName: string) {
  return `${E2E_DATA_PREFIX}-${slugify(roleOrName)}@csea.kitsw.ac.in`;
}

export function isE2eValue(value: string | null | undefined) {
  return !!value && value.startsWith(`${E2E_DATA_PREFIX}-`);
}
