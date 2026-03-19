export const MAP_CONFIG = {
  initialRegion: {
    latitude: 41.9981,
    longitude: 21.4254,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  },
  mapTilerUrl: `https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=${process.env.EXPO_PUBLIC_MAPTILER_KEY}`,
  tileSize: 256,
};