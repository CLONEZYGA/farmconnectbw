import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';

// Sample weather data
const WEATHER_DATA = {
  current: {
    location: 'Gaborone, Botswana',
    date: 'Monday, June 12',
    temperature: 28,
    weatherCondition: 'Sunny',
    weatherIcon: 'sunny-outline',
    wind: '12 km/h',
    humidity: '45%',
    precipitation: '0%',
    uvIndex: 'High',
  },
  hourly: [
    { time: 'Now', temperature: 28, icon: 'sunny-outline' },
    { time: '12 PM', temperature: 30, icon: 'sunny-outline' },
    { time: '1 PM', temperature: 31, icon: 'sunny-outline' },
    { time: '2 PM', temperature: 32, icon: 'partly-sunny-outline' },
    { time: '3 PM', temperature: 31, icon: 'partly-sunny-outline' },
    { time: '4 PM', temperature: 30, icon: 'partly-sunny-outline' },
    { time: '5 PM', temperature: 28, icon: 'cloudy-outline' },
    { time: '6 PM', temperature: 26, icon: 'cloudy-outline' },
  ],
  daily: [
    { day: 'Today', high: 32, low: 20, icon: 'sunny-outline', precipitation: '0%' },
    { day: 'Tue', high: 31, low: 19, icon: 'sunny-outline', precipitation: '0%' },
    { day: 'Wed', high: 30, low: 18, icon: 'partly-sunny-outline', precipitation: '10%' },
    { day: 'Thu', high: 29, low: 18, icon: 'rainy-outline', precipitation: '40%' },
    { day: 'Fri', high: 26, low: 17, icon: 'rainy-outline', precipitation: '60%' },
    { day: 'Sat', high: 25, low: 16, icon: 'thunderstorm-outline', precipitation: '70%' },
    { day: 'Sun', high: 27, low: 17, icon: 'partly-sunny-outline', precipitation: '20%' },
  ],
  alerts: [
    {
      type: 'High Temperature',
      description: 'Extreme heat expected between 12 PM and 4 PM. Keep livestock sheltered and ensure adequate water supply.',
      severity: 'Moderate',
    },
  ],
  farmTips: [
    'Consider irrigating crops early in the morning or late in the evening to reduce water loss through evaporation.',
    'Monitor soil moisture levels regularly as high temperatures can lead to rapid drying.',
    'Look out for signs of heat stress in livestock and provide adequate shade and water.',
  ],
};

export default function WeatherScreen() {
  const router = useRouter();
  const pathname = usePathname();
  const [weatherData, setWeatherData] = useState(WEATHER_DATA);
  const [isLoading, setIsLoading] = useState(false);

  // Navigation items
  const navItems = [
    { name: 'Dashboard', icon: 'home-outline', route: '/(farmer)/' },
    { name: 'Market', icon: 'cart-outline', route: '/(farmer)/market' },
    { name: 'Chat', icon: 'chatbubbles-outline', route: '/(farmer)/chat' },
    { name: 'Settings', icon: 'settings-outline', route: '/(farmer)/settings' },
  ];

  // Handle navigation
  const handleNavigation = (route) => {
    router.push(route);
  };

  // Simulate fetching weather data
  useEffect(() => {
    // In a real app, we would fetch data from a weather API here
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  // Function to refresh weather data
  const refreshWeather = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading weather data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Weather</Text>
          <TouchableOpacity onPress={refreshWeather}>
            <Ionicons name="refresh-outline" size={24} color="#4CAF50" />
          </TouchableOpacity>
        </View>

        <View style={styles.currentWeather}>
          <View style={styles.locationDate}>
            <Text style={styles.locationText}>{weatherData.current.location}</Text>
            <Text style={styles.dateText}>{weatherData.current.date}</Text>
          </View>
          <View style={styles.weatherMain}>
            <Ionicons name={weatherData.current.weatherIcon} size={80} color="#4CAF50" />
            <Text style={styles.temperatureText}>{weatherData.current.temperature}°C</Text>
            <Text style={styles.conditionText}>{weatherData.current.weatherCondition}</Text>
          </View>
          <View style={styles.weatherDetails}>
            <View style={styles.weatherDetail}>
              <Ionicons name="water-outline" size={20} color="#666" />
              <Text style={styles.detailLabel}>Humidity</Text>
              <Text style={styles.detailValue}>{weatherData.current.humidity}</Text>
            </View>
            <View style={styles.weatherDetail}>
              <Ionicons name="speedometer-outline" size={20} color="#666" />
              <Text style={styles.detailLabel}>Wind</Text>
              <Text style={styles.detailValue}>{weatherData.current.wind}</Text>
            </View>
            <View style={styles.weatherDetail}>
              <Ionicons name="rainy-outline" size={20} color="#666" />
              <Text style={styles.detailLabel}>Precipitation</Text>
              <Text style={styles.detailValue}>{weatherData.current.precipitation}</Text>
            </View>
            <View style={styles.weatherDetail}>
              <Ionicons name="sunny-outline" size={20} color="#666" />
              <Text style={styles.detailLabel}>UV Index</Text>
              <Text style={styles.detailValue}>{weatherData.current.uvIndex}</Text>
            </View>
          </View>
        </View>

        {weatherData.alerts.length > 0 && (
          <View style={styles.alertSection}>
            <View style={styles.alertHeader}>
              <Ionicons name="warning-outline" size={24} color="#FF9800" />
              <Text style={styles.alertTitle}>Weather Alert</Text>
            </View>
            {weatherData.alerts.map((alert, index) => (
              <View key={index} style={styles.alertCard}>
                <Text style={styles.alertType}>{alert.type}</Text>
                <Text style={styles.alertDescription}>{alert.description}</Text>
                <View style={styles.alertSeverity}>
                  <Text style={styles.severityLabel}>Severity:</Text>
                  <Text style={styles.severityValue}>{alert.severity}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={styles.forecastSection}>
          <Text style={styles.sectionTitle}>Hourly Forecast</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.hourlyContainer}
          >
            {weatherData.hourly.map((hour, index) => (
              <View key={index} style={styles.hourlyItem}>
                <Text style={styles.hourlyTime}>{hour.time}</Text>
                <Ionicons name={hour.icon} size={28} color="#4CAF50" />
                <Text style={styles.hourlyTemp}>{hour.temperature}°</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.forecastSection}>
          <Text style={styles.sectionTitle}>7-Day Forecast</Text>
          {weatherData.daily.map((day, index) => (
            <View key={index} style={styles.dailyItem}>
              <Text style={styles.dailyDay}>{day.day}</Text>
              <Ionicons name={day.icon} size={24} color="#4CAF50" />
              <View style={styles.dailyTemp}>
                <Text style={styles.dailyHigh}>{day.high}°</Text>
                <Text style={styles.dailyLow}>{day.low}°</Text>
              </View>
              <Text style={styles.dailyPrecip}>{day.precipitation}</Text>
            </View>
          ))}
        </View>

        <View style={styles.tipsSection}>
          <Text style={styles.sectionTitle}>Farm Weather Tips</Text>
          {weatherData.farmTips.map((tip, index) => (
            <View key={index} style={styles.tipItem}>
              <Ionicons name="bulb-outline" size={20} color="#4CAF50" />
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        {navItems.map((item) => (
          <TouchableOpacity
            key={item.name}
            style={styles.navItem}
            onPress={() => handleNavigation(item.route)}
          >
            <Ionicons
              name={item.icon}
              size={24}
              color={pathname === item.route ? '#4CAF50' : '#666'}
            />
            <Text
              style={[
                styles.navText,
                pathname === item.route && styles.activeNavText,
              ]}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  currentWeather: {
    backgroundColor: '#fff',
    marginTop: 8,
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  locationDate: {
    marginBottom: 16,
  },
  locationText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  dateText: {
    fontSize: 14,
    color: '#666',
  },
  weatherMain: {
    alignItems: 'center',
    marginBottom: 16,
  },
  temperatureText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
  },
  conditionText: {
    fontSize: 18,
    color: '#666',
  },
  weatherDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  weatherDetail: {
    alignItems: 'center',
    width: '25%',
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
    marginVertical: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  alertSection: {
    backgroundColor: '#FFF3E0',
    marginTop: 16,
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 16,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FF9800',
    marginLeft: 8,
  },
  alertCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  alertType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  alertDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    marginBottom: 8,
  },
  alertSeverity: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  severityLabel: {
    fontSize: 14,
    color: '#666',
  },
  severityValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FF9800',
    marginLeft: 4,
  },
  forecastSection: {
    backgroundColor: '#fff',
    marginTop: 16,
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  hourlyContainer: {
    marginBottom: 8,
  },
  hourlyItem: {
    alignItems: 'center',
    marginRight: 24,
  },
  hourlyTime: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  hourlyTemp: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginTop: 4,
  },
  dailyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dailyDay: {
    width: 50,
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  dailyTemp: {
    width: 80,
    flexDirection: 'row',
  },
  dailyHigh: {
    width: 40,
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    textAlign: 'right',
  },
  dailyLow: {
    width: 40,
    fontSize: 16,
    color: '#999',
    textAlign: 'right',
  },
  dailyPrecip: {
    width: 50,
    fontSize: 14,
    color: '#666',
    textAlign: 'right',
  },
  tipsSection: {
    backgroundColor: '#E8F5E9',
    marginTop: 16,
    marginBottom: 24,
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 16,
  },
  tipItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  tipText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 12,
    flex: 1,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  navItem: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  navText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  activeNavText: {
    color: '#4CAF50',
    fontWeight: '500',
  },
}); 