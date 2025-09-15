// screens/SubscriptionScreen.js
import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API = 'http://10.205.61.40/ott_app/AppApi';
const ACCENT = '#f57c00';
const SECONDARY = '#ff9800';
const SUCCESS = '#4CAF50';
const { width } = Dimensions.get('window');

// Sample subscription plans
const SUBSCRIPTION_PLANS = [
  { plan_id: 1, plan_type: 'Weekly', price: 99.00, duration: '7 days', popular: false },
  { plan_id: 2, plan_type: 'Monthly', price: 299.00, duration: '30 days', popular: true },
  { plan_id: 3, plan_type: 'Quarterly', price: 799.00, duration: '90 days', popular: false },
  { plan_id: 4, plan_type: 'Yearly', price: 2499.00, duration: '365 days', popular: false },
];

export default function SubscriptionScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = route.params || {};
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [subscribing, setSubscribing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = await AsyncStorage.getItem('user_id');
      if (userId) {
        const res = await fetch(`${API}/get_user.php?user_id=${userId}`);
        const data = await res.json();
        setUser(data);
      }
      setLoading(false);
    };
    fetchUserData();
  }, []);

  const handleSubscription = async () => {
    if (!selectedPlan) {
      Alert.alert('Error', 'Please select a subscription plan');
      return;
    }

    setSubscribing(true);
    try {
      const currentDate = new Date();
      let endDate = new Date(currentDate);
      let isUpgrade = false;

      const currentEndDate = user?.subscription_end_date ? new Date(user.subscription_end_date) : null;
      let remainingDays = 0;
      if (currentEndDate && currentEndDate > currentDate) {
        remainingDays = Math.ceil((currentEndDate - currentDate) / (1000 * 60 * 60 * 24));
        isUpgrade = true;
      }

      switch (selectedPlan.plan_type) {
        case 'Weekly':
          endDate.setDate(currentDate.getDate() + 7 + Math.max(0, remainingDays - 7));
          break;
        case 'Monthly':
          endDate.setMonth(currentDate.getMonth() + 1);
          if (remainingDays > 30) endDate.setDate(endDate.getDate() + (remainingDays - 30));
          break;
        case 'Quarterly':
          endDate.setMonth(currentDate.getMonth() + 3);
          if (remainingDays > 90) endDate.setDate(endDate.getDate() + (remainingDays - 90));
          break;
        case 'Yearly':
          endDate.setFullYear(currentDate.getFullYear() + 1);
          if (remainingDays > 365) endDate.setDate(endDate.getDate() + (remainingDays - 365));
          break;
      }

      const subscriptionData = {
        user_id: user.user_id,
        plan_id: selectedPlan.plan_id,
        plan_type: selectedPlan.plan_type,
        price: selectedPlan.price,
        subscription_status: 'paid',
        subscription_end_date: endDate.toISOString().split('T')[0],
        created_at: currentDate.toISOString().split('T')[0],
        is_upgrade: isUpgrade ? 1 : 0,
      };

      const res = await fetch(`${API}/subscribe_user.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscriptionData),
      });

      const result = await res.json();
      if (result.status === 'success') {
        await AsyncStorage.setItem('subscription_status', 'active');
        navigation.goBack();
        Alert.alert(
          'Success',
          `You have successfully ${isUpgrade ? 'upgraded to' : 'subscribed to'} ${selectedPlan.plan_type} plan for ₹${selectedPlan.price}`,
          [{ text: 'OK', style: 'default' }]
        );
      } else {
        Alert.alert('Error', result.error || 'Subscription failed');
      }
    } catch (error) {
      Alert.alert('Network Error', error.message);
    } finally {
      setSubscribing(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={ACCENT} />
      </SafeAreaView>
    );
  }

  const currentPlanIndex = user?.plan_type ? SUBSCRIPTION_PLANS.findIndex(p => p.plan_type === user.plan_type) : -1;
  const upgradePlans = currentPlanIndex >= 0 && currentPlanIndex < 3
    ? SUBSCRIPTION_PLANS.slice(currentPlanIndex + 1)
    : SUBSCRIPTION_PLANS;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Choose Your Plan</Text>
        <Text style={styles.description}>
          Unlock premium features and enjoy unlimited access to all content
        </Text>
        {upgradePlans.map((plan) => (
          <TouchableOpacity
            key={plan.plan_id}
            style={[
              styles.planCard,
              selectedPlan?.plan_id === plan.plan_id && styles.selectedPlan,
              plan.popular && styles.popularPlan,
            ]}
            onPress={() => setSelectedPlan(plan)}
          >
            {plan.popular && (
              <View style={styles.popularBadge}>
                <Text style={styles.popularText}>POPULAR</Text>
              </View>
            )}
            <View style={styles.planHeader}>
              <View>
                <Text style={styles.planType}>{plan.plan_type}</Text>
                <Text style={styles.planDescription}>{plan.description}</Text>
              </View>
              <View style={styles.planPriceContainer}>
                <Text style={styles.planPrice}>₹{plan.price}</Text>
                <Text style={styles.planDuration}>/{plan.duration}</Text>
              </View>
            </View>
            <View style={styles.planFeatures}>
              <Text style={styles.featureText}>Unlimited streaming</Text>
              <Text style={styles.featureText}>HD Quality</Text>
              <Text style={styles.featureText}>Download for offline</Text>
              <Text style={styles.featureText}>Ad-free experience</Text>
            </View>
            {selectedPlan?.plan_id === plan.plan_id && (
              <View style={styles.selectedIndicator}>
                <Icon name="checkmark-circle" size={20} color={ACCENT} />
              </View>
            )}
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={[styles.subscribeButton, !selectedPlan && styles.disabledButton]}
          onPress={handleSubscription}
          disabled={!selectedPlan || subscribing}
        >
          {subscribing ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.subscribeText}>
              {selectedPlan ? `Subscribe to ${selectedPlan.plan_type} - ₹${selectedPlan.price}` : 'Select a Plan'}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  scroll: { padding: width * 0.05, paddingBottom: 100 },
  title: { color: '#fff', fontSize: width * 0.06, fontWeight: '700', textAlign: 'center', marginVertical: 20 },
  description: { color: '#aaa', fontSize: width * 0.04, textAlign: 'center', marginBottom: 20 },
  planCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#2a2a2a',
    position: 'relative',
  },
  selectedPlan: { borderColor: ACCENT, backgroundColor: '#1f1f1f' },
  popularPlan: { borderColor: '#e91e63' },
  popularBadge: {
    position: 'absolute',
    top: -8,
    right: 20,
    backgroundColor: '#e91e63',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
  },
  popularText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  planHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  planType: { color: '#fff', fontSize: width * 0.05, fontWeight: '800' },
  planDescription: { color: '#aaa', fontSize: width * 0.035 },
  planPriceContainer: { alignItems: 'flex-end' },
  planPrice: { color: ACCENT, fontSize: width * 0.06, fontWeight: '800' },
  planDuration: { color: '#aaa', fontSize: width * 0.03 },
  planFeatures: { marginTop: 10 },
  featureText: { color: '#fff', fontSize: width * 0.035, marginBottom: 8 },
  selectedIndicator: { position: 'absolute', top: 15, right: 15 },
  subscribeButton: {
    backgroundColor: ACCENT,
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: ACCENT,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  disabledButton: { backgroundColor: '#555', shadowColor: '#555' },
  subscribeText: { color: '#fff', fontSize: width * 0.045, fontWeight: '700' },
});