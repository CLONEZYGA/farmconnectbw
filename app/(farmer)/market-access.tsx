import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';

const MARKET_OPPORTUNITIES = [
  {
    id: '1',
    title: 'Bulk Vegetable Supply',
    buyer: 'Fresh Market Ltd',
    type: 'Contract',
    duration: '6 months',
    quantity: '500kg weekly',
    status: 'Open',
    requirements: ['Organic certified', 'Regular supply', 'Quality standards'],
  },
  {
    id: '2',
    title: 'Local Restaurant Supply',
    buyer: 'Green Plate Restaurant',
    type: 'Direct',
    duration: '3 months',
    quantity: '100kg weekly',
    status: 'Open',
    requirements: ['Fresh produce', 'Morning delivery', 'Local farms'],
  },
];

const MARKET_INSIGHTS = [
  {
    id: '1',
    title: 'Tomato Price Trend',
    trend: 'up',
    change: '+15%',
    period: 'Last month',
  },
  {
    id: '2',
    title: 'Potato Demand',
    trend: 'up',
    change: '+20%',
    period: 'This quarter',
  },
];

export default function MarketAccessScreen() {
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Market Access</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Market Opportunities</Text>
          {MARKET_OPPORTUNITIES.map(opportunity => (
            <TouchableOpacity key={opportunity.id} style={styles.opportunityCard}>
              <View style={styles.opportunityHeader}>
                <Text style={styles.opportunityTitle}>{opportunity.title}</Text>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>{opportunity.status}</Text>
                </View>
              </View>

              <View style={styles.buyerInfo}>
                <Ionicons name="business" size={16} color="#666" />
                <Text style={styles.buyerName}>{opportunity.buyer}</Text>
              </View>

              <View style={styles.detailsGrid}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Type</Text>
                  <Text style={styles.detailValue}>{opportunity.type}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Duration</Text>
                  <Text style={styles.detailValue}>{opportunity.duration}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Quantity</Text>
                  <Text style={styles.detailValue}>{opportunity.quantity}</Text>
                </View>
              </View>

              <View style={styles.requirements}>
                <Text style={styles.requirementsTitle}>Requirements:</Text>
                {opportunity.requirements.map((req, index) => (
                  <View key={index} style={styles.requirementItem}>
                    <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                    <Text style={styles.requirementText}>{req}</Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity style={styles.applyButton}>
                <Text style={styles.applyButtonText}>Apply Now</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Market Insights</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.insightsContainer}
          >
            {MARKET_INSIGHTS.map(insight => (
              <View key={insight.id} style={styles.insightCard}>
                <View style={styles.insightHeader}>
                  <Text style={styles.insightTitle}>{insight.title}</Text>
                  <Ionicons 
                    name={insight.trend === 'up' ? 'trending-up' : 'trending-down'} 
                    size={24} 
                    color={insight.trend === 'up' ? '#4CAF50' : '#F44336'} 
                  />
                </View>
                <Text style={[
                  styles.insightChange,
                  { color: insight.trend === 'up' ? '#4CAF50' : '#F44336' }
                ]}>{insight.change}</Text>
                <Text style={styles.insightPeriod}>{insight.period}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resources</Text>
          <View style={styles.resourcesGrid}>
            <TouchableOpacity style={styles.resourceCard}>
              <Ionicons name="document-text" size={24} color="#4CAF50" />
              <Text style={styles.resourceTitle}>Market Reports</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.resourceCard}>
              <Ionicons name="calculator" size={24} color="#4CAF50" />
              <Text style={styles.resourceTitle}>Price Calculator</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.resourceCard}>
              <Ionicons name="people" size={24} color="#4CAF50" />
              <Text style={styles.resourceTitle}>Buyer Directory</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.resourceCard}>
              <Ionicons name="book" size={24} color="#4CAF50" />
              <Text style={styles.resourceTitle}>Guidelines</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  opportunityCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  opportunityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  opportunityTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
  },
  buyerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  buyerName: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  detailsGrid: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  requirements: {
    marginBottom: 16,
  },
  requirementsTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  requirementText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
  },
  applyButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  insightsContainer: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  insightCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    width: 160,
  },
  insightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  insightTitle: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  insightChange: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  insightPeriod: {
    fontSize: 12,
    color: '#666',
  },
  resourcesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: -6,
  },
  resourceCard: {
    width: '50%',
    padding: 6,
  },
  resourceInner: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  resourceTitle: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    marginTop: 8,
  },
}); 