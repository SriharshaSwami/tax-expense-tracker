const requiredEnvVars = [
  'MONGO_URI',
  'JWT_SECRET',
  'CLIENT_URL',
];

const cloudinaryEnvVars = [
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
]

export const validateEnv = () => {
  const missing = requiredEnvVars.filter((v) => !process.env[v]);
  if (missing.length > 0) {
    console.error(`❌ Missing required environment variables:\n  ${missing.join('\n  ')}`);
    process.exit(1);
  }

  if (process.env.JWT_SECRET.length < 32) {
    console.error('❌ JWT_SECRET must be at least 32 characters');
    process.exit(1);
  }

  if (process.env.NODE_ENV === 'production') {
    const missingCloudinary = cloudinaryEnvVars.filter((v) => !process.env[v])
    if (missingCloudinary.length > 0) {
      console.error(`❌ Missing required Cloudinary environment variables:\n  ${missingCloudinary.join('\n  ')}`)
      process.exit(1)
    }
  }

  console.log('✅ Environment validated');
};
