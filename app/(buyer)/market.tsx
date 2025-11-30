import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  ActivityIndicator,
  ImageBackground,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: any;
  seller: {
    id: string;
    name: string;
    rating: number;
  };
  category: string;
  stock: number;
  unit: string;
}

const categories = [
  'All',
  'Vegetables',
  'Fruits',
  'Grains',
  'Dairy',
  'Livestock',
  'Poultry',
];

export const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Fresh Tomatoes',
    description: 'Fresh, locally grown organic tomatoes',
    price: 2.99,
    image: require('../../assets/images/tomatoes.png'),
    seller: {
      id: '1',
      name: 'Green Valley Farm',
      rating: 4.5,
    },
    category: 'Vegetables',
    stock: 50,
    unit: 'kg',
  },
  {
    id: '2',
    name: 'Organic Potatoes',
    description: 'Fresh, locally grown organic potatoes',
    price: 1.99,
    image: require('../../assets/images/potatoes.png'),
    seller: {
      id: '2',
      name: 'Sunny Fields',
      rating: 4.8,
    },
    category: 'Vegetables',
    stock: 100,
    unit: 'kg',
  },
  {
    id: '3',
    name: 'Fresh Apples',
    description: 'Sweet and juicy apples from local orchards',
    price: 3.99,
    image: require('../../assets/images/apples.jpeg'),
    seller: {
      id: '3',
      name: 'Fruit Paradise',
      rating: 4.6,
    },
    category: 'Fruits',
    stock: 75,
    unit: 'kg',
  },
  {
    id: '4',
    name: 'Organic Bananas',
    description: 'Naturally ripened organic bananas',
    price: 2.49,
    image: require('../../assets/images/banana.jpeg'),
    seller: {
      id: '4',
      name: 'Tropical Delights',
      rating: 4.4,
    },
    category: 'Fruits',
    stock: 120,
    unit: 'kg',
  },
  {
    id: '5',
    name: 'Premium Wheat',
    description: 'High-quality wheat grain',
    price: 4.99,
    image: require('../../assets/images/wheat.png'),
    seller: {
      id: '5',
      name: 'Golden Harvest',
      rating: 4.7,
    },
    category: 'Grains',
    stock: 500,
    unit: 'kg',
  },
  {
    id: '6',
    name: 'Organic Maize',
    description: 'Fresh organic maize',
    price: 3.49,
    image: require('../../assets/images/maize.jpg'),
    seller: {
      id: '6',
      name: 'Corn Fields',
      rating: 4.5,
    },
    category: 'Grains',
    stock: 300,
    unit: 'kg',
  },
  {
    id: '7',
    name: 'Fresh Milk',
    description: 'Pure, fresh cow milk',
    price: 2.99,
    image: require('../../assets/images/milk.jpg'),
    seller: {
      id: '7',
      name: 'Dairy Delights',
      rating: 4.8,
    },
    category: 'Dairy',
    stock: 200,
    unit: 'liter',
  },
  {
    id: '8',
    name: 'Farm Cheese',
    description: 'Artisanal farm cheese',
    price: 5.99,
    image: require('../../assets/images/cheese.jpeg'),
    seller: {
      id: '8',
      name: 'Cheese Masters',
      rating: 4.6,
    },
    category: 'Dairy',
    stock: 50,
    unit: 'kg',
  },
  {
    id: '9',
    name: 'Beef Cuts',
    description: 'Premium quality beef cuts',
    price: 12.99,
    image: require('../../assets/images/beef.jpeg'),
    seller: {
      id: '9',
      name: 'Quality Meats',
      rating: 4.7,
    },
    category: 'Livestock',
    stock: 100,
    unit: 'kg',
  },
  {
    id: '10',
    name: 'Lamb Meat',
    description: 'Fresh lamb meat',
    price: 15.99,
    image: require('../../assets/images/lamb.jpg'),
    seller: {
      id: '10',
      name: 'Shepherd\'s Choice',
      rating: 4.5,
    },
    category: 'Livestock',
    stock: 80,
    unit: 'kg',
  },
  {
    id: '11',
    name: 'Fresh Eggs',
    description: 'Farm-fresh chicken eggs',
    price: 1.99,
    image: require('../../assets/images/eggs.jpeg'),
    seller: {
      id: '11',
      name: 'Happy Hens',
      rating: 4.6,
    },
    category: 'Poultry',
    stock: 500,
    unit: 'dozen',
  },
  {
    id: '12',
    name: 'Whole Chicken',
    description: 'Free-range whole chicken',
    price: 8.99,
    image: require('../../assets/images/whole-chicken.jpg'),
    seller: {
      id: '12',
      name: 'Poultry Paradise',
      rating: 4.4,
    },
    category: 'Poultry',
    stock: 50,
    unit: 'piece',
  }
];

export default function BuyerMarketScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { addToCart, getTotalItems } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addToCartModalVisible, setAddToCartModalVisible] = useState(false);

  const handleAddToCart = (product: Product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setAddToCartModalVisible(true);
  };

  const confirmAddToCart = () => {
    if (selectedProduct) {
      addToCart({
        id: selectedProduct.id,
        name: selectedProduct.name,
        image: selectedProduct.image,
        price: selectedProduct.price,
        unit: selectedProduct.unit,
      }, quantity);
      
      Alert.alert(
        'Added to Cart',
        `${quantity} ${quantity === 1 ? 'unit' : 'units'} of ${selectedProduct.name} added to cart`,
        [
          {
            text: 'Continue Shopping',
            style: 'cancel',
            onPress: () => {
              setAddToCartModalVisible(false);
              setSelectedProduct(null);
              setQuantity(1);
            }
          },
          {
            text: 'View Cart',
            onPress: () => {
              setAddToCartModalVisible(false);
              setSelectedProduct(null);
              setQuantity(1);
              router.push('/(buyer)/cart');
            }
          }
        ]
      );
    }
  };

  const filteredProducts = sampleProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderProductCard = ({ item }: { item: Product }) => (
    <TouchableOpacity 
      style={styles.productCard}
      onPress={() => router.push({
        pathname: '/(buyer)/product/[id]',
        params: { id: item.id }
      })}
    >
      <Image 
        source={item.image} 
        style={styles.productImage}
        resizeMode="cover"
      />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.sellerInfo}>
          <Ionicons name="business-outline" size={16} color="#666" />
          <Text style={styles.sellerName}>{item.seller.name}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.rating}>{item.seller.rating}</Text>
          </View>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>BWP {item.price.toFixed(2)}</Text>
          <Text style={styles.unit}>/{item.unit}</Text>
        </View>
        <TouchableOpacity 
          style={styles.addToCartButton}
          onPress={() => handleAddToCart(item)}
        >
          <Ionicons name="cart-outline" size={20} color="#fff" />
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderCategoryItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        selectedCategory === item && styles.selectedCategory,
      ]}
      onPress={() => setSelectedCategory(item)}
    >
      <Text
        style={[
          styles.categoryText,
          selectedCategory === item && styles.selectedCategoryText,
        ]}
      >
        {item}
      </Text>
    </TouchableOpacity>
  );

  if (isLoading || !user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text>Loading market...</Text>
      </View>
    );
  }

  return (
    <ImageBackground 
      source={require('../../assets/images/login-bg.jpg')}
      style={styles.backgroundImage}
    >
      <View style={styles.overlay}>
        <View style={styles.header}>
          <Text style={styles.title}>Market</Text>
          <TouchableOpacity 
            style={styles.cartButton}
            onPress={() => router.push('/(buyer)/cart')}
          >
            <Ionicons name="cart-outline" size={24} color="#4CAF50" />
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{getTotalItems()}</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity 
              style={styles.clearButton}
              onPress={() => setSearchQuery('')}
            >
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.categoriesContainer}>
          <FlatList
            data={categories}
            renderItem={renderCategoryItem}
            keyExtractor={item => item}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

        <FlatList
          data={filteredProducts}
          renderItem={renderProductCard}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.productsList}
          showsVerticalScrollIndicator={false}
        />

        {/* Add to Cart Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={addToCartModalVisible}
          onRequestClose={() => setAddToCartModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Add to Cart</Text>
                <TouchableOpacity 
                  onPress={() => setAddToCartModalVisible(false)}
                  style={styles.closeButton}
                >
                  <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>

              {selectedProduct && (
                <View style={styles.modalBody}>
                  <Image 
                    source={selectedProduct.image} 
                    style={styles.modalProductImage}
                  />
                  <Text style={styles.modalProductName}>{selectedProduct.name}</Text>
                  <Text style={styles.modalProductPrice}>
                    BWP {selectedProduct.price.toFixed(2)}/{selectedProduct.unit}
                  </Text>

                  <View style={styles.quantitySelector}>
                    <TouchableOpacity 
                      style={styles.quantityButton}
                      onPress={() => setQuantity(q => Math.max(1, q - 1))}
                    >
                      <Ionicons name="remove" size={24} color="#4CAF50" />
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{quantity}</Text>
                    <TouchableOpacity 
                      style={styles.quantityButton}
                      onPress={() => setQuantity(q => q + 1)}
                    >
                      <Ionicons name="add" size={24} color="#4CAF50" />
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.totalText}>
                    Total: BWP {(selectedProduct.price * quantity).toFixed(2)}
                  </Text>

                  <TouchableOpacity 
                    style={styles.confirmButton}
                    onPress={confirmAddToCart}
                  >
                    <Text style={styles.confirmButtonText}>Add to Cart</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  cartButton: {
    position: 'relative',
    padding: 8,
  },
  cartBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#F44336',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  clearButton: {
    padding: 4,
  },
  categoriesContainer: {
    marginBottom: 16,
  },
  categoriesList: {
    paddingHorizontal: 16,
  },
  categoryItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  selectedCategory: {
    backgroundColor: '#4CAF50',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
  },
  selectedCategoryText: {
    color: '#fff',
    fontWeight: '600',
  },
  productsList: {
    padding: 16,
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  productInfo: {
    padding: 16,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  sellerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sellerName: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
    marginRight: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  unit: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
  },
  addToCartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    alignItems: 'center',
  },
  modalProductImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginBottom: 16,
  },
  modalProductName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  modalProductPrice: {
    fontSize: 16,
    color: '#4CAF50',
    marginBottom: 20,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  quantityButton: {
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    padding: 8,
  },
  quantityText: {
    fontSize: 20,
    fontWeight: '600',
    marginHorizontal: 20,
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 16,
    width: '100%',
    alignItems: 'center',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
}); 