import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius } from '../theme';
import { UserDocument } from '../types';

interface Props {
  document: UserDocument | null;
  visible: boolean;
  onClose: () => void;
  onShare?: () => void;
  onDownload?: () => void;
}

export const DocumentPreview: React.FC<Props> = ({ document, visible, onClose, onShare, onDownload }) => {
  if (!document) return null;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.iconBtn}>
            <Ionicons name="close" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Document Preview</Text>
          <View style={{ width: 44 }} />
        </View>

        <View style={styles.content}>
          <View style={styles.previewBox}>
            <Ionicons name="document-text" size={80} color={Colors.primaryLight} />
            <Text style={styles.previewText}>{document.title}</Text>
            <Text style={styles.previewMeta}>ID: {document.id.toUpperCase()}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.actionBtn} onPress={onShare}>
            <Ionicons name="share-outline" size={20} color={Colors.primary} />
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.actionBtn} onPress={onDownload}>
            <Ionicons name="download-outline" size={20} color={Colors.primary} />
            <Text style={styles.actionText}>Download</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  iconBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.semiBold,
    color: Colors.textPrimary,
  },
  content: {
    flex: 1,
    padding: Spacing.xl,
    justifyContent: 'center',
  },
  previewBox: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    padding: Spacing.xxxl,
    alignItems: 'center',
    justifyContent: 'center',
    aspectRatio: 1 / 1.4, // Standard A4 aspect ratio approx
  },
  previewText: {
    marginTop: Spacing.lg,
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  previewMeta: {
    marginTop: Spacing.sm,
    fontSize: Typography.xs,
    color: Colors.textTertiary,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.base,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    backgroundColor: Colors.surface,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
  actionText: {
    fontSize: Typography.sm,
    fontWeight: Typography.semiBold,
    color: Colors.primary,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.borderLight,
  },
});
