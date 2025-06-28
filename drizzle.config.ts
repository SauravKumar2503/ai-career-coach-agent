// import 'dotenv/config';
// import { defineConfig } from 'drizzle-kit';

// export default defineConfig({

//     schema: './configs/schema.ts',
//     dialect: 'postgresql',
//     dbCredentials: {
//         url: process.env.NEXT_PUBLIC_NEON_DB_CONNECTION_STRING!,
//     },
// });



import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({

    schema: './configs/schema.ts',
    out: './drizzle/migrations',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.NEXT_PUBLIC_NEON_DB_CONNECTION_STRING!,
    },
});
