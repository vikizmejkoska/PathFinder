import React from 'react';
import { UrlTile } from 'react-native-maps';
import { MAP_CONFIG } from '../constants/map';

export default function MapTileLayer() {
  if (!process.env.EXPO_PUBLIC_MAPTILER_KEY) {
    return null;
  }

  return (
    <UrlTile
      urlTemplate={MAP_CONFIG.mapTilerUrl}
      maximumZ={19}
      flipY={false}
      tileSize={MAP_CONFIG.tileSize}
      zIndex={-1}
    />
  );
}