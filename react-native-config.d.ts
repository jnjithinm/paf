// declare module 'react-native-config' {
//     export interface NativeConfig {
//         BASE_URL: string;
//     }
    
//     export const Config: NativeConfig
//     export default Config
//   }

const config = {
    development: {
      BASE_URL: 'https://dev.example.com/api',
    },
    staging: {
      BASE_URL: 'https://staging.example.com/api',
    },
    production: {
      BASE_URL: 'https://prod.example.com/api',
    },
  };
  
  export default config;