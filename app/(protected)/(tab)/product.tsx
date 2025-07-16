import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ProductListScreen = () => {
 const router = useRouter();
 const [searchQuery, setSearchQuery] = useState('');
 const [isSearchFocused, setIsSearchFocused] = useState(false);



 // Sample product data
 const products = [
  {
   id: 'PRD-1001',
   name: 'Premium Wireless Headphones',
   sku: 'SKU-789456',
   image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
   createdAt: '2023-05-15T10:30:00',
   status: 'In Stock'
  },
  {
   id: 'PRD-1002',
   name: 'Ultra HD Smart TV 55"',
   sku: 'SKU-123456',
   image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6',
   createdAt: '2023-06-20T14:45:00',
   status: 'Low Stock'
  },
  {
   id: 'PRD-1003',
   name: 'Ergonomic Office Chair',
   sku: 'SKU-654321',
   image: 'https://images.unsplash.com/photo-1517705008128-361805f42e86',
   createdAt: '2023-07-10T09:15:00',
   status: 'In Stock'
  },
  {
   id: 'PRD-1004',
   name: 'Bluetooth Portable Speaker',
   sku: 'SKU-321654',
   image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb',
   createdAt: '2023-08-05T16:20:00',
   status: 'Out of Stock'
  },
  {
   id: 'PRD-1005',
   name: 'Smartphone Pro Max 2023',
   sku: 'SKU-987654',
   image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb',
   createdAt: '2023-09-12T11:10:00',
   status: 'In Stock'
  },
 ];

 const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
   year: 'numeric',
   month: 'short',
   day: 'numeric',
   hour: '2-digit',
   minute: '2-digit'
  });
 };


 // Filter products based on search query
 const filteredProducts = products.filter(product => {
  const searchLower = searchQuery.toLowerCase();
  return (
   product.name.toLowerCase().includes(searchLower) ||
   product.sku.toLowerCase().includes(searchLower) ||
   product.id.toLowerCase().includes(searchLower)
  );
 });

 // Clear search input
 const clearSearch = () => {
  setSearchQuery('');
 };




 const renderProductItem = ({ item }) => (
  <TouchableOpacity
   style={styles.productCard}
   onPress={() => router.push(`/products/${item.id}`)}
  >
   <Image
    source={{ uri: item.image }}
    style={styles.productImage}
    resizeMode="cover"
   />
   <View style={styles.productDetails}>
    <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
    <View style={styles.metaContainer}>
     <Text style={styles.metaText}>SKU: {item.sku}</Text>
     <Text style={styles.metaText}>ID: {item.id}</Text>
    </View>
    <View style={styles.footer}>
     <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>

    </View>
   </View>
   <Feather name="chevron-right" size={20} color="#adb5bd" />
  </TouchableOpacity>
 );

 return (
  <SafeAreaView style={styles.container}>
   {/* Header */}
   <View style={styles.header}>
    <Text style={styles.headerTitle}>Product Inventory</Text>

   </View>

   {/* Search and Filter (Placeholder) */}
   <View style={[
    styles.searchContainer,
    isSearchFocused && styles.searchContainerFocused
   ]}>
    <View style={styles.searchBar}>
     <Feather
      name="search"
      size={20}
      color={isSearchFocused ? "#007AFF" : "#adb5bd"}
     />
     <TextInput
      style={styles.searchInput}
      placeholder="Search products..."
      placeholderTextColor="#adb5bd"
      value={searchQuery}
      onChangeText={setSearchQuery}
      onFocus={() => setIsSearchFocused(true)}
      onBlur={() => setIsSearchFocused(false)}
      returnKeyType="search"
      clearButtonMode="while-editing"
     />
     {searchQuery.length > 0 && (
      <TouchableOpacity onPress={clearSearch}>
       <Feather name="x" size={20} color="#adb5bd" />
      </TouchableOpacity>
     )}
    </View>
   </View>

   {/* Product List */}
   <FlatList
    data={products}
    renderItem={renderProductItem}
    keyExtractor={item => item.id}
    contentContainerStyle={styles.listContent}
    showsVerticalScrollIndicator={false}
   />
  </SafeAreaView>
 );
};

const styles = StyleSheet.create({
 container: {
  flex: 1,
  backgroundColor: '#eee',
 },
 header: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: 20,
  paddingVertical:10,
  backgroundColor: '#fff',
  borderBottomWidth: 1,
  borderBottomColor: '#e9ecef',
 },
 headerTitle: {
  fontSize: 22,
  fontWeight: '700',
  color: '#212529',
 },
 addButton: {
  backgroundColor: '#007AFF',
  width: 40,
  height: 40,
  borderRadius: 20,
  justifyContent: 'center',
  alignItems: 'center',
 },
 searchContainer: {
  flexDirection: 'row',
  padding: 15,
  backgroundColor: '#fff',
 },
 searchBar: {
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#f1f3f5',
  borderRadius: 10,
  paddingHorizontal: 15,
  paddingVertical: 10,
  marginRight: 10,
 },
 searchText: {
  marginLeft: 10,
  color: '#adb5bd',
  fontSize: 16,
 },
 searchContainerFocused: {
  borderBottomWidth: 1,
  borderBottomColor: '#007AFF',
 },
 searchInput: {
  flex: 1,
  marginLeft: 10,
  color: '#212529',
  fontSize: 16,
  paddingVertical: 8,
 },
 emptyContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  padding: 50,
 },
 emptyText: {
  marginTop: 16,
  fontSize: 16,
  color: '#6c757d',
 },
 filterButton: {
  width: 50,
  height: 50,
  justifyContent: 'center',
  alignItems: 'center',
 },
 listContent: {
  padding: 15,
 },
 productCard: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#fff',
  borderRadius: 12,
  padding: 15,
  marginBottom: 15,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.05,
  shadowRadius: 4,
  elevation: 2,
 },
 productImage: {
  width: 70,
  height: 70,
  borderRadius: 8,
  marginRight: 15,
 },
 productDetails: {
  flex: 1,
 },
 productName: {
  fontSize: 16,
  fontWeight: '600',
  color: '#212529',
  marginBottom: 5,
 },
 metaContainer: {
  flexDirection: 'row',
  marginBottom: 8,
 },
 metaText: {
  fontSize: 12,
  color: '#6c757d',
  marginRight: 15,
 },
 footer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
 },
 dateText: {
  fontSize: 12,
  color: '#adb5bd',
 },
 statusBadge: {
  paddingHorizontal: 8,
  paddingVertical: 4,
  borderRadius: 10,
 },
 statusText: {
  fontSize: 12,
  color: '#fff',
  fontWeight: '600',
 },
});

export default ProductListScreen;