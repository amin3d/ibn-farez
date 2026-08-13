export async function register() {
  if (process.env.NODE_ENV !== "development") return;

  const { startPoemDevServer } = await import("./scripts/poem-dev-server.mjs");
  startPoemDevServer();
}
