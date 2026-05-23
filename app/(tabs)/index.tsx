import { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, RefreshControl } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Moon, RefreshCw } from 'lucide-react-native';
import { dreamsApi, hasApiKey, type DailySymbolResponse } from '../../src/api';
import { RoxyBranding } from '../../src/components/RoxyBranding';
import { SymbolDetailModal } from '../../src/components/SymbolDetailModal';
import { appColors } from '../../src/constants';
import { useUserId } from '../../src/hooks/useUserId';

export default function DailySymbol() {
  const { userId, loading: userIdLoading } = useUserId();
  const [daily, setDaily] = useState<DailySymbolResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchDailySymbol = useCallback(async () => {
    try {
      setError(null);
      const result = await dreamsApi.getDailySymbol(userId ? { seed: userId } : undefined);
      setDaily(result);
    } catch {
      setError('Failed to load dream symbol');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [userId]);

  useEffect(() => {
    if (!hasApiKey()) {
      setLoading(false);
      return;
    }
    if (!userIdLoading) fetchDailySymbol();
  }, [userIdLoading, fetchDailySymbol]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDailySymbol();
  };

  if (!hasApiKey()) {
    return <RoxyBranding />;
  }

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-zinc-900">
        <ActivityIndicator size="large" color={appColors.primary} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white dark:bg-zinc-900">
      <StatusBar style="auto" />
      <ScrollView
        className="flex-1"
        contentContainerClassName="p-6"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={appColors.primary} />}
      >
        <View className="mb-8">
          <View className="flex-row items-center mb-2">
            <Moon size={32} color={appColors.primary} />
            <Text className="text-3xl font-bold text-zinc-900 dark:text-white ml-3">
              Daily Dream Symbol
            </Text>
          </View>
          <Text className="text-zinc-500 dark:text-zinc-400">
            Your symbol for {daily?.date ?? 'today'}, consistent all day
          </Text>
        </View>

        {error ? (
          <View className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6">
            <Text className="text-red-800 dark:text-red-200 text-center">{error}</Text>
            <Pressable onPress={fetchDailySymbol} className="mt-4 items-center">
              <Text className="text-red-600 dark:text-red-400 font-semibold">Try Again</Text>
            </Pressable>
          </View>
        ) : daily ? (
          <View className="rounded-3xl p-6 mb-6 bg-purple-50 dark:bg-purple-900/20">
            <View className="items-center mb-6">
              <View className="bg-purple-100 dark:bg-purple-800 w-20 h-20 rounded-full items-center justify-center mb-4">
                <Text className="text-4xl">🌙</Text>
              </View>
              <Text className="text-3xl font-bold text-zinc-900 dark:text-white text-center mb-2">
                {daily.symbol.name}
              </Text>
              <Text className="text-sm text-purple-600 dark:text-purple-400 font-semibold uppercase tracking-wide">
                Letter {daily.symbol.letter.toUpperCase()}
              </Text>
            </View>

            <View className="bg-white dark:bg-zinc-800 rounded-2xl p-6 mb-6">
              <Text className="text-base text-zinc-700 dark:text-zinc-300 leading-7">
                {daily.dailyMessage}
              </Text>
            </View>

            <Pressable
              onPress={() => setModalVisible(true)}
              className="bg-purple-600 py-4 px-6 rounded-xl items-center active:bg-purple-700"
            >
              <Text className="text-white font-semibold text-base">Read Full Interpretation</Text>
            </Pressable>
          </View>
        ) : null}

        <Pressable
          onPress={onRefresh}
          className="bg-zinc-100 dark:bg-zinc-800 py-4 px-6 rounded-xl flex-row items-center justify-center gap-2 active:bg-zinc-200 dark:active:bg-zinc-700"
        >
          <RefreshCw size={20} color={appColors.primary} />
          <Text className="text-zinc-900 dark:text-white font-semibold text-base">
            Refresh
          </Text>
        </Pressable>
      </ScrollView>

      <SymbolDetailModal visible={modalVisible} symbol={daily?.symbol ?? null} onClose={() => setModalVisible(false)} />
    </View>
  );
}
