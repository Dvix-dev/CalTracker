import { Link, Stack } from 'expo-router';
import { StyleSheet } from 'react-native';
import { Txt, Page, Button } from '@/components/ui';

export default function NotFoundScreen() {
  return <><Stack.Screen options={{ title: 'No encontrada' }} /><Page style={styles.container}><Txt style={styles.title}>Esta pantalla no existe.</Txt><Link href="/(tabs)" asChild><Button title="Volver al inicio" onPress={() => undefined} /></Link></Page></>;
}
const styles = StyleSheet.create({ container: { flex: 1, justifyContent: 'center', alignItems: 'center' }, title: { fontSize: 20, fontWeight: '700' } });
