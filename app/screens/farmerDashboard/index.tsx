import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  ImageBackground,
  ScrollView,
  useWindowDimensions,
  Alert,
  TextInput,
  Modal,
  Dimensions,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { 
  PermissionLevel, 
  hasPermission, 
  canAccessFeature, 
  isSystemAdmin 
} from '../../utils/permissions';
import {
  LineChart,
  BarChart,
  PieChart,
} from 'react-native-chart-kit';

// Define chart config type
type ChartConfigType = {
  backgroundGradientFrom: string;
  backgroundGradientTo: string;
  color: (opacity?: number) => string;
  strokeWidth: number;
  barPercentage: number;
  useShadowColorFromDataset: boolean;
  decimalPlaces: number;
  labelColor: (opacity?: number) => string;
  propsForDots?: {
    r: string;
    strokeWidth: string;
    stroke: string;
  };
};

// Define proper types for components
type TabProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

type CardProps = {
  title: string;
  icon: string;
  onPress: () => void;
  adminOnly?: boolean;
};

// Tab navigation component
const TabNav = ({ activeTab, setActiveTab }: TabProps) => {
  const { user } = useAuth();
  const isAdmin = isSystemAdmin(user);
  
  const tabs = ['FarmData', 'Analytics', 'Settings'];
  
  // Add Admin tab for admins
  const allTabs = isAdmin ? [...tabs, 'Admin', 'Logout'] : [...tabs, 'Logout'];
  
  return (
    <View style={styles.tabContainer}>
      {allTabs.map((tab, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.tab, activeTab === tab && styles.activeTab]}
          onPress={() => setActiveTab(tab)}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === tab && styles.activeTabText,
            ]}
          >
            {tab}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

// Bottom navigation component
const BottomNav = () => {
  const { user } = useAuth();
  const isAdmin = isSystemAdmin(user);
  
  const navItems = [
    { name: 'Dashboard', icon: '🏠' },
    { name: 'Market', icon: '🛒' },
    { name: 'Chat', icon: '💬' },
  ];
  
  // Add Admin item for admins
  const allNavItems = isAdmin 
    ? [...navItems, { name: 'Admin', icon: '⚙️' }, { name: 'Profile', icon: '👤' }]
    : [...navItems, { name: 'Profile', icon: '👤' }];

  return (
    <View style={styles.bottomNav}>
      {allNavItems.map((item, index) => (
        <TouchableOpacity key={index} style={styles.bottomNavItem}>
          <Text style={styles.bottomNavIcon}>{item.icon}</Text>
          <Text style={styles.bottomNavText}>{item.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

// Card component
const DashboardCard = ({ title, icon, onPress, adminOnly = false }: CardProps) => (
  <TouchableOpacity style={[styles.card, adminOnly && styles.adminCard]} onPress={onPress}>
    <View style={[styles.cardIconContainer, adminOnly && styles.adminCardIcon]}>
      <Text style={styles.cardIcon}>{icon}</Text>
    </View>
    <Text style={styles.cardTitle}>{title}</Text>
    {adminOnly && <Text style={styles.adminBadge}>ADMIN</Text>}
  </TouchableOpacity>
);

// Account creation modal
const CreateAccountModal = ({ visible, onClose }: { visible: boolean, onClose: () => void }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('FARMER');
  const { register } = useAuth();

  const handleCreateAccount = async () => {
    try {
      const success = await register(name, email, password, role);
      if (success) {
        Alert.alert(
          "Account Created Successfully",
          `New ${role} account created for ${name}`,
          [{ text: "OK", onPress: onClose }]
        );
        
        // Reset form fields
        setName('');
        setEmail('');
        setPassword('');
        setRole('FARMER');
      } else {
        Alert.alert(
          "Error",
          "Failed to create account. Please try again."
        );
      }
    } catch (error) {
      Alert.alert(
        "Error",
        "An unexpected error occurred while creating the account."
      );
      console.error(error);
    }
  };
  
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Create New Account</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput
              style={styles.textInput}
              value={name}
              onChangeText={setName}
              placeholder="Enter full name"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.textInput}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter email address"
              keyboardType="email-address"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={styles.textInput}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter password"
              secureTextEntry
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Role</Text>
            <View style={styles.roleContainer}>
              {['FARMER', 'BUYER', 'EXPERT', 'ADMIN'].map((roleOption) => (
                <TouchableOpacity
                  key={roleOption}
                  style={[styles.roleButton, role === roleOption && styles.roleButtonActive]}
                  onPress={() => setRole(roleOption)}
                >
                  <Text 
                    style={[styles.roleButtonText, role === roleOption && styles.roleButtonTextActive]}
                  >
                    {roleOption}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.createButton} 
              onPress={handleCreateAccount}
              disabled={!name || !email || !password}
            >
              <Text style={styles.createButtonText}>Create Account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// System Settings Modal
const SystemSettingsModal = ({ visible, onClose }: { visible: boolean, onClose: () => void }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>System Settings</Text>
          
          <View style={styles.settingsSection}>
            <Text style={styles.settingSectionTitle}>Access Control</Text>
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Full Admin Access:</Text>
              <Text style={styles.settingValue}>Enabled</Text>
            </View>
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Permission Mode:</Text>
              <Text style={styles.settingValue}>Super Admin (Unrestricted)</Text>
            </View>
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>System Permissions:</Text>
              <Text style={styles.settingValue}>All Features</Text>
            </View>
          </View>
          
          <View style={styles.settingsSection}>
            <Text style={styles.settingSectionTitle}>Admin Controls</Text>
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Database Access:</Text>
              <Text style={styles.settingValue}>Full Access</Text>
            </View>
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Configuration Access:</Text>
              <Text style={styles.settingValue}>Unrestricted</Text>
            </View>
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>User Management:</Text>
              <Text style={styles.settingValue}>Full Control</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// User management component for Admin
const UserManagement = ({ onCreateAccount }: { onCreateAccount: () => void }) => {
  return (
    <View style={styles.adminSection}>
      <View style={styles.adminSectionHeader}>
        <Text style={styles.adminSectionTitle}>User Management</Text>
        <TouchableOpacity style={styles.addButton} onPress={onCreateAccount}>
          <Text style={styles.addButtonText}>+ New Account</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.userListContainer}>
        <Text style={styles.instructionText}>
          This section allows administrators to create and manage user accounts. 
          As an admin, you have full control over all user accounts in the system.
        </Text>
        
        <View style={styles.userCreateInstructions}>
          <Text style={styles.stepTitle}>Admin Capabilities:</Text>
          <Text style={styles.stepText}>• Create accounts with any role</Text>
          <Text style={styles.stepText}>• Modify any user account</Text>
          <Text style={styles.stepText}>• Reset passwords for any account</Text>
          <Text style={styles.stepText}>• Grant or revoke admin privileges</Text>
          <Text style={styles.stepText}>• Delete any user account</Text>
        </View>
      </View>
    </View>
  );
};

// Analytics component for Admin
const Analytics = () => {
  const screenWidth = Dimensions.get('window').width - 60;
  
  const chartConfig: ChartConfigType = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(25, 118, 210, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
    labelColor: () => '#333',
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#1976D2'
    }
  };

  const lineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
        color: (opacity = 1) => `rgba(25, 118, 210, ${opacity})`,
        strokeWidth: 2
      }
    ],
    legend: ['Farm Productivity']
  };

  const pieData = [
    {
      name: 'Crops',
      population: 45,
      color: '#1976D2',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15
    },
    {
      name: 'Livestock',
      population: 28,
      color: '#4CAF50',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15
    },
    {
      name: 'Equipment',
      population: 17,
      color: '#FF9800',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15
    },
    {
      name: 'Other',
      population: 10,
      color: '#9C27B0',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15
    }
  ];

  return (
    <View style={styles.adminSection}>
      <Text style={styles.adminSectionTitle}>Analytics Dashboard</Text>
      <Text style={styles.instructionText}>
        Farm performance metrics and data analytics across all users and operations.
      </Text>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Farm Productivity Trends</Text>
        <LineChart
          data={lineData}
          width={screenWidth}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Resource Distribution</Text>
        <PieChart
          data={pieData}
          width={screenWidth}
          height={220}
          chartConfig={chartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          style={styles.chart}
        />
      </View>

      <View style={styles.analyticsActions}>
        <TouchableOpacity style={styles.analyticsButton}>
          <Text style={styles.analyticsButtonText}>Export Reports</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.analyticsButton}>
          <Text style={styles.analyticsButtonText}>View Detailed Stats</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Approvals component for Admin
const Approvals = () => {
  const pendingApprovals = [
    { id: 1, type: 'Account Verification', user: 'John Farmer', date: '2023-07-15', status: 'Pending' },
    { id: 2, type: 'Expense Report', user: 'Sarah Expert', date: '2023-07-14', status: 'Pending' },
    { id: 3, type: 'Market Listing', user: 'Mike Buyer', date: '2023-07-12', status: 'Pending' },
    { id: 4, type: 'Account Verification', user: 'Lisa Farmer', date: '2023-07-10', status: 'Pending' },
  ];

  return (
    <View style={styles.adminSection}>
      <Text style={styles.adminSectionTitle}>Approval Center</Text>
      <Text style={styles.instructionText}>
        Review and process pending approval requests from system users.
      </Text>

      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderCell, { flex: 0.5 }]}>ID</Text>
          <Text style={[styles.tableHeaderCell, { flex: 1.5 }]}>Type</Text>
          <Text style={[styles.tableHeaderCell, { flex: 1.5 }]}>User</Text>
          <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Date</Text>
          <Text style={[styles.tableHeaderCell, { flex: 1.5 }]}>Actions</Text>
        </View>

        <ScrollView style={styles.tableBody}>
          {pendingApprovals.map((item) => (
            <View key={item.id} style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 0.5 }]}>{item.id}</Text>
              <Text style={[styles.tableCell, { flex: 1.5 }]}>{item.type}</Text>
              <Text style={[styles.tableCell, { flex: 1.5 }]}>{item.user}</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>{item.date}</Text>
              <View style={[styles.tableCellActions, { flex: 1.5 }]}>
                <TouchableOpacity style={[styles.actionButton, styles.approveButton]}>
                  <Text style={styles.actionButtonText}>Approve</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, styles.rejectButton]}>
                  <Text style={styles.actionButtonText}>Reject</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={styles.approvalsSummary}>
        <Text style={styles.approvalsSummaryText}>
          4 pending approvals require your attention
        </Text>
        <TouchableOpacity style={styles.refreshButton}>
          <Text style={styles.refreshButtonText}>Refresh List</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Reports component for Admin
const Reports = () => {
  const availableReports = [
    { id: 1, name: 'Monthly User Activity', description: 'User engagement and activity metrics', format: 'PDF' },
    { id: 2, name: 'Farm Production Summary', description: 'Summary of farm production across all users', format: 'Excel' },
    { id: 3, name: 'Financial Transactions', description: 'All financial transactions in the system', format: 'CSV' },
    { id: 4, name: 'System Performance', description: 'Application performance and usage statistics', format: 'PDF' },
  ];

  return (
    <View style={styles.adminSection}>
      <Text style={styles.adminSectionTitle}>Reports Center</Text>
      <Text style={styles.instructionText}>
        Generate and download system reports for analytics and compliance.
      </Text>

      <View style={styles.reportsGrid}>
        {availableReports.map((report) => (
          <View key={report.id} style={styles.reportCard}>
            <View style={styles.reportHeader}>
              <Text style={styles.reportName}>{report.name}</Text>
              <Text style={styles.reportFormat}>{report.format}</Text>
            </View>
            <Text style={styles.reportDescription}>{report.description}</Text>
            <View style={styles.reportActions}>
              <TouchableOpacity style={styles.reportButton}>
                <Text style={styles.reportButtonText}>Generate</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.reportButton}>
                <Text style={styles.reportButtonText}>Schedule</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.customReportSection}>
        <Text style={styles.customReportTitle}>Custom Report</Text>
        <Text style={styles.customReportText}>
          Need a specific report? Create a custom report with the parameters you need.
        </Text>
        <TouchableOpacity style={styles.customReportButton}>
          <Text style={styles.customReportButtonText}>Create Custom Report</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Logs component for Admin
const Logs = () => {
  const systemLogs = [
    { id: 1, type: 'Login', user: 'admin@asguard.com', action: 'System login', timestamp: '2023-07-15 09:23:45', status: 'Success' },
    { id: 2, type: 'User', user: 'admin@asguard.com', action: 'Created user account', timestamp: '2023-07-15 09:30:12', status: 'Success' },
    { id: 3, type: 'Settings', user: 'admin@asguard.com', action: 'Updated system settings', timestamp: '2023-07-15 10:15:33', status: 'Success' },
    { id: 4, type: 'Security', user: 'john@example.com', action: 'Failed login attempt', timestamp: '2023-07-15 11:42:18', status: 'Failure' },
    { id: 5, type: 'Data', user: 'sarah@example.com', action: 'Exported farm data', timestamp: '2023-07-15 13:05:42', status: 'Success' },
  ];

  return (
    <View style={styles.adminSection}>
      <Text style={styles.adminSectionTitle}>System Logs</Text>
      <Text style={styles.instructionText}>
        View and analyze system activity logs for monitoring and troubleshooting.
      </Text>

      <View style={styles.logsFilterContainer}>
        <TouchableOpacity style={styles.logFilterButton}>
          <Text style={styles.logFilterButtonText}>All Logs</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logFilterButton}>
          <Text style={styles.logFilterButtonText}>Security</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logFilterButton}>
          <Text style={styles.logFilterButtonText}>User Activity</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logFilterButton}>
          <Text style={styles.logFilterButtonText}>System</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderCell, { flex: 0.5 }]}>ID</Text>
          <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Type</Text>
          <Text style={[styles.tableHeaderCell, { flex: 1.5 }]}>Action</Text>
          <Text style={[styles.tableHeaderCell, { flex: 1.5 }]}>Timestamp</Text>
          <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Status</Text>
        </View>

        <ScrollView style={styles.tableBody}>
          {systemLogs.map((log) => (
            <View key={log.id} style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 0.5 }]}>{log.id}</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>{log.type}</Text>
              <Text style={[styles.tableCell, { flex: 1.5 }]}>{log.action}</Text>
              <Text style={[styles.tableCell, { flex: 1.5 }]}>{log.timestamp}</Text>
              <Text 
                style={[
                  styles.tableCell, 
                  { flex: 1 },
                  log.status === 'Success' ? styles.successText : styles.failureText
                ]}
              >
                {log.status}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={styles.logsActions}>
        <TouchableOpacity style={styles.logsButton}>
          <Text style={styles.logsButtonText}>Export Logs</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logsButton}>
          <Text style={styles.logsButtonText}>Clear Logs</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function FarmerDashboard() {
  const { logout, user } = useAuth();
  const [activeTab, setActiveTab] = useState('FarmData');
  const { width, height } = useWindowDimensions();
  const [showAdminInfo, setShowAdminInfo] = useState(false);
  const [selectedAdminCard, setSelectedAdminCard] = useState<string | null>(null);
  const [showCreateAccountModal, setShowCreateAccountModal] = useState(false);
  const [showSystemSettingsModal, setShowSystemSettingsModal] = useState(false);
  
  // Determine if device is in landscape mode or desktop/web
  const isWideScreen = width > height || width > 768;
  
  // Check if user is admin
  const isAdmin = isSystemAdmin(user);

  const handleLogout = () => {
    if (activeTab === 'Logout') {
      logout();
    }
  };
  
  const handleTab = (tab: string) => {
    setActiveTab(tab);
    setSelectedAdminCard(null);
    if (tab === 'Logout') {
      handleLogout();
    }
  };

  useEffect(() => {
    if (activeTab === 'Logout') {
      handleLogout();
    }
  }, [activeTab]);
  
  // Show admin access instructions
  useEffect(() => {
    if (!isAdmin && showAdminInfo) {
      Alert.alert(
        "Admin Access Instructions",
        "To access the admin features, your account must be assigned the ADMIN role. Please contact your system administrator to update your role privileges.",
        [{ text: "OK", onPress: () => setShowAdminInfo(false) }]
      );
    }
  }, [showAdminInfo, isAdmin]);
  
  // Handle admin card selection
  const handleAdminCardPress = (cardTitle: string) => {
    setSelectedAdminCard(cardTitle);
    
    // Open system settings modal for System Settings card
    if (cardTitle === "System Settings") {
      setShowSystemSettingsModal(true);
    }
  };
  
  // Render selected admin section
  const renderAdminSection = () => {
    switch(selectedAdminCard) {
      case 'User Management':
        return <UserManagement onCreateAccount={() => setShowCreateAccountModal(true)} />;
      case 'System Settings':
        return (
          <View style={styles.adminSection}>
            <Text style={styles.adminSectionTitle}>
              System Settings
            </Text>
            <Text style={styles.instructionText}>
              As an admin, you have full control over all system settings. You can configure the system, manage permissions, and control all aspects of the application.
            </Text>
            <TouchableOpacity 
              style={styles.settingsButton} 
              onPress={() => setShowSystemSettingsModal(true)}
            >
              <Text style={styles.settingsButtonText}>Open System Settings</Text>
            </TouchableOpacity>
          </View>
        );
      case 'Analytics':
        return <Analytics />;
      case 'Approvals':
        return <Approvals />;
      case 'Reports':
        return <Reports />;
      case 'Logs':
        return <Logs />;
      default:
        return (
          <View style={styles.adminSection}>
            <Text style={styles.adminSectionTitle}>
              {selectedAdminCard || 'Select a card to manage'}
            </Text>
            <Text style={styles.instructionText}>
              As an administrator, you have full access to all system features and controls. 
              Please select a specific management card to access its features.
            </Text>
          </View>
        );
    }
  };

  // Render the appropriate section based on active tab
  const renderContent = () => {
    switch(activeTab) {
      case 'Admin':
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.farmDataTitle}>ADMIN CONTROLS</Text>
            <Text style={styles.adminPowerNote}>Full System Administrator Access Enabled</Text>
            
            {selectedAdminCard ? (
              renderAdminSection()
            ) : (
              <View style={styles.cardsContainer}>
                <DashboardCard 
                  title="User Management" 
                  icon="👥" 
                  onPress={() => handleAdminCardPress("User Management")} 
                  adminOnly={true} 
                />
                <DashboardCard 
                  title="System Settings" 
                  icon="⚙️" 
                  onPress={() => handleAdminCardPress("System Settings")} 
                  adminOnly={true} 
                />
                <DashboardCard 
                  title="Analytics" 
                  icon="📊" 
                  onPress={() => handleAdminCardPress("Analytics")} 
                  adminOnly={true} 
                />
                <DashboardCard 
                  title="Approvals" 
                  icon="✅" 
                  onPress={() => handleAdminCardPress("Approvals")} 
                  adminOnly={true} 
                />
                <DashboardCard 
                  title="Reports" 
                  icon="📝" 
                  onPress={() => handleAdminCardPress("Reports")} 
                  adminOnly={true} 
                />
                <DashboardCard 
                  title="Logs" 
                  icon="🔍" 
                  onPress={() => handleAdminCardPress("Logs")} 
                  adminOnly={true} 
                />
              </View>
            )}
          </View>
        );
      case 'FarmData':
      default:
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.farmDataTitle}>FARMDATA</Text>
            <View style={styles.cardsContainer}>
              <DashboardCard title="Crops" icon="🌱" onPress={() => {}} />
              <DashboardCard title="Livestock" icon="🐄" onPress={() => {}} />
              <DashboardCard title="Soil/Weather" icon="🌡️" onPress={() => {}} />
              <DashboardCard title="Irrigation" icon="💧" onPress={() => {}} />
              <DashboardCard title="Machinery" icon="🚜" onPress={() => {}} />
              <DashboardCard title="Pests" icon="🐛" onPress={() => {}} />
              {isAdmin ? (
                <DashboardCard 
                  title="Admin Quick Access" 
                  icon="🔑" 
                  onPress={() => handleTab('Admin')} 
                  adminOnly={true} 
                />
              ) : (
                <DashboardCard 
                  title="Admin Access" 
                  icon="🔒" 
                  onPress={() => setShowAdminInfo(true)} 
                  adminOnly={true} 
                />
              )}
            </View>
          </View>
        );
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <ImageBackground
        source={require('@/assets/images/bird-bg.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.contentWrapper}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Hello and Welcome</Text>
            <Text style={styles.headerName}>{user?.name || 'User'}</Text>
            {isAdmin && <Text style={styles.adminLabel}>System Administrator (Full Access)</Text>}
          </View>

          <TabNav activeTab={activeTab} setActiveTab={handleTab} />

          <ScrollView contentContainerStyle={styles.scrollContent}>
            {renderContent()}
          </ScrollView>
        </View>
      </ImageBackground>

      {!isWideScreen && <BottomNav />}
      
      <CreateAccountModal 
        visible={showCreateAccountModal} 
        onClose={() => setShowCreateAccountModal(false)} 
      />
      
      <SystemSettingsModal
        visible={showSystemSettingsModal}
        onClose={() => setShowSystemSettingsModal(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  contentWrapper: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 10 : 10,
    paddingHorizontal: 20,
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  headerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  adminLabel: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#d32f2f',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    textShadowColor: 'rgba(255, 255, 255, 0.6)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(173, 216, 230, 0.7)',
    paddingVertical: 8,
    paddingHorizontal: 15,
    justifyContent: 'space-between',
    borderRadius: 25,
    marginBottom: 20,
  },
  tab: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: '#1976D2',
  },
  tabText: {
    color: '#444',
    fontWeight: '500',
    fontSize: 14,
  },
  activeTabText: {
    color: 'white',
  },
  scrollContent: {
    flexGrow: 1,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  farmDataTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  adminPowerNote: {
    fontSize: 16,
    color: '#d32f2f',
    marginBottom: 25,
    fontWeight: '500',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
    width: '100%',
  },
  card: {
    width: 180,
    height: 180,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    margin: 10,
    position: 'relative',
  },
  adminCard: {
    backgroundColor: 'rgba(253, 236, 234, 0.95)',
    borderWidth: 1,
    borderColor: '#d32f2f',
  },
  cardIconContainer: {
    width: 80,
    height: 80,
    backgroundColor: 'rgba(248, 248, 248, 0.9)',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  adminCardIcon: {
    backgroundColor: 'rgba(254, 243, 242, 0.9)',
  },
  cardIcon: {
    fontSize: 36,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
  adminBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#d32f2f',
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    height: 60,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  bottomNavItem: {
    alignItems: 'center',
    flex: 1,
  },
  bottomNavIcon: {
    fontSize: 20,
    color: 'white',
  },
  bottomNavText: {
    fontSize: 12,
    color: 'white',
    marginTop: 2,
  },
  // Admin section styles
  adminSection: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 20,
    marginVertical: 10,
  },
  adminSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  adminSectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  userListContainer: {
    padding: 10,
  },
  instructionText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
    lineHeight: 24,
  },
  userCreateInstructions: {
    backgroundColor: 'rgba(232, 245, 233, 0.8)',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2E7D32',
  },
  stepText: {
    fontSize: 15,
    marginLeft: 10,
    marginBottom: 8,
    color: '#333',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 25,
    width: '90%',
    maxWidth: 500,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  roleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  roleButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    minWidth: '22%',
    marginVertical: 5,
    alignItems: 'center',
  },
  roleButtonActive: {
    backgroundColor: '#1976D2',
    borderColor: '#1976D2',
  },
  roleButtonText: {
    fontSize: 12,
    color: '#333',
  },
  roleButtonTextActive: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: '500',
  },
  createButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  createButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  // System settings styles
  settingsButton: {
    backgroundColor: '#1976D2',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  settingsButtonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 16,
  },
  settingsSection: {
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
  },
  settingSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingLabel: {
    fontSize: 16,
    color: '#555',
  },
  settingValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#d32f2f',
  },
  closeButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  // Analytics styles
  chartContainer: {
    marginVertical: 15,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    padding: 15,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  chart: {
    borderRadius: 10,
  },
  analyticsActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  analyticsButton: {
    backgroundColor: '#1976D2',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  analyticsButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  
  // Table styles for Approvals and Logs
  tableContainer: {
    marginVertical: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#1976D2',
    padding: 10,
  },
  tableHeaderCell: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  tableBody: {
    maxHeight: 300,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    padding: 10,
  },
  tableCell: {
    fontSize: 14,
    color: '#333',
  },
  tableCellActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginHorizontal: 2,
  },
  approveButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#F44336',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  
  // Approvals specific styles
  approvalsSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
  },
  approvalsSummaryText: {
    fontSize: 16,
    color: '#d32f2f',
    fontWeight: '500',
  },
  refreshButton: {
    backgroundColor: '#1976D2',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  refreshButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  
  // Reports styles
  reportsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  reportCard: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  reportName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  reportFormat: {
    fontSize: 14,
    color: '#fff',
    backgroundColor: '#1976D2',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  reportDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  reportActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  reportButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  reportButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  customReportSection: {
    backgroundColor: 'rgba(232, 245, 233, 0.8)',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  customReportTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 8,
  },
  customReportText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 15,
  },
  customReportButton: {
    backgroundColor: '#2E7D32',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  customReportButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  
  // Logs specific styles
  logsFilterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginVertical: 15,
  },
  logFilterButton: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    margin: 5,
  },
  logFilterButtonText: {
    color: '#333',
    fontSize: 14,
  },
  successText: {
    color: '#4CAF50',
    fontWeight: '500',
  },
  failureText: {
    color: '#F44336',
    fontWeight: '500',
  },
  logsActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  logsButton: {
    backgroundColor: '#1976D2',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  logsButtonText: {
    color: 'white',
    fontWeight: '500',
  },
});

