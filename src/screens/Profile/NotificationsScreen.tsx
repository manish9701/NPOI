import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Colors, Typography, Spacing, Radius, Shadow } from '../../theme';
import { AppNotification } from '../../data/mockData';
import { RootStackParamList } from '../../types';
import { ScreenHeader, EmptyState } from '../../components';
import { useNotifications } from '../../hooks/useNotifications';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const typeConfig = {
  expiry: { icon: 'warning-outline' as const, color: Colors.urgentMedium, bg: Colors.warningLight },
  status: { icon: 'sync-outline' as const, color: Colors.primary, bg: Colors.primaryLight },
  action: { icon: 'create-outline' as const, color: Colors.info, bg: Colors.infoLight },
  info: { icon: 'information-circle-outline' as const, color: Colors.textSecondary, bg: Colors.surfaceAlt },
};

export const NotificationsScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();

  const handleAction = (notif: AppNotification) => {
    markRead(notif.id);
    if (!notif.actionRoute) return;
    const route = notif.actionRoute as keyof RootStackParamList;
    navigation.navigate(route, (notif.actionParams ?? {}) as never);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#111" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Notifications</Text>
        {unreadCount > 0 ? (
          <TouchableOpacity style={styles.iconBtn} onPress={markAllRead}>
            <Ionicons name="checkmark-done" size={22} color="#111" />
          </TouchableOpacity>
        ) : <View style={{ width: 44 }} />}
      </View>

      {unreadCount > 0 && (
        <View style={styles.unreadBanner}>
          <Text style={styles.unreadText}>{unreadCount} unread notification{unreadCount > 1 ? 's' : ''}</Text>
          <TouchableOpacity onPress={markAllRead}>
            <Text style={styles.markAllText}>Mark all read</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {notifications.length === 0 ? (
          <EmptyState
            icon="notifications-outline"
            title="No notifications"
            message="You're all caught up. Notifications about expiring documents and application updates will appear here."
          />
        ) : (
          <View style={styles.cardGroup}>
            {notifications.map((notif, i) => {
              const cfg = typeConfig[notif.type];
              const date = new Date(notif.date);
              const dateStr = date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });

              return (
                <TouchableOpacity
                  key={notif.id}
                  style={[styles.row, !notif.read && styles.rowUnread, i === notifications.length - 1 && { borderBottomWidth: 0 }]}
                  onPress={() => markRead(notif.id)}
                  activeOpacity={0.85}
                  accessibilityRole="button"
                >
                  {!notif.read && <View style={styles.unreadDot} />}

                  <View style={[styles.iconWrap, { backgroundColor: cfg.bg }]}>
                    <Ionicons name={cfg.icon} size={20} color={cfg.color} />
                  </View>

                  <View style={styles.body}>
                    <View style={styles.titleRow}>
                      <Text style={[styles.title, !notif.read && styles.titleUnread]} numberOfLines={1}>
                        {notif.title}
                      </Text>
                      <Text style={styles.date}>{dateStr}</Text>
                    </View>
                    <Text style={styles.bodyText} numberOfLines={2}>{notif.body}</Text>

                    {notif.actionLabel && (
                      <TouchableOpacity
                        style={[styles.inlineActionBtn, { borderColor: cfg.color }]}
                        onPress={() => handleAction(notif)}
                        activeOpacity={0.75}
                      >
                        <Text style={[styles.inlineActionText, { color: cfg.color }]}>{notif.actionLabel}</Text>
                        <Ionicons name="arrow-forward" size={12} color={cfg.color} />
                      </TouchableOpacity>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
        <View style={{ height: Spacing.xxxl }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  content: { padding: Spacing.base },

  unreadBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primaryMid,
  },
  unreadText: { fontSize: Typography.sm, color: Colors.primary, fontWeight: Typography.medium },
  markAllText: { fontSize: Typography.sm, color: Colors.primary, fontWeight: Typography.semiBold },

  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.base, paddingVertical: Spacing.md, backgroundColor: '#F6F6F8' },
  topBarTitle: { fontSize: 24, fontWeight: '800', color: '#111', letterSpacing: -0.5 },
  iconBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#EBEBEB' },

  cardGroup: {
    backgroundColor: '#fff',
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    overflow: 'hidden',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    backgroundColor: '#fff',
    padding: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
    position: 'relative',
  },
  rowUnread: {
    backgroundColor: '#F0F5FF',
  },
  unreadDot: {
    position: 'absolute',
    top: Spacing.base,
    left: Spacing.sm,
    width: 8, height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  iconWrap: {
    width: 44, height: 44,
    borderRadius: Radius.md,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  body: { flex: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: 3 },
  title: {
    flex: 1,
    fontSize: Typography.base,
    color: Colors.textSecondary,
    fontWeight: Typography.medium,
  },
  titleUnread: { color: Colors.textPrimary, fontWeight: Typography.bold },
  date: { fontSize: Typography.xs, color: Colors.textTertiary },
  bodyText: { fontSize: Typography.sm, color: Colors.textSecondary, lineHeight: 20, marginBottom: Spacing.sm },
  inlineActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
  },
  inlineActionText: { fontSize: Typography.xs, fontWeight: Typography.semiBold },
});
