if (!process.env.npm_config_user_agent?.startsWith('pnpm/')) {
  console.error('Use pnpm to install dependencies in this repository.');
  process.exit(1);
}
