const scope = process.argv[2];

export let isScope = false;

if (scope === '--scope') {
  isScope = true;
}
