module.exports = [
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/pg [external] (pg, esm_import)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

const mod = await __turbopack_context__.y("pg");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[project]/lib/database.js [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

// lib/database.js
__turbopack_context__.s([
    "initDB",
    ()=>initDB,
    "query",
    ()=>query
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/pg [external] (pg, esm_import)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
// Only create Pool if we're on the server side
let pool;
if ("TURBOPACK compile-time truthy", 1) {
    pool = new __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$29$__["Pool"]({
        connectionString: process.env.DATABASE_URL,
        ssl: ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : false
    });
}
async function query(text, params) {
    // Only run on server side
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const client = await pool.connect();
    try {
        const result = await client.query(text, params);
        return result;
    } finally{
        client.release();
    }
}
async function initDB() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    await query(`
    CREATE TABLE IF NOT EXISTS urls (
      id SERIAL PRIMARY KEY,
      slug VARCHAR(10) UNIQUE NOT NULL,
      original_url TEXT NOT NULL,
      clicks INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_slug ON urls(slug);
  `);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[externals]/nanoid [external] (nanoid, esm_import)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

const mod = await __turbopack_context__.y("nanoid");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[project]/pages/api/shorten.js [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

// pages/api/shorten.js
__turbopack_context__.s([
    "default",
    ()=>handler
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$database$2e$js__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/database.js [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$nanoid__$5b$external$5d$__$28$nanoid$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/nanoid [external] (nanoid, esm_import)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$database$2e$js__$5b$api$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$externals$5d2f$nanoid__$5b$external$5d$__$28$nanoid$2c$__esm_import$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$database$2e$js__$5b$api$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$externals$5d2f$nanoid__$5b$external$5d$__$28$nanoid$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
async function handler(req, res) {
    // This already only runs on server side (API routes are server-only)
    if (req.method !== 'POST') {
        return res.status(405).json({
            error: 'Method not allowed'
        });
    }
    const { url } = req.body;
    if (!url) {
        return res.status(400).json({
            error: 'URL is required'
        });
    }
    try {
        // Validate URL
        new URL(url);
        let slug;
        let exists;
        let attempts = 0;
        do {
            slug = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$nanoid__$5b$external$5d$__$28$nanoid$2c$__esm_import$29$__["nanoid"])(6);
            const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$database$2e$js__$5b$api$5d$__$28$ecmascript$29$__["query"])('SELECT slug FROM urls WHERE slug = $1', [
                slug
            ]);
            exists = result.rows.length > 0;
            attempts++;
            if (attempts > 10) {
                return res.status(500).json({
                    error: 'Failed to generate unique slug'
                });
            }
        }while (exists)
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$database$2e$js__$5b$api$5d$__$28$ecmascript$29$__["query"])('INSERT INTO urls (slug, original_url) VALUES ($1, $2)', [
            slug,
            url
        ]);
        res.status(200).json({
            slug,
            shortUrl: slug,
            originalUrl: url
        });
    } catch (error) {
        console.error('Shorten error:', error);
        if (error.message.includes('relation "urls" does not exist')) {
            return res.status(500).json({
                error: 'Database not ready. Please initialize the database first.'
            });
        }
        if (error.code === '23505') {
            return handler(req, res);
        }
        res.status(400).json({
            error: 'Invalid URL'
        });
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__3a380800._.js.map