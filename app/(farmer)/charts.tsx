import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator, SafeAreaView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { useAuth } from '../../context/AuthContext';

// Sample chart data
const CHART_DATA = {
  yields: {
    labels: ["Maize", "Wheat", "Tomatoes", "Soybeans", "Rice", "Beans"],
    datasets: [
      {
        data: [5.8, 3.2, 32.0, 2.9, 4.5, 2.1],
        color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
        strokeWidth: 2
      }
    ],
    legend: ["Tons per Acre"]
  },
  revenue: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        data: [8200, 7500, 9100, 8700, 10200, 11500, 12300, 14200, 12800, 9500, 8300, 7900],
        color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
        strokeWidth: 2
      }
    ],
    legend: ["Monthly Revenue (BWP)"]
  },
  expenses: {
    labels: ["Seeds", "Fertilizer", "Pesticides", "Labor", "Equipment", "Other"],
    data: [17, 26, 11, 28, 13, 5]
  },
  cropComparison: {
    labels: ["2021", "2022", "2023", "2024"],
    data: [
      [3.5, 4.2, 5.1, 5.8], // Maize
      [2.2, 2.8, 3.0, 3.2], // Wheat
      [28.0, 29.5, 30.2, 32.0], // Tomatoes
    ],
    colors: [
      `rgba(76, 175, 80, 1)`,
      `rgba(33, 150, 243, 1)`,
      `rgba(255, 152, 0, 1)`
    ],
    legend: ["Maize", "Wheat", "Tomatoes"]
  },
  waterUsage: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        data: [45000, 52000, 68000, 78000, 95000, 110000],
        color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
        strokeWidth: 2
      }
    ],
    legend: ["Water Usage (Gallons)"]
  }
};

export default function ChartsScreen() {
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeChart, setActiveChart] = useState('yields');
  const [timeFrame, setTimeFrame] = useState('year');

  const screenWidth = Dimensions.get('window').width - 32;
  
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();

  useEffect(() => {
    // Simulate data fetching
    setTimeout(() => {
      setChartData(CHART_DATA);
      setIsLoading(false);
    }, 1200);
  }, []);

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate API call to refresh data
    setTimeout(() => {
      setChartData(CHART_DATA);
      setIsLoading(false);
    }, 800);
  };

  const handleNavigation = (route) => {
    router.push(route);
  };

  const handleViewDetails = () => {
    router.push({
      pathname: '/(farmer)/analytics-details',
      params: {
        chart: activeChart,
        timeFrame,
        farmer: user?.name || user?.username || 'Unknown Farmer',
      },
    });
  };

  const handleExport = () => {
    Alert.alert(
      'Export',
      `Exporting chart for ${user?.name || user?.username || 'Unknown Farmer'}\nChart: ${activeChart}\nTime Frame: ${timeFrame}`
    );
  };

  const handleShare = () => {
    Alert.alert(
      'Share',
      `Sharing chart for ${user?.name || user?.username || 'Unknown Farmer'}\nChart: ${activeChart}\nTime Frame: ${timeFrame}`
    );
  };

  const chartOptions = [
    { id: 'yields', name: 'Crop Yields', icon: 'leaf-outline' },
    { id: 'revenue', name: 'Revenue', icon: 'cash-outline' },
    { id: 'expenses', name: 'Expenses', icon: 'wallet-outline' },
    { id: 'cropComparison', name: 'Yearly Comparison', icon: 'trending-up-outline' },
    { id: 'waterUsage', name: 'Water Usage', icon: 'water-outline' },
  ];

  const timeFrameOptions = [
    { id: 'month', name: 'Month' },
    { id: 'quarter', name: 'Quarter' },
    { id: 'year', name: 'Year' },
    { id: 'all', name: 'All Time' },
  ];

  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
    }
  };

  const navItems = [
    { name: 'Dashboard', icon: 'home-outline', route: '/(farmer)/' },
    { name: 'Market', icon: 'cart-outline', route: '/(farmer)/market' },
    { name: 'Analytics', icon: 'analytics-outline', route: '/(farmer)/charts' },
    { name: 'Settings', icon: 'settings-outline', route: '/(farmer)/settings' },
  ];

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading chart data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Farm Analytics Charts</Text>
          <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
            <Ionicons name="refresh-outline" size={24} color="#4CAF50" />
          </TouchableOpacity>
        </View>

        {/* Chart Type Selection */}
        <View style={styles.chartOptionsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {chartOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.chartOptionButton,
                  activeChart === option.id && styles.chartOptionButtonActive
                ]}
                onPress={() => setActiveChart(option.id)}
              >
                <Ionicons 
                  name={option.icon} 
                  size={18} 
                  color={activeChart === option.id ? '#4CAF50' : '#666'} 
                  style={styles.chartOptionIcon}
                />
                <Text 
                  style={[
                    styles.chartOptionText,
                    activeChart === option.id && styles.chartOptionTextActive
                  ]}
                >
                  {option.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Time Frame Selection */}
        <View style={styles.timeFrameContainer}>
          <Text style={styles.timeFrameLabel}>Time Period:</Text>
          <View style={styles.timeFrameButtons}>
            {timeFrameOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.timeFrameButton,
                  timeFrame === option.id && styles.timeFrameButtonActive
                ]}
                onPress={() => setTimeFrame(option.id)}
              >
                <Text 
                  style={[
                    styles.timeFrameButtonText,
                    timeFrame === option.id && styles.timeFrameButtonTextActive
                  ]}
                >
                  {option.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Chart Display */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>
            {chartOptions.find(option => option.id === activeChart)?.name || 'Chart'}
          </Text>

          {activeChart === 'yields' && (
            <View style={styles.chartContainer}>
              <BarChart
                data={{
                  labels: chartData.yields.labels,
                  datasets: chartData.yields.datasets
                }}
                width={screenWidth}
                height={220}
                chartConfig={{
                  ...chartConfig,
                  color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
                }}
                style={styles.chart}
                showValuesOnTopOfBars
                fromZero
              />
              <Text style={styles.chartDescription}>
                Crop yields in tons per acre across different crops
              </Text>
            </View>
          )}

          {activeChart === 'revenue' && (
            <View style={styles.chartContainer}>
              <LineChart
                data={{
                  labels: chartData.revenue.labels,
                  datasets: chartData.revenue.datasets,
                  legend: chartData.revenue.legend
                }}
                width={screenWidth}
                height={220}
                chartConfig={{
                  ...chartConfig,
                  color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
                }}
                style={styles.chart}
                bezier
              />
              <Text style={styles.chartDescription}>
                Monthly revenue trends throughout the year
              </Text>
            </View>
          )}

          {activeChart === 'expenses' && (
            <View style={styles.chartContainer}>
              <PieChart
                data={chartData.expenses.labels.map((label, index) => ({
                  name: label,
                  population: chartData.expenses.data[index],
                  color: [
                    '#4CAF50', '#2196F3', '#FFC107', 
                    '#FF5722', '#9C27B0', '#607D8B'
                  ][index],
                  legendFontColor: '#666',
                  legendFontSize: 12,
                }))}
                width={screenWidth}
                height={200}
                chartConfig={chartConfig}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
              />
              <Text style={styles.chartDescription}>
                Distribution of farm expenses by category
              </Text>
            </View>
          )}

          {activeChart === 'cropComparison' && (
            <View style={styles.chartContainer}>
              <BarChart
                data={{
                  labels: chartData.cropComparison.labels,
                  datasets: [
                    {
                      data: chartData.cropComparison.data[0],
                      color: (opacity = 1) => chartData.cropComparison.colors[0],
                    },
                    {
                      data: chartData.cropComparison.data[1],
                      color: (opacity = 1) => chartData.cropComparison.colors[1],
                    },
                    {
                      data: chartData.cropComparison.data[2],
                      color: (opacity = 1) => chartData.cropComparison.colors[2],
                    }
                  ],
                  legend: chartData.cropComparison.legend
                }}
                width={screenWidth}
                height={220}
                chartConfig={chartConfig}
                style={styles.chart}
                fromZero
                withInnerLines={false}
              />
              <View style={styles.legendContainer}>
                {chartData.cropComparison.legend.map((item, index) => (
                  <View key={index} style={styles.legendItem}>
                    <View 
                      style={[
                        styles.legendColor, 
                        { backgroundColor: chartData.cropComparison.colors[index] }
                      ]} 
                    />
                    <Text style={styles.legendText}>{item}</Text>
                  </View>
                ))}
              </View>
              <Text style={styles.chartDescription}>
                Comparison of crop yields over the years
              </Text>
            </View>
          )}

          {activeChart === 'waterUsage' && (
            <View style={styles.chartContainer}>
              <LineChart
                data={{
                  labels: chartData.waterUsage.labels,
                  datasets: chartData.waterUsage.datasets,
                  legend: chartData.waterUsage.legend
                }}
                width={screenWidth}
                height={220}
                chartConfig={{
                  ...chartConfig,
                  color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
                }}
                style={styles.chart}
                bezier
              />
              <Text style={styles.chartDescription}>
                Water consumption in gallons over time
              </Text>
            </View>
          )}
        </View>

        <View style={styles.insightsCard}>
          <Text style={styles.insightsTitle}>Data Insights</Text>
          
          {activeChart === 'yields' && (
            <View>
              <View style={styles.insightItem}>
                <Ionicons name="trending-up" size={20} color="#4CAF50" />
                <Text style={styles.insightText}>
                  Tomatoes have the highest yield per acre at 32 tons, significantly higher than other crops.
                </Text>
              </View>
              <View style={styles.insightItem}>
                <Ionicons name="analytics" size={20} color="#2196F3" />
                <Text style={styles.insightText}>
                  Maize yield of 5.8 tons/acre is above the regional average of 5.2 tons/acre.
                </Text>
              </View>
            </View>
          )}

          {activeChart === 'revenue' && (
            <View>
              <View style={styles.insightItem}>
                <Ionicons name="trending-up" size={20} color="#4CAF50" />
                <Text style={styles.insightText}>
                  Peak revenue occurs in August at BWP 14,200, likely due to the main harvest season.
                </Text>
              </View>
              <View style={styles.insightItem}>
                <Ionicons name="analytics" size={20} color="#2196F3" />
                <Text style={styles.insightText}>
                  Summer months (June-September) account for 42% of annual revenue.
                </Text>
              </View>
            </View>
          )}

          {activeChart === 'expenses' && (
            <View>
              <View style={styles.insightItem}>
                <Ionicons name="alert-circle" size={20} color="#FFC107" />
                <Text style={styles.insightText}>
                  Labor (28%) and fertilizer (26%) are your largest expense categories.
                </Text>
              </View>
              <View style={styles.insightItem}>
                <Ionicons name="analytics" size={20} color="#2196F3" />
                <Text style={styles.insightText}>
                  Your pesticide expenses (11%) are lower than regional average (15%).
                </Text>
              </View>
            </View>
          )}

          {activeChart === 'cropComparison' && (
            <View>
              <View style={styles.insightItem}>
                <Ionicons name="trending-up" size={20} color="#4CAF50" />
                <Text style={styles.insightText}>
                  All three major crops show consistent yield improvement over the past 4 years.
                </Text>
              </View>
              <View style={styles.insightItem}>
                <Ionicons name="analytics" size={20} color="#2196F3" />
                <Text style={styles.insightText}>
                  Maize has shown the highest growth rate at 65.7% since 2021.
                </Text>
              </View>
            </View>
          )}

          {activeChart === 'waterUsage' && (
            <View>
              <View style={styles.insightItem}>
                <Ionicons name="trending-up" size={20} color="#FF5722" />
                <Text style={styles.insightText}>
                  Water usage has increased by 144% from January to June.
                </Text>
              </View>
              <View style={styles.insightItem}>
                <Ionicons name="analytics" size={20} color="#2196F3" />
                <Text style={styles.insightText}>
                  June usage (110,000 gallons) is above seasonal average, consider irrigation optimizations.
                </Text>
              </View>
            </View>
          )}
        </View>

        <View style={{ height: 220 }} /> {/* Spacer to ensure content is not hidden behind fixed buttons */}
      </ScrollView>

      {/* Fixed Action Buttons Footer */}
      <SafeAreaView style={styles.fixedFooter}>
        <TouchableOpacity style={styles.fixedAnalysisButton} onPress={handleViewDetails}>
          <Text style={styles.fixedAnalysisButtonText}>View Detailed Analysis</Text>
        </TouchableOpacity>
        <View style={styles.fixedActionButtonsRow}>
          <TouchableOpacity style={styles.fixedActionButton} onPress={handleExport}>
            <Ionicons name="download-outline" size={20} color="#FFF" />
            <Text style={styles.fixedActionButtonText}>Export Chart</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.fixedActionButton} onPress={handleShare}>
            <Ionicons name="share-social-outline" size={20} color="#FFF" />
            <Text style={styles.fixedActionButtonText}>Share</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

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
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
    paddingBottom: 320, // Large enough to prevent overlap with fixed footer and nav
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  refreshButton: {
    padding: 8,
  },
  chartOptionsContainer: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  chartOptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  chartOptionButtonActive: {
    backgroundColor: '#E8F5E9',
  },
  chartOptionIcon: {
    marginRight: 6,
  },
  chartOptionText: {
    fontSize: 14,
    color: '#666',
  },
  chartOptionTextActive: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  timeFrameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    marginTop: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  timeFrameLabel: {
    fontSize: 14,
    color: '#333',
    marginRight: 12,
  },
  timeFrameButtons: {
    flexDirection: 'row',
  },
  timeFrameButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginHorizontal: 4,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
  },
  timeFrameButtonActive: {
    backgroundColor: '#E8F5E9',
  },
  timeFrameButtonText: {
    fontSize: 12,
    color: '#666',
  },
  timeFrameButtonTextActive: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  chartCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    margin: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  chartContainer: {
    alignItems: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 8,
  },
  chartDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 4,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
  insightsCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    margin: 16,
    marginTop: 0,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  insightsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
  },
  insightText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 12,
    flex: 1,
  },
  moreInsightsButton: {
    backgroundColor: '#E8F5E9',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  moreInsightsText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 16,
    marginBottom: 80,
    marginTop: 16,
  },
  actionButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  bottomNav: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingVertical: 8,
    justifyContent: 'space-around',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  activeNavText: {
    color: '#4CAF50',
  },
  fixedFooter: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 60, // Height of bottom nav
    backgroundColor: '#fff',
    paddingTop: 8,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    zIndex: 10,
    elevation: 10,
  },
  fixedAnalysisButton: {
    backgroundColor: '#E8F5E9',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  fixedAnalysisButtonText: {
    color: '#4CAF50',
    fontWeight: 'bold',
    fontSize: 16,
  },
  fixedActionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  fixedActionButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  fixedActionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
}); 