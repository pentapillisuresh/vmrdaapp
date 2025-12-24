import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";
import {
  useFonts,
  Poppins_600SemiBold,
  Poppins_400Regular,
  Poppins_500Medium,
} from "@expo-google-fonts/poppins";
import { Phone, MessageCircle, Mail, FileText } from "lucide-react-native";
import { useTheme } from "../../utils/theme";
import { leads } from "../../utils/dummyData";

export default function LeadsScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const [selectedStatus, setSelectedStatus] = useState("all");

  const [loaded, error] = useFonts({
    Poppins_600SemiBold,
    Poppins_500Medium,
    Poppins_400Regular,
  });

  const statuses = [
    { id: "all", label: "All" },
    { id: "new", label: "New" },
    { id: "contacted", label: "Contacted" },
    { id: "interested", label: "Interested" },
  ];

  const filteredLeads =
    selectedStatus === "all"
      ? leads
      : leads.filter((lead) => lead.status === selectedStatus);

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

  if (!loaded && !error) {
    return null;
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
          Leads
        </Text>
        <Text
          style={{
            fontSize: 14,
            fontFamily: "Poppins_400Regular",
            color: theme.colors.textSecondary,
            marginTop: 4,
          }}
        >
          Manage your property inquiries
        </Text>
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
        }}
      >
        {statuses.map((status) => {
          const isSelected = selectedStatus === status.id;
          const count =
            status.id === "all"
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

      {/* Leads List */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: 16,
          paddingBottom: insets.bottom + 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {filteredLeads.map((lead) => (
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
              ...theme.elevation.card,
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
                  {lead.buyerName}
                </Text>

                <View
                  style={{
                    backgroundColor:
                      lead.status === "new"
                        ? theme.colors.info
                        : lead.status === "contacted"
                          ? theme.colors.warning
                          : theme.colors.success,
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 8,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      fontFamily: "Poppins_500Medium",
                      color: "#FFFFFF",
                    }}
                  >
                    {lead.status.toUpperCase()}
                  </Text>
                </View>
              </View>

              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Poppins_400Regular",
                  color: theme.colors.textSecondary,
                }}
              >
                {lead.propertyTitle}
              </Text>

              <Text
                style={{
                  fontSize: 12,
                  fontFamily: "Poppins_400Regular",
                  color: theme.colors.textSecondary,
                  marginTop: 4,
                }}
              >
                {new Date(lead.date).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </Text>
            </View>

            {/* Contact Info */}
            <View style={{ marginBottom: 12 }}>
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: "Poppins_400Regular",
                  color: theme.colors.text,
                  marginBottom: 4,
                }}
              >
                {lead.buyerPhone}
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: "Poppins_400Regular",
                  color: theme.colors.textSecondary,
                }}
              >
                {lead.buyerEmail}
              </Text>
            </View>

            {/* Action Buttons */}
            <View
              style={{
                flexDirection: "row",
                gap: 8,
                marginBottom: lead.notes ? 12 : 0,
              }}
            >
              <TouchableOpacity
                onPress={() => handleCall(lead.buyerPhone)}
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
                onPress={() => handleWhatsApp(lead.buyerPhone)}
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
                onPress={() => handleSMS(lead.buyerPhone)}
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
        ))}

        {filteredLeads.length === 0 && (
          <View
            style={{
              paddingVertical: 60,
              paddingHorizontal: 40,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontFamily: "Poppins_600SemiBold",
                color: theme.colors.text,
                textAlign: "center",
                marginBottom: 8,
              }}
            >
              No Leads Yet
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Poppins_400Regular",
                color: theme.colors.textSecondary,
                textAlign: "center",
              }}
            >
              Leads from interested buyers will appear here
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
