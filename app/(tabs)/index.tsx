import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, RefreshControl } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Moon, RefreshCw } from 'lucide-react-native';
import { dreamsApi, hasApiKey, type DreamSymbol } from '../../src/api';
import { RoxyBranding } from '../../src/components/RoxyBranding';
import { SymbolDetailModal } from '../../src/components/SymbolDetailModal';
import { appColors } from '../../src/constants';

export default function DailySymbol() {
  const [symbol, setSymbol] = useState<DreamSymbol | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchDailySymbol = async () => {
    try {
      setError(null);
      const symbols = await dreamsApi.getRandomSymbols(1);
      setSymbol(symbols[0]);
    } catch {
      setError('Failed to load dream symbol');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (hasApiKey()) {
      fetchDailySymbol();
    } else {
      setLoading(false);
    }
  }, []);

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
            Discover a new dream symbol each day
          </Text>
        </View>

        {error ? (
          <View className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6">
            <Text className="text-red-800 dark:text-red-200 text-center">{error}</Text>
            <Pressable onPress={fetchDailySymbol} className="mt-4 items-center">
              <Text className="text-red-600 dark:text-red-400 font-semibold">Try Again</Text>
            </Pressable>
          </View>
        ) : symbol ? (
          <View className="rounded-3xl p-6 mb-6 bg-purple-50 dark:bg-purple-900/20">
            <View className="items-center mb-6">
              <View className="bg-purple-100 dark:bg-purple-800 w-20 h-20 rounded-full items-center justify-center mb-4">
                <Text className="text-4xl">🌙</Text>
              </View>
              <Text className="text-3xl font-bold text-zinc-900 dark:text-white text-center mb-2">
                {symbol.name}
              </Text>
              <Text className="text-sm text-purple-600 dark:text-purple-400 font-semibold uppercase tracking-wide">
                Letter {symbol.letter.toUpperCase()}
              </Text>
            </View>

            <View className="bg-white dark:bg-zinc-800 rounded-2xl p-6 mb-6">
              <Text className="text-base text-zinc-700 dark:text-zinc-300 leading-7">
                {symbol.meaning.length > 200 ? `${symbol.meaning.substring(0, 200)}...` : symbol.meaning}
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
          onPress={fetchDailySymbol}
          className="bg-zinc-100 dark:bg-zinc-800 py-4 px-6 rounded-xl flex-row items-center justify-center gap-2 active:bg-zinc-200 dark:active:bg-zinc-700"
        >
          <RefreshCw size={20} color={appColors.primary} />
          <Text className="text-zinc-900 dark:text-white font-semibold text-base">
            Get Another Symbol
          </Text>
        </Pressable>
      </ScrollView>

      <SymbolDetailModal visible={modalVisible} symbol={symbol} onClose={() => setModalVisible(false)} />
    </View>
  );
}
