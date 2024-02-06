const isProd = process.env.NODE_ENV === 'production'

const nextConfig = {
    env: {
        backEndUrl: isProd
            ? 'https://portal.llibi.app/server'
            : 'http://localhost:8000',
        apiPath: '/api',
    },
    trailingSlash: true,
    basePath: '',
    //basePath: isProd ? '/portal' : '',
    // assetPrefix: isProd ? 'https://portal.llibi.app' : 'http://localhost:3000',
}

module.exports = nextConfig
