// components/PostProperty/BasicDetailsStep.js
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { Home, Building, MapPin, Tag } from "lucide-react-native";

export function BasicDetailsStep({
  theme,
  listingType,
  setListingType,
  propertyType,
  setPropertyType,
  propertySubtype,
  setPropertySubtype,
  title,
  setTitle,
  titleError,
  categories,
  getSubtypes,
}) {
  const subtypes = getSubtypes();

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Text
        style={{
          fontSize: 20,
          fontFamily: "Poppins_600SemiBold",
          color: theme.colors.text,
          marginBottom: 20,
        }}
      >
        Basic Details
      </Text>

      {/* Listing Type */}
      <View style={{ marginBottom: 24 }}>
        <Text
          style={{
            fontSize: 14,
            fontFamily: "Poppins_500Medium",
            color: theme.colors.text,
            marginBottom: 12,
          }}
        >
          I'm looking to *
        </Text>
        <View style={{ flexDirection: "row", gap: 12 }}>
          {["Sale", "Rent"].map((type) => (
            <TouchableOpacity
              key={type}
              onPress={() => setListingType(type)}
              style={{
                flex: 1,
                paddingVertical: 12,
                borderRadius: 8,
                borderWidth: 2,
                borderColor: listingType === type ? theme.colors.primary : theme.colors.border,
                backgroundColor: listingType === type ? theme.colors.primary : "transparent",
                alignItems: "center",
              }}
              activeOpacity={0.7}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Poppins_500Medium",
                  color: listingType === type ? "#FFFFFF" : theme.colors.text,
                }}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Property Type */}
      <View style={{ marginBottom: 24 }}>
        <Text
          style={{
            fontSize: 14,
            fontFamily: "Poppins_500Medium",
            color: theme.colors.text,
            marginBottom: 12,
          }}
        >
          Property Type *
        </Text>
        <View style={{ flexDirection: "row", gap: 12 }}>
          {["residential", "commercial"].map((type) => (
            <TouchableOpacity
              key={type}
              onPress={() => {
                setPropertyType(type);
                setPropertySubtype("");
              }}
              style={{
                flex: 1,
                paddingVertical: 12,
                borderRadius: 8,
                borderWidth: 2,
                borderColor: propertyType === type ? theme.colors.primary : theme.colors.border,
                backgroundColor: propertyType === type ? theme.colors.primary : "transparent",
                alignItems: "center",
              }}
              activeOpacity={0.7}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Poppins_500Medium",
                  color: propertyType === type ? "#FFFFFF" : theme.colors.text,
                  textTransform: "capitalize",
                }}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Property Subtype */}
      {propertyType && (
        <View style={{ marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Poppins_500Medium",
              color: theme.colors.text,
              marginBottom: 12,
            }}
          >
            Property Subtype *
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ flexDirection: "row", gap: 8 }}
          >
            {subtypes.map((subtype) => (
              <TouchableOpacity
                key={subtype}
                onPress={() => setPropertySubtype(subtype)}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 20,
                  borderWidth: 2,
                  borderColor: propertySubtype === subtype ? theme.colors.primary : theme.colors.border,
                  backgroundColor: propertySubtype === subtype ? theme.colors.primary : "transparent",
                }}
                activeOpacity={0.7}
              >
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: "Poppins_500Medium",
                    color: propertySubtype === subtype ? "#FFFFFF" : theme.colors.text,
                  }}
                >
                  {subtype}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Property Title */}
      <View style={{ marginBottom: 24 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Poppins_500Medium",
              color: theme.colors.text,
            }}
          >
            Property Title *
          </Text>
          <Text
            style={{
              fontSize: 12,
              fontFamily: "Poppins_400Regular",
              color: title.length > 70 ? theme.colors.error : theme.colors.textSecondary,
            }}
          >
            {title.length}/70
          </Text>
        </View>
        
        <TextInput
          style={{
            backgroundColor: theme.colors.input,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: titleError ? theme.colors.error : theme.colors.border,
            paddingHorizontal: 16,
            paddingVertical: 14,
            fontSize: 14,
            fontFamily: "Poppins_400Regular",
            color: theme.colors.text,
          }}
          placeholder="Enter property title (5-70 characters)"
          placeholderTextColor={theme.colors.placeholder}
          value={title}
          onChangeText={setTitle}
          maxLength={70}
        />
        
        {titleError ? (
          <Text
            style={{
              fontSize: 12,
              fontFamily: "Poppins_400Regular",
              color: theme.colors.error,
              marginTop: 4,
            }}
          >
            {titleError}
          </Text>
        ) : title.length > 0 && title.length < 5 ? (
          <Text
            style={{
              fontSize: 12,
              fontFamily: "Poppins_400Regular",
              color: theme.colors.warning,
              marginTop: 4,
            }}
          >
            Minimum 5 characters required ({5 - title.length} more)
          </Text>
        ) : title.length >= 5 ? (
          <Text
            style={{
              fontSize: 12,
              fontFamily: "Poppins_400Regular",
              color: theme.colors.success,
              marginTop: 4,
            }}
          >
            ✓ Title meets requirements
          </Text>
        ) : null}
      </View>

      {/* Category Info */}
      <View
        style={{
          backgroundColor: theme.colors.surfaceElevated,
          borderRadius: 12,
          padding: 16,
          marginTop: 8,
        }}
      >
        <Text
          style={{
            fontSize: 12,
            fontFamily: "Poppins_400Regular",
            color: theme.colors.textSecondary,
            textAlign: "center",
          }}
        >
          {propertySubtype
            ? `Selected: ${propertySubtype} for ${listingType}`
            : "Select a property type to continue"}
        </Text>
      </View>
    </ScrollView>
  );
}