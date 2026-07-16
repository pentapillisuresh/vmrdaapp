import {View,Text,ScrollView,TouchableOpacity,Linking,Alert,ActivityIndicator,TextInput} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState, useEffect, useCallback } from "react";
import {useFonts,Poppins_600SemiBold,Poppins_400Regular,Poppins_500Medium} from "@expo-google-fonts/poppins";
import { Phone, MessageCircle, Mail, FileText, Search, Filter, Star, Calendar, TrendingUp, Eye } from "lucide-react-native";
import { router, useFocusEffect } from "expo-router";
import { useTheme } from "../../utils/theme";
import ApiService from "../../components/ApiService";
import { getAuth } from "../../utils/auth/auth";

export default function LeadsScreen() {
  
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalLeads: 0,
    leadsThisMonth: 0,
    contactedLeads: 0,
    completedLeads: 0,
  });

  const [loaded, fontError] = useFonts({
    Poppins_600SemiBold,
    Poppins_500Medium,
    Poppins_400Regular,
  });

  const statuses = [
    { id: "all", label: "All", status: "all" },
    { id: "pending", label: "Pending", status: "pending" },
    { id: "site visit", label: "Site Visit", status: "site visit" },
    { id: "closing", label: "Closing", status: "closing" },
    { id: "notinterest", label: "Not Interested", status: "notinterest" },
    { id: "noResponse", label: "No Response", status: "noResponse" },
  ];

  // Fetch leads from API
  const fetchLeads = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get token from storage (adjust based on your storage method)
      const {token,user} = await getAuth(); // Replace with actual token retrieval
      
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await ApiService.get('/dashboard/client/leads', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = response.data;
      
      if (result) {        
        setLeads(result?.leads || []);
        setFilteredLeads(result?.leads || []);
        
        // Calculate stats based on lead status
        const leadList = result?.leads || [];
        const totalLeads = leadList.length;
        const leadsThisMonth = leadList.filter(lead => {
          const leadDate = new Date(lead.createdAt);
          const now = new Date();
          return leadDate.getMonth() === now.getMonth() && 
                 leadDate.getFullYear() === now.getFullYear();
        }).length;
        
        const contactedLeads = leadList.filter(lead => 
          lead.status === "site visit" || 
          lead.status === "closing" || 
          lead.status === "pending"
        ).length;
        
        const completedLeads = leadList.filter(lead => 
          lead.status === "closing" || 
          lead.status === "notinterest"
        ).length;

        setStats({
          totalLeads,
          leadsThisMonth,
          contactedLeads,
          completedLeads,
        });
      } else {
        throw new Error("Invalid response format from server");
      }
    } catch (err) {
      console.error('Error fetching leads:', err);
      setError(err.message || "Something went wrong while fetching leads");
    } finally {
      setLoading(false);
    }
  };

  // Filter leads based on search and status
  useEffect(() => {
    let filtered = leads;

    if (searchQuery) {
      filtered = filtered.filter(lead =>
        lead.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.phone?.includes(searchQuery) ||
        lead.property?.title?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter(lead => lead.status === selectedStatus);
    }

    setFilteredLeads(filtered);
  }, [searchQuery, selectedStatus, leads]);

  // Refresh on focus
  useFocusEffect(
    useCallback(() => {
      fetchLeads();
    }, [])
  );

  const handleCall = (phone) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleWhatsApp = (phone) => {
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    Linking.openURL(`whatsapp://send?phone=${cleanPhone}`);
  };

  const handleSMS = (phone) => {
    Linking.openURL(`sms:${phone}`);
  };

  const handleAddNote = (leadId) => {
    Alert.alert("Add Note", "Note feature coming soon!");
  };

  const handleViewProperty = (propertyId) => {
    if (propertyId) {
      router.push({
        pathname: "/property-details",
        params: { id: propertyId }
      });
    } else {
      Alert.alert("Error", "Property not found");
    }
  };

  // Get status badge style
  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'site visit':
        return { bg: theme.colors.info, text: "#FFFFFF", label: "Site Visit" };
      case 'closing':
        return { bg: theme.colors.success, text: "#FFFFFF", label: "Closing" };
      case 'notinterest':
        return { bg: "#DC2626", text: "#FFFFFF", label: "Not Interested" };
      case 'noResponse':
        return { bg: "#6B7280", text: "#FFFFFF", label: "No Response" };
      case 'pending':
        return { bg: theme.colors.warning, text: "#FFFFFF", label: "Pending" };
      default:
        return { bg: theme.colors.primary, text: "#FFFFFF", label: "New" };
    }
  };

  // Get priority badge style
  const getPriorityBadgeStyle = (priority) => {
    switch (priority) {
      case 'high':
        return { bg: "#FEE2E2", text: "#DC2626", icon: "🔥" };
      case 'medium':
        return { bg: "#FEF3C7", text: "#D97706", icon: "⚡" };
      case 'low':
        return { bg: "#E5E7EB", text: "#374151", icon: "📋" };
      default:
        return { bg: "#FEF3C7", text: "#D97706", icon: "⚡" };
    }
  };

  if (!loaded && !fontError) {
    return null;
  }

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <StatusBar style={theme.statusBarStyle} />
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ 
          marginTop: 16, 
          fontSize: 16, 
          fontFamily: "Poppins_500Medium",
          color: theme.colors.text 
        }}>
          Loading leads...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
        <StatusBar style={theme.statusBarStyle} />
        <Text style={{ 
          fontSize: 18, 
          fontFamily: "Poppins_600SemiBold",
          color: "#DC2626",
          textAlign: 'center',
          marginBottom: 16 
        }}>
          Error: {error}
        </Text>
        <TouchableOpacity
          onPress={fetchLeads}
          style={{
            backgroundColor: theme.colors.primary,
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 8,
          }}
        >
          <Text style={{
            fontSize: 14,
            fontFamily: "Poppins_600SemiBold",
            color: "#FFFFFF",
          }}>
            Retry
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar style={theme.statusBarStyle} />

      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + 20,
          paddingBottom: 16,
          paddingHorizontal: 20,
          backgroundColor: theme.colors.background,
        }}
      >
        <Text
          style={{
            fontSize: 28,
            fontFamily: "Poppins_600SemiBold",
            color: theme.colors.text,
          }}
        >
          Lead Generation
        </Text>
        <Text
          style={{
            fontSize: 14,
            fontFamily: "Poppins_400Regular",
            color: theme.colors.textSecondary,
            marginTop: 4,
          }}
        >
          Manage and track customer inquiries for your properties
        </Text>
      </View>

      {/* Stats Cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ paddingHorizontal: 20 }}
        contentContainerStyle={{ gap: 12 }}
      >
        <StatCard 
          label="Total Leads" 
          value={stats.totalLeads} 
          color="blue" 
          icon={<Star size={20} color="#3B82F6" />} 
          theme={theme}
        />
        <StatCard 
          label="New Leads" 
          value={stats.leadsThisMonth} 
          color="blue" 
          icon={<Calendar size={20} color="#3B82F6" />} 
          theme={theme}
        />
        <StatCard 
          label="Contacted" 
          value={stats.contactedLeads} 
          color="yellow" 
          icon={<TrendingUp size={20} color="#D97706" />} 
          theme={theme}
        />
        <StatCard 
          label="Completed" 
          value={stats.completedLeads} 
          color="green" 
          icon={<Star size={20} color="#059669" />} 
          theme={theme}
        />
      </ScrollView>

      {/* Search and Filter */}
      <View style={{ 
        backgroundColor: "#FFFFFF", 
        borderRadius: 12, 
        padding: 16, 
        marginHorizontal: 20,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          {/* Search Input */}
          <View style={{ flex: 1, position: 'relative' }}>
            <Search 
              size={20} 
              color={theme.colors.textSecondary} 
              style={{ position: 'absolute', left: 12, top: 12, zIndex: 1 }}
            />
            <TextInput
              style={{
                flex: 1,
                height: 44,
                borderWidth: 1,
                borderColor: theme.colors.border,
                borderRadius: 8,
                paddingLeft: 40,
                paddingRight: 12,
                fontSize: 14,
                fontFamily: "Poppins_400Regular",
                color: theme.colors.text,
              }}
              placeholder="Search by name, email, phone, or property..."
              placeholderTextColor={theme.colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Filter Dropdown */}
          <TouchableOpacity
            style={{ 
              flexDirection: 'row', 
              alignItems: 'center', 
              gap: 8,
              borderWidth: 1,
              borderColor: theme.colors.border,
              borderRadius: 8,
              paddingHorizontal: 12,
              justifyContent: 'center',
              minWidth: 100,
            }}
          >
            <Filter size={20} color={theme.colors.textSecondary} />
            <Text style={{ 
              fontSize: 14, 
              fontFamily: "Poppins_400Regular", 
              color: theme.colors.text 
            }}>
              Filter
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Status Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          gap: 8,
          paddingVertical: 12,
        }}
        style={{
          flexGrow: 0,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.border,
          backgroundColor: "#FFFFFF",
        }}
      >
        {statuses.map((status) => {
          const isSelected = selectedStatus === status.id;
          const count = status.id === "all"
            ? leads.length
            : leads.filter((l) => l.status === status.id).length;

          return (
            <TouchableOpacity
              key={status.id}
              onPress={() => setSelectedStatus(status.id)}
              style={{
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderRadius: 20,
                backgroundColor: isSelected
                  ? theme.colors.primary
                  : theme.colors.surface,
                borderWidth: 1,
                borderColor: isSelected
                  ? theme.colors.primary
                  : theme.colors.border,
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
              }}
              activeOpacity={0.7}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Poppins_500Medium",
                  color: isSelected ? "#FFFFFF" : theme.colors.text,
                }}
              >
                {status.label}
              </Text>
              {count > 0 && (
                <View
                  style={{
                    backgroundColor: isSelected
                      ? "rgba(255, 255, 255, 0.3)"
                      : theme.colors.border,
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    borderRadius: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: "Poppins_600SemiBold",
                      color: isSelected ? "#FFFFFF" : theme.colors.text,
                    }}
                  >
                    {count}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Results Count */}
      {!loading && (
        <View style={{ 
          paddingHorizontal: 20, 
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.border,
          backgroundColor: "#FFFFFF"
        }}>
          <Text style={{ 
            fontSize: 14, 
            fontFamily: "Poppins_400Regular",
            color: theme.colors.textSecondary 
          }}>
            Showing{" "}
            <Text style={{ 
              fontFamily: "Poppins_600SemiBold", 
              color: theme.colors.text 
            }}>
              {filteredLeads.length}
            </Text>{" "}
            of {stats.totalLeads} leads
          </Text>
        </View>
      )}

      {/* Leads List */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: 16,
          paddingBottom: insets.bottom + 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {filteredLeads.map((lead) => {
          const statusStyle = getStatusBadgeStyle(lead.status);
          const priorityStyle = getPriorityBadgeStyle(lead.priority);
          
          return (
            <View
              key={lead.id}
              style={{
                marginHorizontal: 20,
                marginBottom: 16,
                backgroundColor: theme.colors.surface,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: theme.colors.border,
                padding: 16,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              {/* Lead Header */}
              <View style={{ marginBottom: 12 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 4,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      fontFamily: "Poppins_600SemiBold",
                      color: theme.colors.text,
                      flex: 1,
                    }}
                  >
                    {lead.customerName || "Unknown Customer"}
                  </Text>

                  <View
                    style={{
                      backgroundColor: statusStyle.bg,
                      paddingHorizontal: 10,
                      paddingVertical: 4,
                      borderRadius: 8,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 11,
                        fontFamily: "Poppins_500Medium",
                        color: statusStyle.text,
                      }}
                    >
                      {statusStyle.label.toUpperCase()}
                    </Text>
                  </View>
                </View>

                {/* Priority Badge */}
                {lead.priority && (
                  <View style={{ 
                    alignSelf: 'flex-start', 
                    backgroundColor: priorityStyle.bg,
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 6,
                    marginBottom: 8,
                  }}>
                    <Text style={{ 
                      fontSize: 10, 
                      fontFamily: "Poppins_500Medium",
                      color: priorityStyle.text,
                    }}>
                      {priorityStyle.icon} {lead.priority?.charAt(0).toUpperCase() + lead.priority?.slice(1)}
                    </Text>
                  </View>
                )}

                {/* Property Info */}
                {lead.property && (
                  <TouchableOpacity
                    onPress={() => handleViewProperty(lead.property?.id)}
                    style={{ marginBottom: 8 }}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: "Poppins_500Medium",
                        color: theme.colors.primary,
                        marginBottom: 2,
                      }}
                    >
                      {lead.property?.title || "Property Inquiry"}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <Eye size={12} color={theme.colors.textSecondary} />
                      <Text
                        style={{
                          fontSize: 12,
                          fontFamily: "Poppins_400Regular",
                          color: theme.colors.textSecondary,
                        }}
                      >
                        View Property →
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}

                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: "Poppins_400Regular",
                    color: theme.colors.textSecondary,
                    marginTop: 4,
                  }}
                >
                  {new Date(lead.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </Text>
              </View>

              {/* Contact Info */}
              <View style={{ marginBottom: 12 }}>
                {lead.phone && (
                  <Text
                    style={{
                      fontSize: 13,
                      fontFamily: "Poppins_500Medium",
                      color: theme.colors.text,
                      marginBottom: 4,
                    }}
                  >
                    📞 {lead.phone}
                  </Text>
                )}
                {lead.email && (
                  <Text
                    style={{
                      fontSize: 13,
                      fontFamily: "Poppins_400Regular",
                      color: theme.colors.textSecondary,
                    }}
                  >
                    ✉️ {lead.email}
                  </Text>
                )}
                {lead.message && (
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: "Poppins_400Regular",
                      color: theme.colors.textSecondary,
                      marginTop: 8,
                      fontStyle: 'italic',
                    }}
                  >
                    "{lead.message}"
                  </Text>
                )}
              </View>

              {/* Action Buttons */}
              <View
                style={{
                  flexDirection: "row",
                  gap: 8,
                  marginBottom: lead.notes ? 12 : 0,
                }}
              >
                {lead.phone && (
                  <>
                    <TouchableOpacity
                      onPress={() => handleCall(lead.phone)}
                      style={{
                        flex: 1,
                        backgroundColor: theme.colors.primary,
                        borderRadius: 10,
                        paddingVertical: 10,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 6,
                      }}
                      activeOpacity={0.7}
                    >
                      <Phone size={16} color="#FFFFFF" strokeWidth={1.5} />
                      <Text
                        style={{
                          fontSize: 13,
                          fontFamily: "Poppins_500Medium",
                          color: "#FFFFFF",
                        }}
                      >
                        Call
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => handleWhatsApp(lead.phone)}
                      style={{
                        flex: 1,
                        backgroundColor: "#25D366",
                        borderRadius: 10,
                        paddingVertical: 10,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 6,
                      }}
                      activeOpacity={0.7}
                    >
                      <MessageCircle size={16} color="#FFFFFF" strokeWidth={1.5} />
                      <Text
                        style={{
                          fontSize: 13,
                          fontFamily: "Poppins_500Medium",
                          color: "#FFFFFF",
                        }}
                      >
                        WhatsApp
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => handleSMS(lead.phone)}
                      style={{
                        flex: 1,
                        backgroundColor: theme.colors.info,
                        borderRadius: 10,
                        paddingVertical: 10,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 6,
                      }}
                      activeOpacity={0.7}
                    >
                      <Mail size={16} color="#FFFFFF" strokeWidth={1.5} />
                      <Text
                        style={{
                          fontSize: 13,
                          fontFamily: "Poppins_500Medium",
                          color: "#FFFFFF",
                        }}
                      >
                        SMS
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>

              {/* Notes */}
              {lead.notes && (
                <View
                  style={{
                    backgroundColor: theme.colors.background,
                    borderRadius: 8,
                    padding: 12,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: "Poppins_400Regular",
                      color: theme.colors.textSecondary,
                    }}
                  >
                    Note: {lead.notes}
                  </Text>
                </View>
              )}

              {/* Add Note Button */}
              <TouchableOpacity
                onPress={() => handleAddNote(lead.id)}
                style={{
                  marginTop: 12,
                  paddingVertical: 8,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}
                activeOpacity={0.7}
              >
                <FileText
                  size={16}
                  color={theme.colors.primary}
                  strokeWidth={1.5}
                />
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: "Poppins_500Medium",
                    color: theme.colors.primary,
                  }}
                >
                  {lead.notes ? "Edit Note" : "Add Note"}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}

        {filteredLeads.length === 0 && !loading && (
          <View
            style={{
              paddingVertical: 60,
              paddingHorizontal: 40,
              alignItems: "center",
            }}
          >
            <Search size={64} color={theme.colors.textSecondary} />
            <Text
              style={{
                fontSize: 20,
                fontFamily: "Poppins_600SemiBold",
                color: theme.colors.text,
                textAlign: "center",
                marginTop: 16,
                marginBottom: 8,
              }}
            >
              No leads found
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Poppins_400Regular",
                color: theme.colors.textSecondary,
                textAlign: "center",
                marginBottom: 20,
              }}
            >
              Try adjusting your search or filters
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

// StatCard Component
const StatCard = ({ label, value, color, icon, theme }) => {
  const colorMap = {
    blue: { bg: "#DBEAFE", text: "#1E40AF", iconBg: "#3B82F6" },
    yellow: { bg: "#FEF3C7", text: "#92400E", iconBg: "#D97706" },
    green: { bg: "#D1FAE5", text: "#065F46", iconBg: "#059669" },
  };
  
  const colors = colorMap[color] || colorMap.blue;
  
  return (
    <View style={{ 
      backgroundColor: "#FFFFFF", 
      borderRadius: 12, 
      padding: 16,
      width: 160,height:80,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View>
          <Text style={{ 
            fontSize: 12, 
            fontFamily: "Poppins_400Regular",
            color: theme.colors.textSecondary,
            marginBottom: 4 
          }}>
            {label}
          </Text>
          <Text style={{ 
            fontSize: 24, 
            fontFamily: "Poppins_600SemiBold",
            color: colors.text 
          }}>
            {value}
          </Text>
        </View>
        <View style={{ 
          backgroundColor: colors.bg, 
          padding: 12, 
          borderRadius: 12 
        }}>
          {icon}
        </View>
      </View>
    </View>
  );
};