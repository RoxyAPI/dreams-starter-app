import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Sparkles, RefreshCw } from 'lucide-react-native';
import { dreamsApi, hasApiKey, type DreamSymbol } from '../../src/api';
import { RoxyBranding } from '../../src/components/RoxyBranding';
import { SymbolDetailModal } from '../../src/components/SymbolDetailModal';
import { appColors } from '../../src/constants';

export default function RandomScreen() {
  const [symbols, setSymbols] = useState<DreamSymbol[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState<DreamSymbol | null>(null);

  const fetchRandomSymbols = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await dreamsApi.getRandomSymbols(3);
      setSymbols(data);
    } catch {
      setError('Failed to load random symbols');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasApiKey()) {
      fetchRandomSymbols();
    } else {
      setLoading(false);
    }
  }, []);

  const openSymbol = (symbol: DreamSymbol) => {
    setSelectedSymbol(symbol);
    setModalVisible(true);
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
      <ScrollView className="flex-1" contentContainerClassName="p-6">
        {/* Header */}
        <View className="mb-8">
          <View className="flex-row items-center mb-2">
            <Sparkles size={32} color={appColors.primary} />
            <Text className="text-3xl font-bold text-zinc-900 dark:text-white ml-3">
              Random Symbols
            </Text>
          </View>
          <Text className="text-zinc-500 dark:text-zinc-400">
            Explore random dream meanings
          </Text>
        </View>

        {error ? (
          <View className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6">
            <Text className="text-red-800 dark:text-red-200 text-center">{error}</Text>
            <Pressable onPress={fetchRandomSymbols} className="mt-4 items-center">
              <Text className="text-red-600 dark:text-red-400 font-semibold">Try Again</Text>
            </Pressable>
          </View>
        ) : (
          <>
            {symbols.map((symbol, index) => (
              <Pressable
                key={symbol.id}
                onPress={() => openSymbol(symbol)}
                className="bg-zinc-50 dark:bg-zinc-800 rounded-2xl p-6 mb-4 active:bg-zinc-100 dark:active:bg-zinc-700"
              >
                <View className="flex-row items-center mb-3">
                  <View className="bg-purple-100 dark:bg-purple-800 w-12 h-12 rounded-full items-center justify-center mr-4">
                    <Text className="text-2xl">🌙</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-xl font-bold text-zinc-900 dark:text-white">
                      {symbol.name}
                    </Text>
                    <Text className="text-sm text-purple-600 dark:text-purple-400 font-semibold uppercase tracking-wide">
                      Letter {symbol.letter.toUpperCase()}
                    </Text>
                  </View>
                </View>
                <Text className="text-base text-zinc-600 dark:text-zinc-400 leading-6">
                  {symbol.meaning.length > 150 ? `${symbol.meaning.substring(0, 150)}...` : symbol.meaning}
                </Text>
              </Pressable>
            ))}

            <Pressable
              onPress={fetchRandomSymbols}
              className="bg-purple-600 py-4 px-6 rounded-xl flex-row items-center justify-center gap-2 active:bg-purple-700 mt-4"
            >
              <RefreshCw size={20} color="white" />
              <Text className="text-white font-semibold text-base">
                Get More Random Symbols
              </Text>
            </Pressable>
          </>
        )}
      </ScrollView>

      <SymbolDetailModal
        visible={modalVisible}
        symbol={selectedSymbol}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}
