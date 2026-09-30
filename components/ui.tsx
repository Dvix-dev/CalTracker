import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text as NativeText, TextInput, View as NativeView, useColorScheme, type TextInputProps, type ViewProps } from 'react-native';
import { useApp } from '@/store/AppProvider';
import { palette } from '@/constants/theme';

export function useColors() {
  const { theme } = useApp();
  const systemDark = useColorScheme() === 'dark';
  return palette[theme === 'system' ? (systemDark ? 'dark' : 'light') : theme];
}
export function Page({ children, scroll = true, style }: React.PropsWithChildren<{scroll?: boolean; style?: ViewProps['style']}>) {
  const colors = useColors();
  return scroll ? <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={[styles.page, style]} keyboardShouldPersistTaps="handled">{children}</ScrollView> : <NativeView style={[styles.page, { flex: 1, backgroundColor: colors.background }, style]}>{children}</NativeView>;
}
export function Txt({ children, style, ...props }: React.ComponentProps<typeof NativeText>) {
  const colors = useColors(); return <NativeText {...props} style={[{ color: colors.text }, style]}>{children}</NativeText>;
}
export function Card({ children, style, ...props }: React.ComponentProps<typeof NativeView>) {
  const colors = useColors(); return <NativeView {...props} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.line }, style]}>{children}</NativeView>;
}
export function Button({ title, onPress, secondary = false, disabled = false }: {title: string; onPress: () => void; secondary?: boolean; disabled?: boolean}) {
  const colors = useColors(); return <Pressable accessibilityRole="button" onPress={onPress} disabled={disabled} style={({ pressed }) => [styles.button, { backgroundColor: secondary ? colors.soft : colors.primary, opacity: disabled ? 0.45 : pressed ? 0.82 : 1 }]}><NativeText style={{ color: secondary ? colors.primary : '#FFFFFF', fontWeight: '700', fontSize: 16 }}>{title}</NativeText></Pressable>;
}
export function Field({ label, ...props }: TextInputProps & {label: string}) {
  const colors = useColors(); return <NativeView style={{ gap: 7 }}><Txt style={styles.label}>{label}</Txt><TextInput {...props} placeholderTextColor={colors.muted} accessibilityLabel={label} style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.line, color: colors.text }]} /></NativeView>;
}
export function SectionTitle({ children, right }: React.PropsWithChildren<{right?: React.ReactNode}>) {
  return <NativeView style={styles.row}><Txt style={styles.section}>{children}</Txt>{right}</NativeView>;
}
export const styles = StyleSheet.create({
  page: { padding: 20, paddingBottom: 40, gap: 16 }, row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  card: { borderRadius: 22, padding: 18, borderWidth: 1, gap: 12 }, button: { minHeight: 54, borderRadius: 17, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 18 },
  label: { fontSize: 14, fontWeight: '600' }, input: { minHeight: 52, paddingHorizontal: 15, borderRadius: 14, borderWidth: 1, fontSize: 16 },
  section: { fontSize: 19, fontWeight: '700' }, muted: { fontSize: 13 },
});
