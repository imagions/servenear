import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, SHADOWS } from '@/constants/theme';
import {
  ArrowLeft,
  CreditCard,
  Banknote,
  Clock,
  Circle,
  CircleDot,
  Laptop,
} from 'lucide-react-native';
import { useCartStore } from '@/store/useCartStore';

export default function PaymentScreen() {
  const router = useRouter();
  const { items: cart, clearCart } = useCartStore();
  const total = cart.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );

  const [selected, setSelected] = useState<'upi' | 'netbanking' | 'paylater'>(
    'upi'
  );
  const [showSuccess, setShowSuccess] = useState(false);

  const handlePay = () => {
    setShowSuccess(true);
    // Do not clearCart here, only after user presses Done
  };

  const handleDone = () => {
    clearCart(); // <-- clear cart here, after user confirms
    setShowSuccess(false);
    router.back();
    setTimeout(() => router.back(), 200);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F7FAFC' }}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={COLORS.text.heading} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.bookingRow}>
          <CreditCard size={28} color={COLORS.text.heading} />
          <Text style={styles.bookingLabel}>Service Booking</Text>
          <Text style={styles.bookingAmount}>₹{total.toFixed(2)}</Text>
        </View>

        <View style={styles.section}>
          <TouchableOpacity
            style={styles.optionRow}
            onPress={() => setSelected('upi')}
          >
            {selected === 'upi' ? (
              <CircleDot size={22} color={COLORS.accent} />
            ) : (
              <Circle size={22} color="#B0B0B0" />
            )}
            <CreditCard
              size={22}
              color={COLORS.accent}
              style={{ marginLeft: 10 }}
            />
            <Text style={styles.optionText}>UPI / Cards / Wallets</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionRow}
            onPress={() => setSelected('netbanking')}
          >
            {selected === 'netbanking' ? (
              <CircleDot size={22} color={COLORS.accent} />
            ) : (
              <Circle size={22} color="#B0B0B0" />
            )}
            <Laptop
              size={22}
              color={COLORS.accent}
              style={{ marginLeft: 10 }}
            />
            <Text style={styles.optionText}>Netbanking</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.optionRow, { marginBottom: 0 }]}
            onPress={() => setSelected('paylater')}
          >
            {selected === 'paylater' ? (
              <CircleDot size={22} color={COLORS.accent} />
            ) : (
              <Circle size={22} color="#B0B0B0" />
            )}
            <Clock size={22} color={COLORS.accent} style={{ marginLeft: 10 }} />
            <Text style={styles.optionText}>Pay Later</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: COLORS.accent,
            borderRadius: 16,
            marginHorizontal: 20,
            marginTop: 10,
            paddingVertical: 18,
            alignItems: 'center',
            ...SHADOWS.card,
          }}
          onPress={handlePay}
        >
          <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
            Pay ₹{total.toFixed(2)}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Payment Success Modal */}
      <Modal
        visible={showSuccess}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSuccess(false)}
      >
        <View style={modalStyles.overlay}>
          <View style={modalStyles.dialog}>
            <Text style={modalStyles.title}>Payment Successful</Text>
            <Text style={modalStyles.subtitle}>
              Your booking has been confirmed!
            </Text>
            <TouchableOpacity style={modalStyles.doneBtn} onPress={handleDone}>
              <Text style={modalStyles.doneText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#F7FAFC',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.card,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text.heading,
    fontFamily: 'Inter-Bold',
    flex: 1,
    textAlign: 'center',
  },
  bookingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F8FB',
    borderRadius: 14,
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 24,
    padding: 18,
    gap: 14,
  },
  bookingLabel: {
    fontSize: 16,
    color: COLORS.text.heading,
    fontFamily: 'Inter-SemiBold',
    flex: 1,
    marginLeft: 10,
  },
  bookingAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.accent,
    fontFamily: 'Inter-Bold',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginHorizontal: 20,
    padding: 10,
    ...SHADOWS.card,
    marginBottom: 20,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2',
    marginBottom: 6,
  },
  optionText: {
    fontSize: 16,
    color: COLORS.text.heading,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 14,
  },
  payLaterBox: {
    backgroundColor: '#F7EFFF',
    borderRadius: 16,
    marginHorizontal: 20,
    marginTop: 0,
    padding: 10,
    marginBottom: 20,
  },
  payLaterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E9D8FD',
    justifyContent: 'space-between',
  },
  payLaterText: {
    fontSize: 16,
    color: COLORS.text.heading,
    fontFamily: 'Inter-SemiBold',
  },
});

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(30,30,30,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialog: {
    width: 280,
    borderRadius: 24,
    backgroundColor: 'white',
    padding: 28,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.13,
    shadowRadius: 18,
    elevation: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text.heading,
    fontFamily: 'Inter-Bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.text.body,
    fontFamily: 'Inter-Regular',
    marginBottom: 28,
    textAlign: 'center',
  },
  doneBtn: {
    alignSelf: 'center',
    marginTop: 2,
    paddingVertical: 6,
    paddingHorizontal: 18,
  },
  doneText: {
    color: COLORS.accent,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
});
