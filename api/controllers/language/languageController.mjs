import { SuperfaceClient } from '@superfaceai/one-sdk';

const sdk = new SuperfaceClient({
  sdkAuthToken: process.env.SUPERFACE_SDK_TOKEN,
});

export const getCountryInfo = async (req, res, next) => {
  const profile = await sdk.getProfile('address/ip-geolocation@1.0.1');
  const result = await profile.getUseCase('IpGeolocation').perform(
    { ipAddress: req.ip },
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
    console.log(data);
    res.status(200).json({
      status: 'success',
      data,
    });
    // req.country_code = data.addressCountryCode.toLowerCase();
  } catch (error) {
    res.status(500).json({
      status: 'error',
      data: error,
    });
  }
};
