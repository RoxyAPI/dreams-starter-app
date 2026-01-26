import { Modal, View, Text, Pressable, ScrollView } from 'react-native';
import { X } from 'lucide-react-native';
import { appColors } from '../constants';
import type { DreamSymbol } from '../api';

interface SymbolDetailModalProps {
  visible: boolean;
  symbol: DreamSymbol | null;
  onClose: () => void;
}

export function SymbolDetailModal({ visible, symbol, onClose }: SymbolDetailModalProps) {
  if (!symbol) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-white dark:bg-zinc-900">
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <Text className="text-2xl font-bold text-zinc-900 dark:text-white flex-1">
            {symbol.name}
          </Text>
          <Pressable
            onPress={onClose}
            className="w-10 h-10 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800"
          >
            <X size={20} color={appColors.zinc[400]} />
          </Pressable>
        </View>

        {/* Content */}
        <ScrollView className="flex-1 px-6 py-6">
          <View className="mb-6">
            <Text className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wide mb-2">
              Symbol ID: {symbol.id}
            </Text>
            <Text className="text-base text-zinc-600 dark:text-zinc-300 leading-7">
              {symbol.meaning}
            </Text>
          </View>
        </ScrollView>

        {/* Close Button */}
        <View className="px-6 py-4 border-t border-zinc-200 dark:border-zinc-800">
          <Pressable
            onPress={onClose}
            className="bg-purple-600 py-4 px-6 rounded-xl items-center active:bg-purple-700"
          >
            <Text className="text-white font-semibold text-base">Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
