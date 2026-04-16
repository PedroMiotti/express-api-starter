const userAgent = process.env.npm_config_user_agent || '';

if (!userAgent.startsWith('pnpm/')) {
  console.error('Only pnpm allowed. Run: pnpm install');
  process.exit(1);
}
