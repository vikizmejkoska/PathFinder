import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps';
import colors from '../constants/colors';
import { formatDate, formatDistance, formatDuration } from '../utils/formatters';
import { getRegionForCoordinates } from '../utils/mapRegion';
import MapTileLayer from '../components/MapTileLayer';
import useTracking from '../hooks/useTracking';

export default function ActivityDetailScreen({ route }) {
  const { activityId } = route.params || {};
  const { activities } = useTracking();

  const activity = useMemo(
    () => activities.find((item) => item.id === activityId),
    [activities, activityId]
  );

  if (!activity) {
    return (
      <View style={styles.centered}>
        <Text style={styles.title}>Activity not found</Text>
      </View>
    );
  }

  const region = getRegionForCoordinates(activity.routeCoordinates);
  const startPoint = activity.routeCoordinates[0];
  const endPoint = activity.routeCoordinates[activity.routeCoordinates.length - 1];

  return (
    <View style={styles.container}>
      <View style={styles.mapWrapper}>
        <MapView style={styles.map} initialRegion={region}>
          <MapTileLayer />

          {activity.routeCoordinates.length > 1 && (
            <Polyline
              coordinates={activity.routeCoordinates}
              strokeWidth={5}
              strokeColor={colors.mapRoute}
            />
          )}

          {startPoint && (
            <Marker
              coordinate={startPoint}
              title="Start"
              description="Activity started here"
              pinColor={colors.mapStart}
            />
          )}

          {endPoint && (
            <Marker
              coordinate={endPoint}
              title="End"
              description="Activity ended here"
              pinColor={colors.mapEnd}
            />
          )}
        </MapView>
      </View>

      <View style={styles.infoPanel}>
        <Text style={styles.title}>{formatDate(activity.createdAt)}</Text>
        <Text style={styles.infoText}>
          Distance: {formatDistance(activity.distanceKm)}
        </Text>
        <Text style={styles.infoText}>
          Duration: {formatDuration(activity.elapsedSeconds)}
        </Text>
        <Text style={styles.infoText}>
          Points recorded: {activity.routeCoordinates.length}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  mapWrapper: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  infoPanel: {
    backgroundColor: colors.surface,
    padding: 20,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 10,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  infoText: {
    fontSize: 15,
    color: colors.textSecondary,
  },
});