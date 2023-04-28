import { SuperfaceClient } from '@superfaceai/one-sdk';

const sdk = new SuperfaceClient({
  sdkAuthToken: process.env.SUPERFACE_SDK_TOKEN,
});

export const run = async (ip) => {
  const profile = await sdk.getProfile('address/ip-geolocation@1.0.1');
  const result = await profile.getUseCase('IpGeolocation').perform(
    { ipAddress: '162.19.208.190' },
    {
      provider: 'ipdata',
      security: {
        apikey: {
          apikey: process.env.IPDATA_API_KEY,
        },
      },
    }
  );
  try {
    const data = result.unwrap();
    return data;
  } catch (error) {
    console.error(error);
  }
};
