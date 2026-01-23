// components/PostProperty/PricingOthersStep.js
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { Check, AlertCircle, Star, Home, MapPin, DollarSign, CheckCircle } from "lucide-react-native";

export function PricingOthersStep({
  theme,
  description,
  setDescription,
  privateNotes,
  setPrivateNotes,
  approvedBy,
  toggleApprovedBy,
  amenities,
  toggleAmenity,
  amenitiesOptions,
  approvedOptions,
  listingType,
  propertySubtype,
  price,
  propertyName,
  city,
  locality,
  // Property type flags
  isPlotOrLand,
  isFlatOrVilla,
}) {
  const calculateScore = () => {
    let score = 0;

    // Basic details
    if (propertySubtype) score += 10;
    if (listingType) score += 10;
    if (city && locality) score += 10;

    // Property profile
    if (price) score += 20;
    if (description && description.length >= 10) score += 10;

    // Additional points
    if (propertyName && propertyName.length >= 10) score += 10;
    if (approvedBy.length > 0) score += 10;
    if (amenities.length > 0) score += 10;

    // Media (assumed)
    score += 20;

    return Math.min(score, 100);
  };

  const score = calculateScore();

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
        Pricing & Other Details
      </Text>

      {/* Property Score */}
      <View
        style={{
          backgroundColor: theme.colors.primary + "10",
          borderRadius: 12,
          padding: 16,
          marginBottom: 24,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 12,
            fontFamily: "Poppins_500Medium",
            color: theme.colors.primary,
            marginBottom: 8,
          }}
        >
          PROPERTY COMPLETION SCORE
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <View
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              backgroundColor: theme.colors.primary,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontFamily: "Poppins_700Bold",
                color: "#FFFFFF",
              }}
            >
              {score}%
            </Text>
          </View>
          <Text
            style={{
              flex: 1,
              fontSize: 13,
              fontFamily: "Poppins_400Regular",
              color: theme.colors.text,
            }}
          >
            {score >= 80
              ? "Great! Your property is ready to publish"
              : score >= 60
                ? "Good job! Add more details for better visibility"
                : "Add more details to improve your property listing"}
          </Text>
        </View>
      </View>

      {/* Description */}
      <View style={{ marginBottom: 24 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Poppins_500Medium",
              color: theme.colors.text,
            }}
          >
            Property Description *
          </Text>
          <Text
            style={{
              fontSize: 12,
              fontFamily: "Poppins_400Regular",
              color: description.length >= 10 ? theme.colors.success : theme.colors.textSecondary,
            }}
          >
            {description.length}/10+ characters
          </Text>
        </View>

        <TextInput
          style={{
            backgroundColor: theme.colors.input,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: description.length > 0 && description.length < 10 ? theme.colors.error : theme.colors.border,
            paddingHorizontal: 16,
            paddingVertical: 14,
            fontSize: 14,
            fontFamily: "Poppins_400Regular",
            color: theme.colors.text,
            minHeight: 120,
            textAlignVertical: "top",
          }}
          placeholder="Describe your property (minimum 10 characters)..."
          placeholderTextColor={theme.colors.placeholder}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={6}
        />

        {description.length > 0 && description.length < 10 && (
          <Text
            style={{
              fontSize: 12,
              fontFamily: "Poppins_400Regular",
              color: theme.colors.error,
              marginTop: 4,
            }}
          >
            Minimum 10 characters required ({10 - description.length} more)
          </Text>
        )}
        {description.length >= 10 && (
          <Text
            style={{
              fontSize: 12,
              fontFamily: "Poppins_400Regular",
              color: theme.colors.success,
              marginTop: 4,
            }}
          >
            ✓ Description meets requirements
          </Text>
        )}
      </View>

      {/* Private Notes */}
      <View style={{ marginBottom: 24 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Poppins_500Medium",
              color: theme.colors.text,
            }}
          >
            Private Notes (Optional)
          </Text>
          <Text
            style={{
              fontSize: 12,
              fontFamily: "Poppins_400Regular",
              color: theme.colors.textSecondary,
            }}
          >
            {privateNotes.length}/100
          </Text>
        </View>

        <TextInput
          style={{
            backgroundColor: theme.colors.input,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: theme.colors.border,
            paddingHorizontal: 16,
            paddingVertical: 14,
            fontSize: 14,
            fontFamily: "Poppins_400Regular",
            color: theme.colors.text,
            minHeight: 80,
            textAlignVertical: "top",
          }}
          placeholder="Private notes (visible only to you)"
          placeholderTextColor={theme.colors.placeholder}
          value={privateNotes}
          onChangeText={setPrivateNotes}
          multiline
          numberOfLines={4}
          maxLength={100}
        />

        <Text
          style={{
            fontSize: 11,
            fontFamily: "Poppins_400Regular",
            color: theme.colors.textSecondary,
            marginTop: 4,
          }}
        >
          Private notes won't appear on the frontend
        </Text>
      </View>

      {/* Approved By (Conditional) */}
      {((propertySubtype === 'Flat/Apartment' ||
        propertySubtype === 'Plot' ||
        propertySubtype === 'Independent House / Villa' ||
        propertySubtype === 'IndependentHouse/Villa') &&
        listingType.toLowerCase() === "sale") && (
          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: "Poppins_600SemiBold",
                color: theme.colors.text,
                marginBottom: 12,
              }}
            >
              Approved By
            </Text>

            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {approvedOptions.map((option) => {
                const isSelected = approvedBy.split(", ").includes(option);
                return (
                  <TouchableOpacity
                    key={option}
                    onPress={() => toggleApprovedBy(option)}
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 10,
                      borderRadius: 20,
                      borderWidth: 2,
                      borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                      backgroundColor: isSelected ? theme.colors.primary : "transparent",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 6,
                    }}
                    activeOpacity={0.7}
                  >
                    {isSelected && <Check size={14} color="#FFFFFF" />}
                    <Text
                      style={{
                        fontSize: 13,
                        fontFamily: "Poppins_500Medium",
                        color: isSelected ? "#FFFFFF" : theme.colors.text,
                      }}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

      {/* Amenities */}
      {(isFlatOrVilla || isPlotOrLand) && (
        <View style={{ marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 16,
              fontFamily: "Poppins_600SemiBold",
              color: theme.colors.text,
              marginBottom: 12,
            }}
          >
            Amenities
          </Text>

          <View style={{ gap: 10 }}>
            {amenitiesOptions.map((amenity) => {
              const isSelected = amenities.includes(amenity);
              return (
                <TouchableOpacity
                  key={amenity}
                  onPress={() => toggleAmenity(amenity)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    padding: 12,
                    borderRadius: 8,
                    backgroundColor: theme.colors.surface,
                    borderWidth: 1,
                    borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                  }}
                  activeOpacity={0.7}
                >
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 4,
                      borderWidth: 2,
                      borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                      backgroundColor: isSelected ? theme.colors.primary : "transparent",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 12,
                    }}
                  >
                    {isSelected && <Check size={12} color="#FFFFFF" />}
                  </View>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: "Poppins_400Regular",
                      color: theme.colors.text,
                    }}
                  >
                    {amenity}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      {/* Property Summary */}
      <View
        style={{
          backgroundColor: theme.colors.surfaceElevated,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: theme.colors.border,
          padding: 16,
          marginBottom: 24,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontFamily: "Poppins_600SemiBold",
            color: theme.colors.text,
            marginBottom: 16,
          }}
        >
          Property Summary
        </Text>

        <View style={{ gap: 12 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Home size={16} color={theme.colors.textSecondary} />
            <Text style={{ fontSize: 14, fontFamily: "Poppins_400Regular", color: theme.colors.text, flex: 1 }}>
              {propertySubtype || "Not specified"}
            </Text>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <MapPin size={16} color={theme.colors.textSecondary} />
            <Text style={{ fontSize: 14, fontFamily: "Poppins_400Regular", color: theme.colors.text, flex: 1 }}>
              {city && locality ? `${locality}, ${city}` : "Location not specified"}
            </Text>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <DollarSign size={16} color={theme.colors.textSecondary} />
            <Text style={{ fontSize: 14, fontFamily: "Poppins_500Medium", color: theme.colors.primary, flex: 1 }}>
              {price ? `₹${price}` : "Price not set"}
            </Text>
          </View>

          {propertyName && (
            <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 8 }}>
              <Star size={16} color={theme.colors.textSecondary} />
              <Text style={{ fontSize: 14, fontFamily: "Poppins_400Regular", color: theme.colors.text, flex: 1 }}>
                {propertyName}
              </Text>
            </View>
          )}

          {approvedBy && approvedBy.length > 0 && (
            <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 8 }}>
              <CheckCircle size={16} color={theme.colors.textSecondary} />
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Poppins_400Regular",
                  color: theme.colors.text,
                  flex: 1,
                }}
              >
                Approved by: {approvedBy}
              </Text>
            </View>
          )}

          {amenities.length > 0 && (
            <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 8 }}>
              <Check size={16} color={theme.colors.textSecondary} />
              <Text style={{ fontSize: 14, fontFamily: "Poppins_400Regular", color: theme.colors.text, flex: 1 }}>
                Amenities: {amenities.join(", ")}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Final Info */}
      <View
        style={{
          backgroundColor: theme.colors.surface,
          borderRadius: 12,
          padding: 16,
          marginBottom: 20,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
          <AlertCircle size={18} color={theme.colors.warning} />
          <Text
            style={{
              fontSize: 13,
              fontFamily: "Poppins_500Medium",
              color: theme.colors.text,
              flex: 1,
            }}
          >
            Ready to Publish
          </Text>
        </View>
        <Text
          style={{
            fontSize: 12,
            fontFamily: "Poppins_400Regular",
            color: theme.colors.textSecondary,
          }}
        >
          Your property will be reviewed by our team and will be live within 24 hours after verification. Make sure all details are accurate.
        </Text>
      </View>

      {/* Required Fields Note */}
      <Text
        style={{
          fontSize: 11,
          fontFamily: "Poppins_400Regular",
          color: theme.colors.textSecondary,
          textAlign: "center",
          marginTop: 8,
        }}
      >
        * indicates mandatory fields
      </Text>
    </ScrollView>
  );
}