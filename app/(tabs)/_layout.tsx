import { Tabs } from 'expo-router';
import { Text, type ColorValue } from 'react-native';
import { useColors } from '@/components/ui';

export default function TabLayout() {
 const colors=useColors();
 return <Tabs screenOptions={{headerShown:false,tabBarActiveTintColor:colors.primary,tabBarInactiveTintColor:colors.muted,tabBarStyle:{height:68,paddingBottom:9,paddingTop:8,backgroundColor:colors.surface,borderTopColor:colors.line},tabBarLabelStyle:{fontSize:11,fontWeight:'600'}}}>
  <Tabs.Screen name="index" options={{title:'Inicio',tabBarIcon:({color})=><TabIcon symbol="⌂" color={color}/>}}/>
  <Tabs.Screen name="history" options={{title:'Historial',tabBarIcon:({color})=><TabIcon symbol="▤" color={color}/>}}/>
  <Tabs.Screen name="progress" options={{title:'Progreso',tabBarIcon:({color})=><TabIcon symbol="↗" color={color}/>}}/>
  <Tabs.Screen name="profile" options={{title:'Perfil',tabBarIcon:({color})=><TabIcon symbol="◉" color={color}/>}}/>
 </Tabs>;
}
function TabIcon({symbol,color}:{symbol:string;color:ColorValue}) { return <Text style={{color,fontSize:23,fontWeight:'700'}}>{symbol}</Text>; }
