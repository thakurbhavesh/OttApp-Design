import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Modal,
  TextInput,
  Alert,
  Platform,
  Dimensions,
} from "react-native";
import * as Updates from 'expo-updates';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/Ionicons";
import { Picker } from "@react-native-picker/picker";

const API = "http://10.205.61.40/ott_app/AppApi";
const ACCENT = "#f57c00";
const SECONDARY = "#ff9800";
const SUCCESS = "#4CAF50";
const { width } = Dimensions.get("window");

// Sample subscription plans ordered by price (lowest to highest)
const SUBSCRIPTION_PLANS = [
  {
    plan_id: 1,
    plan_type: "Weekly",
    price: 99.00,
    description: "Access for 7 days",
    duration: "7 days",
    popular: false
  },
  {
    plan_id: 2,
    plan_type: "Monthly",
    price: 299.00,
    description: "Access for 30 days",
    duration: "30 days",
    popular: true
  },
  {
    plan_id: 3,
    plan_type: "Quarterly",
    price: 799.00,
    description: "Access for 90 days",
    duration: "90 days",
    popular: false
  },
  {
    plan_id: 4,
    plan_type: "Yearly",
    price: 2499.00,
    description: "Access for 365 days",
    duration: "365 days",
    popular: false
  }
];

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editVisible, setEditVisible] = useState(false);
  const [subscriptionVisible, setSubscriptionVisible] = useState(false);
  const [form, setForm] = useState({});
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    (async () => {
      const storedId = await AsyncStorage.getItem("user_id");
      if (storedId) {
        fetchUser(storedId);
      } else {
        const res = await fetch(`${API}/insert_user.php`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });
        const json = await res.json();
        if (json.status === "success") {
          await AsyncStorage.setItem("user_id", String(json.user_id));
          fetchUser(json.user_id);
        } else {
          Alert.alert("Error", json.error || "Insert failed");
          setLoading(false);
        }
      }
    })();
  }, []);

  useEffect(() => {
    if (user) {
      const currentDate = new Date();
      const endDate = user.subscription_end_date ? new Date(user.subscription_end_date) : null;
      const isValid = endDate && endDate > currentDate;
      const statusToStore = (user.subscription_status === "paid" && isValid) ? "active" : "inactive";
      AsyncStorage.setItem("subscription_status", statusToStore);
    }
  }, [user]);

  const fetchUser = async (id) => {
    try {
      const res = await fetch(`${API}/get_user.php?user_id=${id}`);
      const data = await res.json();
      setUser(data);
    } catch {
      Alert.alert("Error", "Cannot load profile");
    } finally {
      setLoading(false);
    }
  };

  const formatDateForDisplay = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatDateForAPI = (dateStr) => {
    if (!dateStr) return "";
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateStr;
  };

  const saveProfile = async () => {
    try {
      const formData = { ...form };
      if (formData.dob) {
        formData.dob = formatDateForAPI(formData.dob);
      }
      const res = await fetch(`${API}/update_user.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.user_id, ...formData }),
      });
      const j = await res.json();
      if (j.status === "success") {
        setUser({ ...user, ...formData });
        setEditVisible(false);
        Alert.alert("Success", "Profile updated successfully!");
      } else {
        Alert.alert("Error", j.error || "Update failed");
      }
    } catch (e) {
      Alert.alert("Network Error", e.message);
    }
  };

  const handleSubscription = async () => {
    if (!selectedPlan) {
      Alert.alert("Error", "Please select a subscription plan");
      return;
    }
    setSubscribing(true);
    try {
      const currentDate = new Date();
      let endDate = new Date(currentDate);
      let isUpgrade = false;
      const currentEndDate = user.subscription_end_date ? new Date(user.subscription_end_date) : null;
      let remainingDays = 0;
      if (currentEndDate && currentEndDate > currentDate) {
        remainingDays = Math.ceil((currentEndDate - currentDate) / (1000 * 60 * 60 * 24));
        isUpgrade = true;
      }
      switch (selectedPlan.plan_type) {
        case "Weekly":
          endDate.setDate(currentDate.getDate() + 7 + Math.max(0, remainingDays - 7));
          break;
        case "Monthly":
          endDate.setMonth(currentDate.getMonth() + 1);
          if (remainingDays > 30) endDate.setDate(endDate.getDate() + (remainingDays - 30));
          break;
        case "Quarterly":
          endDate.setMonth(currentDate.getMonth() + 3);
          if (remainingDays > 90) endDate.setDate(endDate.getDate() + (remainingDays - 90));
          break;
        case "Yearly":
          endDate.setFullYear(currentDate.getFullYear() + 1);
          if (remainingDays > 365) endDate.setDate(endDate.getDate() + (remainingDays - 365));
          break;
      }
      const subscriptionData = {
        user_id: user.user_id,
        plan_id: selectedPlan.plan_id,
        plan_type: selectedPlan.plan_type,
        price: selectedPlan.price,
        subscription_status: "paid",
        subscription_end_date: endDate.toISOString().split('T')[0],
        created_at: currentDate.toISOString().split('T')[0],
        is_upgrade: isUpgrade ? 1 : 0
      };
      const res = await fetch(`${API}/subscribe_user.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscriptionData),
      });
      const result = await res.json();
      if (result.status === "success") {
        setUser({
          ...user,
          subscription_status: "paid",
          plan_type: selectedPlan.plan_type,
          subscription_end_date: endDate.toISOString().split('T')[0]
        });
        await AsyncStorage.setItem("subscription_status", "active");
        setSubscriptionVisible(false);
        setSelectedPlan(null);
        const actionText = isUpgrade ? "upgraded to" : "subscribed to";
        Alert.alert(
          "Success!",
          `You have successfully ${actionText} ${selectedPlan.plan_type} plan for ₹${selectedPlan.price}`,
          [{ text: "OK", style: "default" }]
        );
      } else {
        Alert.alert("Error", result.error || "Subscription failed");
      }
    } catch (error) {
      Alert.alert("Network Error", error.message);
    } finally {
      setSubscribing(false);
    }
  };

  const deleteAccount = async () => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const res = await fetch(`${API}/delete_user.php`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id: user.user_id }),
              });
              if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
              const contentType = res.headers.get("content-type");
              if (!contentType || !contentType.includes("application/json")) {
                throw new Error("Server did not return JSON");
              }
              const result = await res.json();
              if (result.status === "success") {
                await AsyncStorage.clear();
                setUser(null);
                Alert.alert("Success", "Account deleted successfully.", [
                  {
                    text: "Restart",
                    onPress: async () => await Updates.reloadAsync(),
                  },
                ]);
              } else {
                Alert.alert("Error", result.error || "Deletion failed");
              }
            } catch (error) {
              console.error("Delete Account Error:", error);
              Alert.alert("Error", error.message || "Deletion failed. Please try again.");
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color={ACCENT} />
        <Text style={styles.loadingText}>Loading Profile...</Text>
      </SafeAreaView>
    );
  }

  if (!user) return null;

  const displayName = user.name && user.name.trim() !== "" ? user.name : user.username || "Guest User";
  const currentDate = new Date();
  const endDateObj = user.subscription_end_date ? new Date(user.subscription_end_date) : null;
  const isValidSubscription = user.subscription_status === "paid" && endDateObj && endDateObj > currentDate;
  const isSubscribed = isValidSubscription;
  const getPlanIndex = (planType) => {
    switch (planType) {
      case "Weekly": return 0;
      case "Monthly": return 1;
      case "Quarterly": return 2;
      case "Yearly": return 3;
      default: return -1;
    }
  };
  const currentPlanIndex = getPlanIndex(user.plan_type);
  const canUpgrade = isSubscribed && currentPlanIndex < 3;
  const upgradePlans = isSubscribed && canUpgrade ? SUBSCRIPTION_PLANS.slice(currentPlanIndex + 1) : SUBSCRIPTION_PLANS;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.headerCard}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" }}
              style={styles.avatar}
            />
            {isSubscribed && <View style={styles.premiumBadge}>
              <Icon name="diamond" size={12} color="#fff" />
            </View>}
          </View>
          <Text style={styles.displayName}>{displayName}</Text>
          {isSubscribed && (
            <View style={styles.subscriptionInfo}>
              <Icon name="checkmark-circle" size={16} color={SUCCESS} />
              <Text style={styles.subscriptionText}>{user.plan_type} Plan Active</Text>
            </View>
          )}
          <View style={styles.coinContainer}>
            <Icon name="diamond" size={16} color="#ffd700" />
            <Text style={styles.coinText}>{user.coins || 0} Coins</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => {
            setForm({ ...user, dob: user.dob ? formatDateForDisplay(user.dob) : "" });
            setEditVisible(true);
          }}
          activeOpacity={0.8}
        >
          <Icon name="create-outline" size={20} color="#fff" />
          <Text style={styles.editButtonText}>Edit Profile</Text>
          <Icon name="chevron-forward" size={18} color="#fff" />
        </TouchableOpacity>
        {isSubscribed ? (
          canUpgrade ? (
            <TouchableOpacity
              style={styles.upgradeButton}
              onPress={() => setSubscriptionVisible(true)}
              activeOpacity={0.8}
            >
              <Icon name="chevron-forward" size={20} color="#fff" />
              <Text style={styles.upgradeButtonText}>Upgrade Plan</Text>
              <Icon name="chevron-forward" size={18} color="#fff" />
            </TouchableOpacity>
          ) : (
            <View style={styles.maxPlanInfo}>
              <Text style={styles.maxPlanText}>You have the highest plan!</Text>
            </View>
          )
        ) : (
          <TouchableOpacity
            style={styles.subscribeButton}
            onPress={() => setSubscriptionVisible(true)}
            activeOpacity={0.8}
          >
            <Icon name="diamond-outline" size={20} color="#fff" />
            <Text style={styles.subscribeButtonText}>Subscribe Now</Text>
            <Icon name="chevron-forward" size={18} color="#fff" />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={deleteAccount}
          activeOpacity={0.8}
        >
          <Icon name="trash-outline" size={20} color="#fff" />
          <Text style={styles.deleteButtonText}>Delete Account</Text>
          <Icon name="chevron-forward" size={18} color="#fff" />
        </TouchableOpacity>
        {isSubscribed && (
          <View style={styles.subscriptionCard}>
            <View style={styles.subscriptionHeader}>
              <Icon name="diamond" size={20} color={SUCCESS} />
              <Text style={styles.subscriptionTitle}>Active Subscription</Text>
            </View>
            <View style={styles.subscriptionDetails}>
              <Text style={styles.subscriptionPlan}>{user.plan_type} Plan</Text>
              <Text style={styles.subscriptionExpiry}>
                Valid until: {formatDateForDisplay(user.subscription_end_date)}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
      <Modal visible={editVisible} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setEditVisible(false)} style={styles.cancelButton}>
              <Icon name="close" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TouchableOpacity onPress={saveProfile} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <View style={styles.modalImageSection}>
              <Image
                source={{ uri: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" }}
                style={styles.modalAvatar}
              />
              <TouchableOpacity style={styles.changeImageButton}>
                <Icon name="camera" size={16} color="#fff" />
                <Text style={styles.changeImageText}>Change Photo</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.formSection}>
              <FormField
                label="Full Name"
                icon="person-outline"
                placeholder="Enter your full name"
                value={form.name || ""}
                onChangeText={(v) => setForm({ ...form, name: v })}
                autoCapitalize="words"
              />
              <FormField
                label="Username"
                icon="at-outline"
                placeholder="Enter username"
                value={form.username || ""}
                onChangeText={(v) => setForm({ ...form, username: v })}
                autoCapitalize="none"
              />
              <FormField
                label="Email Address"
                icon="mail-outline"
                placeholder="Enter email address"
                value={form.email || ""}
                onChangeText={(v) => setForm({ ...form, email: v })}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <FormField
                label="Phone Number"
                icon="call-outline"
                placeholder="Enter phone number"
                value={form.phone || ""}
                onChangeText={(v) => setForm({ ...form, phone: v })}
                keyboardType="phone-pad"
              />
              <FormField
                label="Date of Birth"
                icon="calendar-outline"
                placeholder="DD/MM/YYYY"
                value={form.dob || ""}
                onChangeText={(v) => {
                  let formatted = v.replace(/\D/g, '');
                  if (formatted.length >= 2 && formatted.length < 4) {
                    formatted = formatted.substring(0, 2) + '/' + formatted.substring(2);
                  } else if (formatted.length >= 4) {
                    formatted = formatted.substring(0, 2) + '/' + 
                               formatted.substring(2, 4) + '/' + 
                               formatted.substring(4, 8);
                  }
                  setForm({ ...form, dob: formatted });
                }}
                keyboardType="numeric"
                maxLength={10}
              />
              <View style={styles.fieldContainer}>
                <View style={styles.fieldHeader}>
                  <Icon name="transgender-outline" size={16} color={ACCENT} />
                  <Text style={styles.fieldLabel}>Gender</Text>
                </View>
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={form.gender || "Male"}
                    onValueChange={(v) => setForm({ ...form, gender: v })}
                    style={styles.picker}
                    dropdownIconColor="#fff"
                  >
                    <Picker.Item label="Male" value="Male" color="#fff" />
                    <Picker.Item label="Female" value="Female" color="#fff" />
                    <Picker.Item label="Other" value="Other" color="#fff" />
                  </Picker>
                </View>
              </View>
            </View>
            <View style={{ height: 50 }} />
          </ScrollView>
        </SafeAreaView>
      </Modal>
      <Modal visible={subscriptionVisible} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => {
                setSubscriptionVisible(false);
                setSelectedPlan(null);
              }}
              style={styles.cancelButton}
            >
              <Icon name="close" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {isSubscribed && canUpgrade ? "Upgrade Plan" : isSubscribed ? "Your Plan" : "Choose Your Plan"}
            </Text>
            <View style={{ width: 60 }} />
          </View>
          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {isSubscribed && canUpgrade && (
              <Text style={styles.currentPlanNote}>
                Current: {user.plan_type} Plan | Upgrade to a higher plan
              </Text>
            )}
            <Text style={styles.subscriptionDescription}>
              {isSubscribed && canUpgrade 
                ? "Upgrade to access more features and save more!" 
                : "Unlock premium features and enjoy unlimited access to all content"
              }
            </Text>
            {upgradePlans.map((plan) => (
              <TouchableOpacity
                key={plan.plan_id}
                style={[
                  styles.planCard,
                  selectedPlan?.plan_id === plan.plan_id && styles.selectedPlan,
                  plan.popular && styles.popularPlan
                ]}
                onPress={() => setSelectedPlan(plan)}
                activeOpacity={0.8}
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
                  <View style={styles.featureItem}>
                    <Icon name="checkmark-circle" size={16} color={SUCCESS} />
                    <Text style={styles.featureText}>Unlimited streaming</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <Icon name="checkmark-circle" size={16} color={SUCCESS} />
                    <Text style={styles.featureText}>HD Quality</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <Icon name="checkmark-circle" size={16} color={SUCCESS} />
                    <Text style={styles.featureText}>Download for offline</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <Icon name="checkmark-circle" size={16} color={SUCCESS} />
                    <Text style={styles.featureText}>Ad-free experience</Text>
                  </View>
                </View>
                {selectedPlan?.plan_id === plan.plan_id && (
                  <View style={styles.selectedIndicator}>
                    <Icon name="checkmark-circle" size={20} color={ACCENT} />
                  </View>
                )}
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={[
                styles.subscribeNowButton,
                !selectedPlan && styles.disabledButton
              ]}
              onPress={handleSubscription}
              disabled={!selectedPlan || subscribing}
              activeOpacity={0.8}
            >
              {subscribing ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Icon name={isSubscribed && canUpgrade ? "arrow-upward" : "diamond"} size={20} color="#fff" />
                  <Text style={styles.subscribeNowText}>
                    {selectedPlan 
                      ? `${isSubscribed && canUpgrade ? "Upgrade to" : "Subscribe to"} ${selectedPlan.plan_type} - ₹${selectedPlan.price}` 
                      : "Select a Plan"
                    }
                  </Text>
                </>
              )}
            </TouchableOpacity>
            <View style={{ height: 50 }} />
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

function FormField({ 
  label, 
  icon, 
  placeholder, 
  value, 
  onChangeText, 
  keyboardType = "default",
  autoCapitalize = "sentences",
  maxLength
}) {
  return (
    <View style={styles.fieldContainer}>
      <View style={styles.fieldHeader}>
        <Icon name={icon} size={16} color={ACCENT} />
        <Text style={styles.fieldLabel}>{label}</Text>
      </View>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#666"
        style={styles.textInput}
        value={value}
        onChangeText={onChangeText}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        maxLength={maxLength}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  scroll: { padding: width * 0.05, paddingBottom: 100 },
  loadingText: { color: '#fff', fontSize: 16, marginTop: 10, textAlign: 'center' },
  headerCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  avatarContainer: { position: 'relative', marginBottom: 15 },
  avatar: {
    width: width * 0.28,
    height: width * 0.28,
    borderRadius: width * 0.14,
    borderWidth: 3,
    borderColor: ACCENT,
  },
  premiumBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: ACCENT,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#1a1a1a',
  },
  displayName: { 
    color: '#fff', 
    fontSize: width * 0.065, 
    fontWeight: '800', 
    marginBottom: 10, 
    textAlign: 'center' 
  },
  subscriptionInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  subscriptionText: { color: SUCCESS, marginLeft: 6, fontSize: width * 0.035, fontWeight: '600' },
  coinContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ffd700',
  },
  coinText: { color: '#ffd700', marginLeft: 6, fontSize: width * 0.04, fontWeight: '700' },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: ACCENT,
    padding: 18,
    borderRadius: 15,
    shadowColor: ACCENT,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 15,
  },
  editButtonText: { color: '#fff', fontSize: width * 0.045, fontWeight: '700', flex: 1, marginLeft: 10 },
  subscribeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#e91e63',
    padding: 18,
    borderRadius: 15,
    shadowColor: '#e91e63',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 20,
  },
  subscribeButtonText: { color: '#fff', fontSize: width * 0.045, fontWeight: '700', flex: 1, marginLeft: 10 },
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#4CAF50',
    padding: 18,
    borderRadius: 15,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 20,
  },
  upgradeButtonText: { color: '#fff', fontSize: width * 0.045, fontWeight: '700', flex: 1, marginLeft: 10 },
  maxPlanInfo: {
    backgroundColor: '#2a2a2a',
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: SUCCESS,
  },
  maxPlanText: { color: SUCCESS, fontSize: width * 0.045, fontWeight: '600' },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f44336',
    padding: 18,
    borderRadius: 15,
    shadowColor: '#f44336',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 20,
  },
  deleteButtonText: { color: '#fff', fontSize: width * 0.045, fontWeight: '700', flex: 1, marginLeft: 10 },
  subscriptionCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
    borderColor: SUCCESS,
  },
  subscriptionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  subscriptionTitle: { color: '#fff', fontSize: width * 0.045, fontWeight: '700', marginLeft: 10 },
  subscriptionDetails: { marginLeft: 30 },
  subscriptionPlan: { color: SUCCESS, fontSize: width * 0.04, fontWeight: '600', marginBottom: 5 },
  subscriptionExpiry: { color: '#aaa', fontSize: width * 0.035 },
  modalContainer: { flex: 1, backgroundColor: '#0a0a0a' },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#1a1a1a',
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  cancelButton: { padding: 8, borderRadius: 20, backgroundColor: '#333' },
  modalTitle: { 
    color: '#fff', 
    fontSize: width * 0.05, 
    fontWeight: '700', 
    flex: 1, 
    textAlign: 'center' 
  },
  saveButton: { backgroundColor: ACCENT, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 },
  saveButtonText: { color: '#fff', fontSize: width * 0.04, fontWeight: '700' },
  modalContent: { flex: 1, padding: 20 },
  modalImageSection: {
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
    marginBottom: 20,
  },
  modalAvatar: {
    width: width * 0.25,
    height: width * 0.25,
    borderRadius: width * 0.125,
    borderWidth: 3,
    borderColor: ACCENT,
    marginBottom: 15,
  },
  changeImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  changeImageText: { color: '#fff', fontSize: 14, marginLeft: 6, fontWeight: '600' },
  formSection: { marginBottom: 20 },
  fieldContainer: { marginBottom: 20 },
  fieldHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  fieldLabel: { color: '#fff', fontSize: width * 0.04, fontWeight: '600', marginLeft: 8 },
  textInput: {
    backgroundColor: '#1a1a1a',
    color: '#fff',
    padding: 16,
    borderRadius: 12,
    fontSize: width * 0.04,
    borderWidth: 1,
    borderColor: '#333',
    minHeight: 50,
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  genderOption: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#333',
  },
  selectedGender: {
    backgroundColor: ACCENT,
    borderColor: ACCENT,
  },
  genderText: {
    color: '#fff',
    fontWeight: '600',
  },
  selectedGenderText: {
    color: '#fff',
  },
  currentPlanNote: { 
    color: ACCENT, 
    fontSize: width * 0.04, 
    textAlign: 'center', 
    marginBottom: 10, 
    fontWeight: '600' 
  },
  subscriptionDescription: { 
    color: '#aaa', 
    fontSize: width * 0.04, 
    textAlign: 'center', 
    marginBottom: 30, 
    lineHeight: 22 
  },
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
    borderRadius: 10 
  },
  popularText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  planHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 15 },
  planType: { color: '#fff', fontSize: width * 0.05, fontWeight: '800', marginBottom: 5 },
  planDescription: { color: '#aaa', fontSize: width * 0.035 },
  planPriceContainer: { alignItems: 'flex-end' },
  planPrice: { color: ACCENT, fontSize: width * 0.06, fontWeight: '800' },
  planDuration: { color: '#aaa', fontSize: width * 0.03 },
  planFeatures: { marginTop: 10 },
  featureItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  featureText: { color: '#fff', fontSize: width * 0.035, marginLeft: 10 },
  selectedIndicator: { position: 'absolute', top: 15, right: 15 },
  subscribeNowButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ACCENT,
    padding: 18,
    borderRadius: 15,
    shadowColor: ACCENT,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
    marginTop: 20,
  },
  disabledButton: { backgroundColor: '#555', shadowColor: '#555' },
  subscribeNowText: { color: '#fff', fontSize: width * 0.045, fontWeight: '700', marginLeft: 10 },
});