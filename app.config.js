import 'dotenv/config';
export default {
  expo: {
    name: "Cozy Movies",
    slug: "cozy-movies",
    "android": {
      "package": "com.anonymous.cozymovies"
    },
    version: "1.0.0",
    extra: {
        EXPO_PUBLIC_TMDB_API_KEY: process.env.EXPO_PUBLIC_TMDB_API_KEY,
        EXPO_PUBLIC_APPWRITE_PROJECT_ID: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
        EXPO_PUBLIC_APPWRITE_DATABASE_ID: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
        EXPO_PUBLIC_APPWRITE_COLLECTION_ID: process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID,
    },
  },
};
