// components/PostProperty/LocationDetailsStep.js
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { MapPin, Home, Navigation, Plus, X } from "lucide-react-native";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import ApiService from "../ApiService";

export function LocationDetailsStep({
  theme,
  propertyName,
  setPropertyName,
  city,
  setCity,
  locality,
  setLocality,
  subLocality,
  setSubLocality,
  apartmentDoorNo,
  setApartmentDoorNo,
  roadFacing,
  setRoadFacing,
  pincode,
  setPincode,
  lat,
  setLat,
  lon,
  setLon,
  advantages,
  addAdvantage,
  removeAdvantage,
  updateAdvantage,
  propertySubtype,
  listingType,
}) {
  const isLand = propertySubtype?.toLowerCase().includes("land") ||
    propertySubtype?.toLowerCase().includes("plot");
  const isProjectNameRequired = !((propertySubtype || "").toLowerCase().includes("land") ||
    listingType.toLowerCase() === "rent");

  // Sample cities and localities (in real app, fetch from API)
  const [cities, setCities] = useState([]);
  const [localities, setLocalities] = useState([]);
  const [loading, setLoading] = useState(false);

  const advantageDistances = ["250 m", "500 m", "1 km", "2 km", "5 km"];

  useEffect(() => {
    const fetchCities = async () => {
      setLoading(true);
      try {
        const res = await ApiService.get("/city", {
          headers: { "Content-Type": "application/json" },
        });

        // Default city logic
        if (!city) {
          const defaultCity = res.find(
            (c) => c.city.toLowerCase() === "visakhapatnam"
          );

          if (defaultCity) {
            setCity(defaultCity.city);
            setLocalities(defaultCity.locality);
          }
        }

        setCities(res);
      } catch (err) {
        console.error("Error fetching cities:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  useEffect(() => {
    if (city && cities.length > 0) {
      const selectedCity = cities.find(
        (c) => c.city.toLowerCase() === city.toLowerCase()
      );

      if (selectedCity) {
        setLocalities(selectedCity.locality);

        // 🔑 Same rule as web
        if (locality && !selectedCity.locality.includes(locality)) {
          setLocality("");
        }
      }
    }
  }, [city, cities]);

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
        Location Details
      </Text>

      {/* Project Name (Conditional) */}
      {isProjectNameRequired && (
        <View style={{ marginBottom: 20 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Poppins_500Medium",
                color: theme.colors.text,
              }}
            >
              Project Name *
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontFamily: "Poppins_400Regular",
                color: propertyName.length > 50 ? theme.colors.error :
                  propertyName.length >= 10 ? theme.colors.success : theme.colors.textSecondary,
              }}
            >
              {propertyName.length}/50
            </Text>
          </View>

          <TextInput
            style={{
              backgroundColor: theme.colors.input,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: propertyName.length > 0 && propertyName.length < 10 ? theme.colors.error : theme.colors.border,
              paddingHorizontal: 16,
              paddingVertical: 14,
              fontSize: 14,
              fontFamily: "Poppins_400Regular",
              color: theme.colors.text,
            }}
            placeholder="e.g., D-201, property name"
            placeholderTextColor={theme.colors.placeholder}
            value={propertyName}
            onChangeText={setPropertyName}
            maxLength={50}
          />

          {propertyName.length > 0 && propertyName.length < 10 && (
            <Text
              style={{
                fontSize: 12,
                fontFamily: "Poppins_400Regular",
                color: theme.colors.error,
                marginTop: 4,
              }}
            >
              Minimum 10 characters required ({10 - propertyName.length} more)
            </Text>
          )}
          {propertyName.length >= 10 && (
            <Text
              style={{
                fontSize: 12,
                fontFamily: "Poppins_400Regular",
                color: theme.colors.success,
                marginTop: 4,
              }}
            >
              ✓ Project name meets requirements
            </Text>
          )}
        </View>
      )}

      {/* City */}
      <View style={{ marginBottom: 20 }}>
        <Text
          style={{
            fontSize: 14,
            fontFamily: "Poppins_500Medium",
            color: theme.colors.text,
            marginBottom: 8,
          }}
        >
          City *
        </Text>
        <View
          style={{
            backgroundColor: theme.colors.input,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: theme.colors.border,
          }}
        >
          <Picker selectedValue={city} onValueChange={setCity}>
            <Picker.Item label="Select a City" value="" />
            {cities.map((c) => (
              <Picker.Item key={c.id} label={c.city} value={c.city} />
            ))}
          </Picker>

        </View>
      </View>

      {/* Locality */}
      <View style={{ marginBottom: 20 }}>
        <Text
          style={{
            fontSize: 14,
            fontFamily: "Poppins_500Medium",
            color: theme.colors.text,
            marginBottom: 8,
          }}
        >
          Locality *
        </Text>
        <View
          style={{
            backgroundColor: theme.colors.input,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: !city ? theme.colors.border + "80" : theme.colors.border,
            opacity: !city ? 0.6 : 1,
          }}
        >
          <Picker
            selectedValue={locality}
            onValueChange={setLocality}
            enabled={!!city}
          >
            <Picker.Item
              label={city ? "Select a Locality" : "Select a City first"}
              value=""
            />
            {localities.map((loc, index) => (
              <Picker.Item key={index} label={loc} value={loc} />
            ))}
          </Picker>
        </View>
      </View>

      {/* Sub Locality / Village */}
      <View style={{ marginBottom: 20 }}>
        <Text
          style={{
            fontSize: 14,
            fontFamily: "Poppins_500Medium",
            color: theme.colors.text,
            marginBottom: 8,
          }}
        >
          {isLand ? "Village" : "Sub Locality"}
        </Text>
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
          }}
          placeholder={isLand ? "e.g., Village Name" : "e.g., Sector 5"}
          placeholderTextColor={theme.colors.placeholder}
          value={subLocality}
          onChangeText={setSubLocality}
        />
      </View>

      {/* Apartment/Society Name */}
      {!isLand && (propertySubtype === "Flat/Apartment" ||
        propertySubtype === "IndependentHouse/Villa" ||
        propertySubtype === "Independent House / Villa") && (
          <View style={{ marginBottom: 20 }}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Poppins_500Medium",
                color: theme.colors.text,
                marginBottom: 8,
              }}
            >
              {propertySubtype === "Flat/Apartment" ? "Apartment Name" : "Society / Villa Name"}
            </Text>
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
              }}
              placeholder="e.g., D-201, apartment/society name"
              placeholderTextColor={theme.colors.placeholder}
              value={apartmentDoorNo}
              onChangeText={setApartmentDoorNo}
            />
          </View>
        )}

      {/* Road Facing */}
      <View style={{ marginBottom: 20 }}>
        <Text
          style={{
            fontSize: 14,
            fontFamily: "Poppins_500Medium",
            color: theme.colors.text,
            marginBottom: 8,
          }}
        >
          Road Facing (ft) *
        </Text>
        <TextInput
          style={{
            backgroundColor: theme.colors.input,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: roadFacing && parseInt(roadFacing) <= 0 ? theme.colors.error : theme.colors.border,
            paddingHorizontal: 16,
            paddingVertical: 14,
            fontSize: 14,
            fontFamily: "Poppins_400Regular",
            color: theme.colors.text,
          }}
          placeholder="100"
          placeholderTextColor={theme.colors.placeholder}
          value={roadFacing}
          onChangeText={setRoadFacing}
          keyboardType="numeric"
        />
        {roadFacing && parseInt(roadFacing) <= 0 && (
          <Text
            style={{
              fontSize: 12,
              fontFamily: "Poppins_400Regular",
              color: theme.colors.error,
              marginTop: 4,
            }}
          >
            Road facing must be greater than 0
          </Text>
        )}
      </View>

      {/* Coordinates */}
      <View style={{ marginBottom: 24 }}>
        <Text
          style={{
            fontSize: 14,
            fontFamily: "Poppins_500Medium",
            color: theme.colors.text,
            marginBottom: 12,
          }}
        >
          Coordinates (Optional)
        </Text>
        <View style={{ flexDirection: "row", gap: 12 }}>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 12,
                fontFamily: "Poppins_400Regular",
                color: theme.colors.textSecondary,
                marginBottom: 4,
              }}
            >
              Latitude
            </Text>
            <TextInput
              style={{
                backgroundColor: theme.colors.input,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: theme.colors.border,
                paddingHorizontal: 16,
                paddingVertical: 12,
                fontSize: 14,
                fontFamily: "Poppins_400Regular",
                color: theme.colors.text,
              }}
              placeholder="17.6868"
              placeholderTextColor={theme.colors.placeholder}
              value={lat}
              onChangeText={setLat}
              keyboardType="decimal-pad"
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 12,
                fontFamily: "Poppins_400Regular",
                color: theme.colors.textSecondary,
                marginBottom: 4,
              }}
            >
              Longitude
            </Text>
            <TextInput
              style={{
                backgroundColor: theme.colors.input,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: theme.colors.border,
                paddingHorizontal: 16,
                paddingVertical: 12,
                fontSize: 14,
                fontFamily: "Poppins_400Regular",
                color: theme.colors.text,
              }}
              placeholder="83.2185"
              placeholderTextColor={theme.colors.placeholder}
              value={lon}
              onChangeText={setLon}
              keyboardType="decimal-pad"
            />
          </View>
        </View>

      </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 12,
                fontFamily: "Poppins_400Regular",
                color: theme.colors.textSecondary,
                marginBottom: 4,
              }}
            >
              Pincode
            </Text>
            <TextInput
              style={{
                backgroundColor: theme.colors.input,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: theme.colors.border,
                paddingHorizontal: 16,
                paddingVertical: 12,
                fontSize: 14,
                fontFamily: "Poppins_400Regular",
                color: theme.colors.text,
              }}
              placeholder="Pincode"
              placeholderTextColor={theme.colors.placeholder}
              value={pincode}
              onChangeText={setPincode}
              keyboardType="decimal-pad"
            />
          </View>
      {/* Location Advantages */}
      <View style={{ marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: theme.colors.border }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <Text
            style={{
              fontSize: 16,
              fontFamily: "Poppins_600SemiBold",
              color: theme.colors.text,
            }}
          >
            Location Advantages
          </Text>
          <Text
            style={{
              fontSize: 12,
              fontFamily: "Poppins_400Regular",
              color: advantages.length >= 8 ? theme.colors.error : theme.colors.textSecondary,
            }}
          >
            {advantages.length}/8
          </Text>
        </View>

        <Text
          style={{
            fontSize: 13,
            fontFamily: "Poppins_400Regular",
            color: theme.colors.textSecondary,
            marginBottom: 16,
          }}
        >
          Add nearby landmarks and distances
        </Text>

        {advantages.map((item, index) => (
          <View key={index} style={{ marginBottom: 12 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <TextInput
                style={{
                  flex: 1,
                  backgroundColor: theme.colors.input,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  fontSize: 14,
                  fontFamily: "Poppins_400Regular",
                  color: theme.colors.text,
                }}
                placeholder={[
                  "e.g., Near Supermarket",
                  "e.g., Close to School",
                  "e.g., Near Hospital",
                  "e.g., Bus Stop",
                  "e.g., Park",
                  "e.g., Restaurant",
                  "e.g., Highway",
                  "e.g., Other advantage"
                ][index] || "Nearby location"}
                placeholderTextColor={theme.colors.placeholder}
                value={item.info}
                onChangeText={(text) => updateAdvantage(index, "info", text)}
              />

              <View
                style={{
                  backgroundColor: theme.colors.input,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                  minWidth: 100,
                }}
              >
                <Picker
                  selectedValue={item.distance}
                  onValueChange={(value) => updateAdvantage(index, "distance", value)}
                  style={{
                    color: theme.colors.text,
                    fontSize: 13,
                    fontFamily: "Poppins_400Regular",
                  }}
                >
                  {advantageDistances.map((dist) => (
                    <Picker.Item key={dist} label={dist} value={dist} />
                  ))}
                </Picker>
              </View>

              {advantages.length > 1 && (
                <TouchableOpacity
                  onPress={() => removeAdvantage(index)}
                  style={{
                    padding: 10,
                    backgroundColor: theme.colors.error + "20",
                    borderRadius: 8,
                  }}
                  activeOpacity={0.7}
                >
                  <X size={18} color={theme.colors.error} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}

        {advantages.length < 8 && (
          <TouchableOpacity
            onPress={addAdvantage}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              paddingVertical: 12,
              borderWidth: 1,
              borderStyle: "dashed",
              borderColor: theme.colors.primary,
              borderRadius: 12,
              marginTop: 8,
            }}
            activeOpacity={0.7}
          >
            <Plus size={18} color={theme.colors.primary} />
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Poppins_500Medium",
                color: theme.colors.primary,
              }}
            >
              Add More Advantage
            </Text>
          </TouchableOpacity>
        )}

        {advantages.length >= 8 && (
          <Text
            style={{
              fontSize: 12,
              fontFamily: "Poppins_400Regular",
              color: theme.colors.error,
              marginTop: 8,
              textAlign: "center",
            }}
          >
            Maximum 8 advantages reached
          </Text>
        )}
      </View>

      {/* Info Box */}
      <View
        style={{
          backgroundColor: theme.colors.surfaceElevated,
          borderRadius: 12,
          padding: 16,
          marginTop: 20,
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
          Accurate location details help reach the right buyers
        </Text>
      </View>
    </ScrollView>
  );
}