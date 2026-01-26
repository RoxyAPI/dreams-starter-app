import { useState } from 'react';
import { View, Text, TextInput, FlatList, Pressable, ActivityIndicator, Keyboard } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Search as SearchIcon } from 'lucide-react-native';
import { dreamsApi, hasApiKey, type BasicDreamSymbol, type DreamSymbol } from '../../src/api';
import { RoxyBranding } from '../../src/components/RoxyBranding';
import { SymbolDetailModal } from '../../src/components/SymbolDetailModal';
import { appColors } from '../../src/constants';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [symbols, setSymbols] = useState<BasicDreamSymbol[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState<DreamSymbol | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    Keyboard.dismiss();
    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const data = await dreamsApi.listSymbols({ search: query, limit: 100 });
      setSymbols(data.symbols);
    } catch {
      setError('Failed to search symbols');
    } finally {
      setLoading(false);
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

  return (
    <View className="flex-1 bg-white dark:bg-zinc-900">
      <StatusBar style="auto" />
      
      {/* Search Bar */}
      <View className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
        <View className="flex-row items-center bg-zinc-100 dark:bg-zinc-800 rounded-xl px-4">
          <SearchIcon size={20} color={appColors.zinc[400]} />
          <TextInput
            className="flex-1 py-3 px-3 text-base text-zinc-900 dark:text-white"
            placeholder="Search dream symbols..."
            placeholderTextColor={appColors.zinc[400]}
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
      </View>

      {/* Results */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={appColors.primary} />
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-red-600 dark:text-red-400 text-center">{error}</Text>
        </View>
      ) : searched && symbols.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-2xl mb-4">🔍</Text>
          <Text className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
            No symbols found
          </Text>
          <Text className="text-zinc-500 dark:text-zinc-400 text-center">
            Try searching for different keywords
          </Text>
        </View>
      ) : !searched ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-4xl mb-4">🌙</Text>
          <Text className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
            Search Dream Symbols
          </Text>
          <Text className="text-zinc-500 dark:text-zinc-400 text-center">
            Enter a keyword to search 2,000+ dream meanings
          </Text>
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
