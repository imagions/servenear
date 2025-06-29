import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { COLORS, SHADOWS, RADIUS } from '@/constants/theme';
import {
  ArrowLeft,
  Trash2,
  Calendar,
  Clock,
  Edit2,
  BadgeCheck,
  ShoppingCart,
} from 'lucide-react-native';
import { useCartStore } from '@/store/useCartStore';
import { CartItem } from '@/types';

export default function CartScreen() {
  const { items: cart, removeFromCart, clearCart } = useCartStore();

  const handleRemoveItem = (id: string) => {
    removeFromCart(id);
  };

  const handleCheckout = () => {
    router.push('/payment');
  };

  // Helper: show scheduled slot if present
  const renderSlot = (item: CartItem) => {
    if (item.date && item.time && item.priceType) {
      return (
        <View style={styles.scheduledSlotRow}>
          <TouchableOpacity
            onPress={() => router.push(`/schedule?serviceId=${item.id}`)}
          >
            <View style={styles.scheduledSlotBox}>
              <Calendar size={18} color={COLORS.accent} />
              <Text style={styles.scheduledSlotText}>
                {item.date}, {item.time}
              </Text>
              <Edit2 size={16} color={COLORS.accent} />
            </View>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <TouchableOpacity
        style={styles.selectSlotButton}
        onPress={() => router.push(`/schedule?serviceId=${item.id}`)}
      >
        <Clock size={18} color={COLORS.accent} style={{ marginRight: 6 }} />
        <Text style={styles.selectSlotButtonText}>Select Time Slot</Text>
      </TouchableOpacity>
    );
  };

  const renderCartItem = ({ item }: { item: CartItem }) => {
    // Always show the price according to the selected priceType (if scheduled)
    let displayPrice = item.price;
    let priceUnit = '';
    if (item.priceType === 'hourly') {
      displayPrice = item.hourlyPrice ?? item.price;
      priceUnit = '/hr';
    } else if (item.priceType === 'once') {
      displayPrice = item.oncePrice ?? item.price;
      priceUnit = '';
    }

    return (
      <View style={styles.cartItem}>
        <View
          style={{ flexDirection: 'row', alignItems: 'flex-start', flex: 1 }}
        >
          <View style={styles.avatarCol}>
            {item.image ? (
              <View style={styles.avatarCircle}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.serviceImage}
                  resizeMode="cover"
                />
              </View>
            ) : (
              <View
                style={{
                  paddingHorizontal: 12,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: COLORS.accent, fontSize: 24 }}>?</Text>
              </View>
            )}
          </View>
          <View style={styles.cartInfoCol}>
            <View style={styles.cartInfoHeader}>
              <Text style={styles.serviceTitle}>{item.title}</Text>
            </View>
            <View style={styles.providerRow}>
              <Text style={styles.serviceProvider}>{item.provider}</Text>
              <BadgeCheck
                size={18}
                color={COLORS.surface}
                fill={COLORS.accent}
              />
            </View>
            <Text style={styles.providerNote}>
              Provider will confirm time slot
            </Text>
          </View>
          <View style={{ flexDirection: 'column', alignItems: 'center' }}>
            <Text style={styles.servicePrice}>
              ₹{displayPrice}
              <Text style={styles.priceUnit}>{priceUnit}</Text>
            </Text>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => handleRemoveItem(item.id)}
            >
              <Trash2 size={22} color="#F44336" />
            </TouchableOpacity>
          </View>
        </View>
        {renderSlot(item)}
      </View>
    );
  };

  const calculateTotal = () => {
    return cart.reduce(
      (sum, item) => sum + item.price * (item.quantity || 1),
      0
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={COLORS.text.heading} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cart</Text>
        <View style={{ width: 40 }} />
      </View>

      {cart.length > 0 ? (
        <>
          <FlatList
            data={cart}
            renderItem={renderCartItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.cartList}
            showsVerticalScrollIndicator={false}
          />

          <View style={styles.footerBar}>
            <View style={styles.footerAmountCol}>
              <Text style={styles.footerLabel}>Total Amount</Text>
              <Text style={styles.footerAmount}>
                ₹{calculateTotal().toFixed(1)}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.footerCheckoutBtn}
              onPress={handleCheckout}
            >
              <Text style={styles.footerCheckoutBtnText}>
                Proceed to Checkout
              </Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <ShoppingCart size={80} color={COLORS.accent} />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptyMessage}>
            Looks like you haven't added any services to your cart yet.
          </Text>
          <TouchableOpacity
            style={styles.browseButton}
            onPress={() => router.push('/explore')}
          >
            <Text style={styles.browseButtonText}>Browse Services</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 36,
    paddingBottom: 18,
    paddingHorizontal: 18,
    backgroundColor: '#F7FAFC',
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    ...SHADOWS.card,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text.heading,
    fontFamily: 'Inter-Bold',
    flex: 1,
    textAlign: 'center',
  },
  cartList: {
    paddingHorizontal: 10,
    paddingBottom: 120,
  },
  cartItem: {
    alignItems: 'flex-start',
    backgroundColor: 'white',
    borderRadius: 18,
    marginBottom: 18,
    padding: 16,
    ...SHADOWS.card,
    borderWidth: 1,
    borderColor: '#E6F1F8',
    minHeight: 110,
  },
  avatarCol: {
    marginRight: 12,
    marginTop: 2,
  },
  avatarCircle: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: COLORS.accent + '15',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',

    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  serviceImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  cartInfoCol: {
    flex: 1,
    minHeight: 80,
  },
  cartInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text.heading,
    fontFamily: 'Inter-Bold',
    flex: 1,
    marginRight: 8,
  },
  servicePrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.accent,
    fontFamily: 'Inter-Bold',
    marginLeft: 8,
  },
  priceUnit: {
    fontSize: 13,
    color: COLORS.accent,
    fontFamily: 'Inter-Medium',
  },
  providerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
    gap: 2,
  },
  serviceProvider: {
    fontSize: 14,
    color: COLORS.text.body,
    fontFamily: 'Inter-Medium',
  },
  providerNote: {
    fontSize: 13,
    color: '#A0A0A0',
    fontFamily: 'Inter-Regular',
    marginBottom: 6,
  },
  scheduledSlotRow: {
    marginTop: 15,
    marginBottom: 2,
    alignSelf: 'center',
  },
  scheduledSlotBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F8FB',
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 14,
    alignSelf: 'flex-start',
    marginTop: 2,
    marginBottom: 2,
    gap: 6,
  },
  scheduledSlotText: {
    fontSize: 15,
    color: COLORS.accent,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 4,
    marginRight: 4,
  },
  scheduledSlotPriceType: {
    fontSize: 14,
    color: COLORS.text.body,
    fontFamily: 'Inter-Medium',
    marginLeft: 8,
    marginRight: 4,
  },
  selectSlotButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: COLORS.accent,
    borderRadius: 22,
    paddingVertical: 8,
    paddingHorizontal: 22,
    marginTop: 10,
    marginBottom: 2,
    backgroundColor: 'white',
    gap: 4,
  },
  selectSlotButtonText: {
    color: COLORS.accent,
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'Inter-SemiBold',
    letterSpacing: 0.2,
  },
  removeButton: {
    width: 38,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FDECEC',
    borderRadius: 19,
    marginLeft: 8,
    marginTop: 20,
  },
  footerBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#E6F8FB',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 18,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    ...SHADOWS.card,
    gap: 12,
  },
  footerAmountCol: {
    flex: 1,
  },
  footerLabel: {
    fontSize: 15,
    color: COLORS.text.body,
    fontFamily: 'Inter-Regular',
    marginBottom: 2,
  },
  footerAmount: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.accent,
    fontFamily: 'Inter-Bold',
  },
  footerCheckoutBtn: {
    backgroundColor: 'white',
    borderRadius: 22,
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderWidth: 1,
    borderColor: COLORS.accent,
    ...SHADOWS.card,
  },
  footerCheckoutBtnText: {
    color: COLORS.accent,
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Inter-SemiBold',
    letterSpacing: 0.2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text.heading,
    marginTop: 20,
    marginBottom: 12,
    fontFamily: 'Inter-Bold',
  },
  emptyMessage: {
    fontSize: 16,
    color: COLORS.text.body,
    textAlign: 'center',
    marginBottom: 32,
    fontFamily: 'Inter-Regular',
  },
  browseButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  browseButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    fontFamily: 'Inter-SemiBold',
  },
});
