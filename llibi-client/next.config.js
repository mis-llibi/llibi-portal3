// const isProd = process.env.NODE_ENV === 'production'

// const nextConfig = {
//   env: {
//     backEndUrl: isProd
//       ? 'https://portal.llibi.app/server'
//       : 'http://localhost:8000',
//     apiPath: '/api',
//     llibiDigitalOceanSpaces: process.env.NEXT_PUBLIC_LLIBI_DIGITALOCEAN_SPACES,
//     LLIBIXADMU_KEY: process.env.NEXT_PUBLIC_LLIBIXADMU_KEY,
//     PUSHER_APP_KEY: process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
//     PUSHER_APP_CLUSTER: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
//   },
//   trailingSlash: true,
//   basePath: isProd ? '/server' : '',
// //   assetPrefix: '/server',
//   //basePath: isProd ? '/portal' : '',
//   assetPrefix: isProd ? 'https://portal.llibi.app' : 'http://localhost:3000',
// }

// module.exports = nextConfig



const isProd = process.env.NODE_ENV === 'production'

const nextConfig = {
  env: {
    backEndUrl: isProd
    //   ? 'https://test.backend.llibi.app'
      ? "https://portal.backend.llibi.app"
      : 'http://localhost:8000',
    apiPath: '/api',
    llibiDigitalOceanSpaces: process.env.NEXT_PUBLIC_LLIBI_DIGITALOCEAN_SPACES,
    LLIBIXADMU_KEY: process.env.NEXT_PUBLIC_LLIBIXADMU_KEY,
    PUSHER_APP_KEY: process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
    PUSHER_APP_CLUSTER: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
  },
  trailingSlash: true,
  basePath: '',
  //basePath: isProd ? '/portal' : '',
  // assetPrefix: isProd ? 'https://portal.llibi.app' : 'http://localhost:3000',
}

module.exports = nextConfig
