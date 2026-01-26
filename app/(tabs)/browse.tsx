import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, FlatList } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { BookOpen } from 'lucide-react-native';
import { dreamsApi, hasApiKey, type BasicDreamSymbol, type DreamSymbol } from '../../src/api';
import { RoxyBranding } from '../../src/components/RoxyBranding';
import { SymbolDetailModal } from '../../src/components/SymbolDetailModal';
import { appColors } from '../../src/constants';

const LETTERS = 'abcdefghijklmnopqrstuvwxyz'.split('');

export default function BrowseScreen() {
  const [letterCounts, setLetterCounts] = useState<Record<string, number>>({});
  const [symbols, setSymbols] = useState<BasicDreamSymbol[]>([]);
  const [selectedLetter, setSelectedLetter] = useState<string>('a');
  const [loading, setLoading] = useState(true);
  const [loadingSymbols, setLoadingSymbols] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState<DreamSymbol | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    if (hasApiKey()) {
      fetchLetterCounts();
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedLetter) {
      fetchSymbols(selectedLetter);
    }
  }, [selectedLetter]);

  const fetchLetterCounts = async () => {
    try {
      const data = await dreamsApi.getLetterCounts();
      setLetterCounts(data.letters);
    } catch {
      setError('Failed to load letter counts');
    } finally {
      setLoading(false);
    }
  };

  const fetchSymbols = async (letter: string) => {
    setLoadingSymbols(true);
    try {
      const data = await dreamsApi.listSymbols({ letter, limit: 100 });
      setSymbols(data.symbols);
    } catch {
      setError('Failed to load symbols');
    } finally {
      setLoadingSymbols(false);
    }
  };

  const openSymbolDetail = async (symbolId: string) => {
    setLoadingDetail(true);
    setModalVisible(true);
    try {
      const symbol = await dreamsApi.getSymbol(symbolId);
      setSelectedSymbol(symbol);
    } catch {
      setError('Failed to load symbol details');
      setModalVisible(false);
    } finally {
      setLoadingDetail(false);
    }
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
      
      {/* Letter Selector */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="border-b border-zinc-200 dark:border-zinc-800">
        <View className="flex-row px-4 py-3 gap-2">
          {LETTERS.map((letter) => (
            <Pressable
              key={letter}
              onPress={() => setSelectedLetter(letter)}
              className={`w-10 h-10 rounded-full items-center justify-center ${
                selectedLetter === letter
                  ? 'bg-purple-600'
                  : 'bg-zinc-100 dark:bg-zinc-800'
              }`}
            >
              <Text className={`font-bold text-sm ${
                selectedLetter === letter
                  ? 'text-white'
                  : 'text-zinc-700 dark:text-zinc-300'
              }`}>
                {letter.toUpperCase()}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {/* Symbols List */}
      {loadingSymbols ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={appColors.primary} />
        </View>
      ) : (
        <FlatList
          data={symbols}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          contentContainerClassName="p-6"
          renderItem={({ item }) => (
            <Pressable
              onPress={() => openSymbolDetail(item.id)}
              className="bg-zinc-50 dark:bg-zinc-800 rounded-2xl p-4 mb-3 flex-row items-center justify-between active:bg-zinc-100 dark:active:bg-zinc-700"
            >
              <View className="flex-1">
                <Text className="text-lg font-semibold text-zinc-900 dark:text-white">
                  {item.name}
                </Text>
                <Text className="text-sm text-zinc-500 dark:text-zinc-400">
                  Letter {item.letter.toUpperCase()}
                </Text>
              </View>
              <Text className="text-2xl">🌙</Text>
            </Pressable>
          )}
          ListEmptyComponent={
            <Text className="text-center text-zinc-500 dark:text-zinc-400 mt-10">
              No symbols found for letter {selectedLetter.toUpperCase()}
            </Text>
          }
        />
      )}

      <SymbolDetailModal
        visible={modalVisible}
        symbol={selectedSymbol}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}
