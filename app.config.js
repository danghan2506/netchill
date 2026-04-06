import 'dotenv/config';
export default {
  expo: {
    name: "Cozy Movies",
    slug: "cozy-movies",
    scheme: "com.anonymous.cozymovies",
    "android": {
      "package": "com.anonymous.cozymovies"
    },
    version: "1.0.0",
    "plugins" : [
      "expo-video"
    ],
  },
};
