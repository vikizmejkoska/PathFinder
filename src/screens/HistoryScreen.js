import React, { useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import colors from '../constants/colors';
import EmptyState from '../components/EmptyState';
import HistoryItem from '../components/HistoryItem';
import { mapActivity } from '../utils/activityMapper';
import useTracking from '../hooks/useTracking';

export default function HistoryScreen({ navigation }) {
  const { activities, hydrateActivities, removeAllActivities } = useTracking();

  useFocusEffect(
    useCallback(() => {
      hydrateActivities();
    }, [])
  );

  const mappedActivities = activities.map(mapActivity);

  const handleClearHistory = () => {
    if (mappedActivities.length === 0) return;

    Alert.alert(
      'Clear history',
      'Are you sure you want to delete all saved activities?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const success = await removeAllActivities();

            if (!success) {
              Alert.alert('Error', 'Unable to clear history.');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {mappedActivities.length > 0 && (
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.clearButton} onPress={handleClearHistory}>
            <Text style={styles.clearButtonText}>Clear History</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={mappedActivities}
        keyExtractor={(item) => item.id}
        contentContainerStyle={
          mappedActivities.length === 0 ? styles.emptyList : styles.list
        }
        renderItem={({ item }) => (
          <HistoryItem
            item={item}
            onPress={() =>
              navigation.navigate('ActivityDetail', {
                activityId: item.id,
              })
            }
          />
        )}
        ListEmptyComponent={
          <EmptyState
            title="No activities yet"
            subtitle="Start tracking an activity and it will appear here."
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerActions: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  clearButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  clearButtonText: {
    color: colors.danger,
    fontWeight: '600',
    fontSize: 14,
  },
  list: {
    padding: 16,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
});