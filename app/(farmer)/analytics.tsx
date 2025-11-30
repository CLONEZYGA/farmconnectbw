import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';

// Sample analytics data for demonstration
const ANALYTICS_DATA = {
  summary: {
    revenue: { 
      current: 42500, 
      previous: 38200, 
      change: 11.3 
    },
    expenses: { 
      current: 18700, 
      previous: 20100, 
      change: -7.0 
    },
    profit: { 
      current: 23800, 
      previous: 18100, 
      change: 31.5 
    },
    yieldRate: { 
      current: 87, 
      previous: 82, 
      change: 6.1 
    }
  },
  cropPerformance: [
    { id: '1', name: 'Maize', area: '12 acres', yield: '5.8 tons/acre', revenue: 18500, profit: 11200, status: 'high' },
    { id: '2', name: 'Tomatoes', area: '3 acres', yield: '32 tons/acre', revenue: 12800, profit: 7300, status: 'medium' },
    { id: '3', name: 'Wheat', area: '8 acres', yield: '3.2 tons/acre', revenue: 9600, profit: 4200, status: 'low' },
    { id: '4', name: 'Soybeans', area: '5 acres', yield: '2.9 tons/acre', revenue: 7300, profit: 3800, status: 'medium' }
  ],
  revenueHistory: [
    { month: 'Jan', value: 8200 },
    { month: 'Feb', value: 7500 },
    { month: 'Mar', value: 9100 },
    { month: 'Apr', value: 8700 },
    { month: 'May', value: 10200 },
    { month: 'Jun', value: 11500 },
    { month: 'Jul', value: 12300 },
    { month: 'Aug', value: 14200 },
    { month: 'Sep', value: 12800 },
    { month: 'Oct', value: 9500 },
    { month: 'Nov', value: 8300 },
    { month: 'Dec', value: 7900 }
  ],
  expenseBreakdown: [
    { category: 'Seeds', amount: 3200, percentage: 17 },
    { category: 'Fertilizer', amount: 4800, percentage: 26 },
    { category: 'Pesticides', amount: 2100, percentage: 11 },
    { category: 'Labor', amount: 5300, percentage: 28 },
    { category: 'Equipment', amount: 2500, percentage: 13 },
    { category: 'Other', amount: 800, percentage: 5 }
  ],
  resourceUtilization: {
    water: { used: 1250000, target: 1500000, unit: 'liters', efficiency: 83 },
    electricity: { used: 4200, target: 5000, unit: 'kWh', efficiency: 84 },
    fuel: { used: 850, target: 1000, unit: 'liters', efficiency: 85 },
    labor: { used: 480, target: 520, unit: 'hours', efficiency: 92 }
  }
};

export default function AnalyticsScreen() {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeFrame, setTimeFrame] = useState('month');
  const [comparisonMode, setComparisonMode] = useState('previous');
  
  const router = useRouter();
  const pathname = usePathname();

  // Simulate data loading
  useEffect(() => {
    const fetchData = async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAnalyticsData(ANALYTICS_DATA);
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    setAnalyticsData(ANALYTICS_DATA);
    setLoading(false);
  };

  const handleNavigation = (route) => {
    router.push(route);
  };

  const navItems = [
    { name: 'Dashboard', icon: 'home-outline', route: '/(farmer)/' },
    { name: 'Market', icon: 'cart-outline', route: '/(farmer)/market' },
    { name: 'Analytics', icon: 'analytics-outline', route: '/(farmer)/charts' },
    { name: 'Settings', icon: 'settings-outline', route: '/(farmer)/settings' },
  ];

  const timeFrameOptions = [
    { id: 'week', label: 'Week' },
    { id: 'month', label: 'Month' },
    { id: 'quarter', label: 'Quarter' },
    { id: 'year', label: 'Year' },
  ];

  const getChangeColor = (change) => {
    if (change > 0) return '#4CAF50';
    if (change < 0) return '#F44336';
    return '#757575';
  };

  const getChangeIcon = (change) => {
    if (change > 0) return 'arrow-up';
    if (change < 0) return 'arrow-down';
    return 'remove';
  };

  const formatCurrency = (value) => {
    return 'BWP ' + value.toLocaleString();
  };

  const getPerformanceColor = (status) => {
    switch (status) {
      case 'high': return '#4CAF50';
      case 'medium': return '#FFC107';
      case 'low': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  // Simple chart rendering using View elements
  const renderChart = (data) => {
    const maxValue = Math.max(...data.map(item => item.value));
    const chartWidth = Dimensions.get('window').width - 64;
    const barWidth = (chartWidth / data.length) - 4;
    
    return (
      <View style={styles.chartContainer}>
        <View style={styles.chartBars}>
          {data.map((item, index) => (
            <View key={index} style={styles.barContainer}>
              <View 
                style={[
                  styles.bar, 
                  { 
                    height: (item.value / maxValue) * 150,
                    width: barWidth
                  }
                ]} 
              />
              <Text style={styles.barLabel}>{item.month}</Text>
            </View>
          ))}
        </View>
        <View style={styles.chartAxisY}>
          <Text style={styles.axisLabel}>{formatCurrency(maxValue)}</Text>
          <Text style={styles.axisLabel}>{formatCurrency(maxValue/2)}</Text>
          <Text style={styles.axisLabel}>BWP 0</Text>
        </View>
      </View>
    );
  };

  // Simple resource utilization meter
  const renderUtilizationMeter = (label, used, target, unit, efficiency) => {
    return (
      <View style={styles.utilizationItem}>
        <View style={styles.utilizationHeader}>
          <Text style={styles.utilizationLabel}>{label}</Text>
          <Text style={styles.utilizationValue}>
            {used.toLocaleString()} / {target.toLocaleString()} {unit}
          </Text>
        </View>
        <View style={styles.utilizationBarContainer}>
          <View style={styles.utilizationBar}>
            <View 
              style={[
                styles.utilizationFill, 
                { 
                  width: `${(used / target) * 100}%`,
                  backgroundColor: efficiency > 80 ? '#4CAF50' : efficiency > 60 ? '#FFC107' : '#F44336'
                }
              ]} 
            />
          </View>
          <Text style={styles.efficiencyLabel}>{efficiency}%</Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066CC" />
        <Text style={styles.loadingText}>Loading analytics data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Farm Analytics</Text>
          <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
            <Ionicons name="refresh" size={24} color="#0066CC" />
          </TouchableOpacity>
        </View>

        {/* Time frame selector */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.timeFrameContainer}
        >
          {timeFrameOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.timeFrameButton,
                timeFrame === option.id && styles.timeFrameButtonActive,
              ]}
              onPress={() => setTimeFrame(option.id)}
            >
              <Text
                style={[
                  styles.timeFrameButtonText,
                  timeFrame === option.id && styles.timeFrameButtonTextActive,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Summary metrics */}
        <View style={styles.metricsContainer}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Revenue</Text>
            <Text style={styles.metricValue}>{formatCurrency(analyticsData.summary.revenue.current)}</Text>
            <View style={styles.changeContainer}>
              <Ionicons 
                name={getChangeIcon(analyticsData.summary.revenue.change)} 
                size={14} 
                color={getChangeColor(analyticsData.summary.revenue.change)} 
              />
              <Text 
                style={[
                  styles.changeText, 
                  { color: getChangeColor(analyticsData.summary.revenue.change) }
                ]}
              >
                {Math.abs(analyticsData.summary.revenue.change).toFixed(1)}%
              </Text>
            </View>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Expenses</Text>
            <Text style={styles.metricValue}>{formatCurrency(analyticsData.summary.expenses.current)}</Text>
            <View style={styles.changeContainer}>
              <Ionicons 
                name={getChangeIcon(analyticsData.summary.expenses.change)} 
                size={14} 
                color={getChangeColor(-analyticsData.summary.expenses.change)} // Inverted for expenses (negative is good)
              />
              <Text 
                style={[
                  styles.changeText, 
                  { color: getChangeColor(-analyticsData.summary.expenses.change) }
                ]}
              >
                {Math.abs(analyticsData.summary.expenses.change).toFixed(1)}%
              </Text>
            </View>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Profit</Text>
            <Text style={styles.metricValue}>{formatCurrency(analyticsData.summary.profit.current)}</Text>
            <View style={styles.changeContainer}>
              <Ionicons 
                name={getChangeIcon(analyticsData.summary.profit.change)} 
                size={14} 
                color={getChangeColor(analyticsData.summary.profit.change)} 
              />
              <Text 
                style={[
                  styles.changeText, 
                  { color: getChangeColor(analyticsData.summary.profit.change) }
                ]}
              >
                {Math.abs(analyticsData.summary.profit.change).toFixed(1)}%
              </Text>
            </View>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Yield Rate</Text>
            <Text style={styles.metricValue}>{analyticsData.summary.yieldRate.current}%</Text>
            <View style={styles.changeContainer}>
              <Ionicons 
                name={getChangeIcon(analyticsData.summary.yieldRate.change)} 
                size={14} 
                color={getChangeColor(analyticsData.summary.yieldRate.change)} 
              />
              <Text 
                style={[
                  styles.changeText, 
                  { color: getChangeColor(analyticsData.summary.yieldRate.change) }
                ]}
              >
                {Math.abs(analyticsData.summary.yieldRate.change).toFixed(1)}%
              </Text>
            </View>
          </View>
        </View>

        {/* Revenue history chart */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Revenue History</Text>
            <TouchableOpacity style={styles.moreButton}>
              <Text style={styles.moreButtonText}>Details</Text>
            </TouchableOpacity>
          </View>
          {renderChart(analyticsData.revenueHistory)}
        </View>

        {/* Crop performance */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Crop Performance</Text>
            <TouchableOpacity style={styles.moreButton}>
              <Text style={styles.moreButtonText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {analyticsData.cropPerformance.map((crop) => (
            <View key={crop.id} style={styles.cropItem}>
              <View style={styles.cropHeader}>
                <Text style={styles.cropName}>{crop.name}</Text>
                <View style={[styles.statusIndicator, { backgroundColor: getPerformanceColor(crop.status) }]} />
              </View>
              
              <View style={styles.cropDetails}>
                <View style={styles.cropDetailColumn}>
                  <Text style={styles.cropDetailLabel}>Area</Text>
                  <Text style={styles.cropDetailValue}>{crop.area}</Text>
                </View>
                
                <View style={styles.cropDetailColumn}>
                  <Text style={styles.cropDetailLabel}>Yield</Text>
                  <Text style={styles.cropDetailValue}>{crop.yield}</Text>
                </View>
                
                <View style={styles.cropDetailColumn}>
                  <Text style={styles.cropDetailLabel}>Revenue</Text>
                  <Text style={styles.cropDetailValue}>{formatCurrency(crop.revenue)}</Text>
                </View>
                
                <View style={styles.cropDetailColumn}>
                  <Text style={styles.cropDetailLabel}>Profit</Text>
                  <Text style={styles.cropDetailValue}>{formatCurrency(crop.profit)}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Expense breakdown */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Expense Breakdown</Text>
            <TouchableOpacity style={styles.moreButton}>
              <Text style={styles.moreButtonText}>Details</Text>
            </TouchableOpacity>
          </View>
          
          {analyticsData.expenseBreakdown.map((expense, index) => (
            <View key={index} style={styles.expenseItem}>
              <View style={styles.expenseInfo}>
                <Text style={styles.expenseCategory}>{expense.category}</Text>
                <Text style={styles.expenseAmount}>{formatCurrency(expense.amount)}</Text>
              </View>
              <View style={styles.expenseBarContainer}>
                <View 
                  style={[
                    styles.expenseBar, 
                    { width: `${expense.percentage}%` }
                  ]}
                />
                <Text style={styles.expensePercentage}>{expense.percentage}%</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Resource utilization */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Resource Utilization</Text>
            <TouchableOpacity style={styles.moreButton}>
              <Text style={styles.moreButtonText}>Details</Text>
            </TouchableOpacity>
          </View>
          
          {renderUtilizationMeter(
            'Water', 
            analyticsData.resourceUtilization.water.used, 
            analyticsData.resourceUtilization.water.target, 
            analyticsData.resourceUtilization.water.unit,
            analyticsData.resourceUtilization.water.efficiency
          )}
          
          {renderUtilizationMeter(
            'Electricity', 
            analyticsData.resourceUtilization.electricity.used, 
            analyticsData.resourceUtilization.electricity.target, 
            analyticsData.resourceUtilization.electricity.unit,
            analyticsData.resourceUtilization.electricity.efficiency
          )}
          
          {renderUtilizationMeter(
            'Fuel', 
            analyticsData.resourceUtilization.fuel.used, 
            analyticsData.resourceUtilization.fuel.target, 
            analyticsData.resourceUtilization.fuel.unit,
            analyticsData.resourceUtilization.fuel.efficiency
          )}
          
          {renderUtilizationMeter(
            'Labor', 
            analyticsData.resourceUtilization.labor.used, 
            analyticsData.resourceUtilization.labor.target, 
            analyticsData.resourceUtilization.labor.unit,
            analyticsData.resourceUtilization.labor.efficiency
          )}
        </View>

        {/* Insights and recommendations */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Insights & Recommendations</Text>
          
          <View style={styles.insightItem}>
            <Ionicons name="trending-up" size={24} color="#4CAF50" />
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>Profit Improvement</Text>
              <Text style={styles.insightText}>
                Your profit has increased by 31.5% compared to last period, primarily due to higher maize yields 
                and reduced input costs.
              </Text>
            </View>
          </View>
          
          <View style={styles.insightItem}>
            <Ionicons name="alert-circle" size={24} color="#FFC107" />
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>Wheat Underperformance</Text>
              <Text style={styles.insightText}>
                Wheat yields are below target by 15%. Consider soil testing and adjusting fertilizer application 
                to improve performance.
              </Text>
            </View>
          </View>
          
          <View style={styles.insightItem}>
            <Ionicons name="water" size={24} color="#2196F3" />
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>Water Optimization</Text>
              <Text style={styles.insightText}>
                You're using 17% less water than your target while maintaining good crop health. 
                This is improving your overall resource efficiency.
              </Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.viewMoreButton}>
            <Text style={styles.viewMoreButtonText}>View All Insights</Text>
          </TouchableOpacity>
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
              color={pathname === item.route ? '#0066CC' : '#666'}
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
  scrollContainer: {
    paddingBottom: 80,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
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
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  refreshButton: {
    padding: 8,
  },
  timeFrameContainer: {
    flexDirection: 'row',
    padding: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  timeFrameButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  timeFrameButtonActive: {
    backgroundColor: '#0066CC',
    borderColor: '#0066CC',
  },
  timeFrameButtonText: {
    fontSize: 14,
    color: '#666',
  },
  timeFrameButtonTextActive: {
    color: '#fff',
  },
  metricsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  metricCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  metricLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    margin: 16,
    marginTop: 0,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  moreButton: {
    padding: 4,
  },
  moreButtonText: {
    color: '#0066CC',
    fontSize: 14,
  },
  chartContainer: {
    flexDirection: 'row',
    height: 180,
    marginTop: 8,
  },
  chartBars: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingLeft: 24,
  },
  chartAxisY: {
    width: 50,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingBottom: 20,
    paddingTop: 10,
  },
  axisLabel: {
    fontSize: 10,
    color: '#999',
  },
  barContainer: {
    alignItems: 'center',
  },
  bar: {
    backgroundColor: '#0066CC',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    minHeight: 2,
  },
  barLabel: {
    fontSize: 10,
    color: '#666',
    marginTop: 4,
  },
  cropItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingVertical: 12,
  },
  cropHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cropName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  cropDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cropDetailColumn: {
    flex: 1,
  },
  cropDetailLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  cropDetailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  expenseItem: {
    marginBottom: 16,
  },
  expenseInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  expenseCategory: {
    fontSize: 14,
    color: '#333',
  },
  expenseAmount: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  expenseBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 16,
  },
  expenseBar: {
    height: 8,
    backgroundColor: '#0066CC',
    borderRadius: 4,
  },
  expensePercentage: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
  utilizationItem: {
    marginBottom: 16,
  },
  utilizationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  utilizationLabel: {
    fontSize: 14,
    color: '#333',
  },
  utilizationValue: {
    fontSize: 12,
    color: '#666',
  },
  utilizationBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  utilizationBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 8,
  },
  utilizationFill: {
    height: '100%',
  },
  efficiencyLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    width: 30,
    textAlign: 'right',
  },
  insightItem: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 12,
  },
  insightContent: {
    marginLeft: 12,
    flex: 1,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  insightText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  viewMoreButton: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  viewMoreButtonText: {
    color: '#0066CC',
    fontSize: 14,
    fontWeight: '500',
  },
  bottomNav: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    height: 60,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingVertical: 8,
    justifyContent: 'space-around',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  navText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  activeNavText: {
    color: '#0066CC',
  },
}); 