const params = process.argv.slice(2);

export let isScope = params.includes('--scope');
export let isCallStack = params.includes('--stack');
