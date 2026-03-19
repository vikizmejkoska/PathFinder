import React, { useCallback } from 'react';
import { FlatList, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import styled from 'styled-components/native';
import EmptyState from '../components/EmptyState';
import HistoryItem from '../components/HistoryItem';
import { mapActivity } from '../utils/activityMapper';
import useTracking from '../hooks/useTracking';

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const HeaderActions = styled.View`
  padding: 16px 16px 0 16px;
`;

const ClearButton = styled.TouchableOpacity`
  align-self: flex-end;
  background-color: #fef2f2;
  border-width: 1px;
  border-color: #fecaca;
  padding: 10px 14px;
  border-radius: 12px;
`;

const ClearButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.danger};
  font-weight: 600;
  font-size: 14px;
`;

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
    <Container>
      {mappedActivities.length > 0 && (
        <HeaderActions>
          <ClearButton onPress={handleClearHistory}>
            <ClearButtonText>Clear History</ClearButtonText>
          </ClearButton>
        </HeaderActions>
      )}

      <FlatList
        data={mappedActivities}
        keyExtractor={(item) => item.id}
        contentContainerStyle={
          mappedActivities.length === 0
            ? { flexGrow: 1, justifyContent: 'center', padding: 16 }
            : { padding: 16 }
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
    </Container>
  );
}