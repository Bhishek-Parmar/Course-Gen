/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./configs/schema.js",
    dialect: 'postgresql',
    dbCredentials: {
      url: 'postgresql://neondb_owner:npg_pHcShW9fIul2@ep-orange-union-a8sg7ysy-pooler.eastus2.azure.neon.tech/neondb?sslmode=requires',
    }
  };

  