// components/PostProperty/PropertyProfileStep.js
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { Bed, Bath, Car, Home, Plus, X, Building, MapPin } from "lucide-react-native";
import { Picker } from "@react-native-picker/picker"; // Add this import

export function PropertyProfileStep({
  theme,
  // Plot/Land fields
  plotArea,
  setPlotArea,
  landArea,
  setLandArea,
  plotAreaUnit,
  setPlotAreaUnit,
  length,
  setLength,
  breadth,
  setBreadth,
  facing,
  setFacing,
  frontage,
  setFrontage,
  price,
  setPrice,
  advance,
  setAdvance,
  
  // Residential fields
  bedrooms,
  setBedrooms,
  bathrooms,
  setBathrooms,
  balconies,
  setBalconies,
  poojaRoom,
  setPoojaRoom,
  carpetArea,
  setCarpetArea,
  builtArea,
  setBuiltArea,
  superBuiltArea,
  setSuperBuiltArea,
  areaUnit,
  setAreaUnit,
  parkingType,
  setParkingType,
  closedParking,
  setClosedParking,
  openParking,
  setOpenParking,
  status,
  setStatus,
  possession,
  setPossession,
  ageOfProperty,
  setAgeOfProperty,
  flatNumber,
  setFlatNumber,
  units,
  setUnits,
  officeNumber,
  setOfficeNumber,
  shopNumber,
  setShopNumber,
  totalFloors,
  setTotalFloors,
  propertyOnFloor,
  setPropertyOnFloor,
  
  // Commercial fields
  roadWidth,
  setRoadWidth,
  cornerShop,
  setCornerShop,
  pantryAvailable,
  setPantryAvailable,
  washroomAvailable,
  setWashroomAvailable,
  liftAvailable,
  setLiftAvailable,
  powerBackup,
  setPowerBackup,
  acAvailable,
  setAcAvailable,
  furnishedStatus,
  setFurnishedStatus,
  cabins,
  setCabins,
  conferenceRooms,
  setConferenceRooms,
  workstations,
  setWorkstations,
  parkingSpaces,
  setParkingSpaces,
  securityAvailable,
  setSecurityAvailable,
  waterSupply,
  setWaterSupply,
  
  // Property type info
  listingType,
  propertySubtype,
  isPlotOrLand,
  isLand,
  isFlatOrVilla,
  isVilla,
  isFlat,
  isPlot,
  isOfficeSpace,
  isShopShowroom,
  needsFloorDetails,
  needsUnitNumber,
  canHaveCommercialAddons,
  facingOptions,
}) {
  const areaUnits = ["sq yards", "sq ft", "sq meters", "acres", "cents"];
  const residentialAreaUnits = ["sqft", "sqyd", "sqm"];
  const availabilityOptions = ["Ready to Move", "Under Construction"];
  const furnishedOptions = ["Furnished", "Semi-Furnished", "Unfurnished"];
  const waterSupplyOptions = ["24x7", "Limited", "Borewell"];
  const parkingOptions = ["Covered", "Open", "Both", "None"];

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
        Property Profile
      </Text>

      {isPlotOrLand ? (
        // Plot/Land Form
        <>
          {/* Price */}
          <View style={{ marginBottom: 20 }}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Poppins_500Medium",
                color: theme.colors.text,
                marginBottom: 8,
              }}
            >
              {listingType?.toLowerCase() === 'sale' ? "Price" : "Rent"} (₹) *
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
              placeholder="Enter property price"
              placeholderTextColor={theme.colors.placeholder}
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
            />
          </View>

          {/* Area Fields */}
          <View style={{ marginBottom: 20 }}>
            <View style={{ flexDirection: "row", gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "Poppins_500Medium",
                    color: theme.colors.text,
                    marginBottom: 8,
                  }}
                >
                  {isPlot ? "Plot Area" : "Land Area"} *
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
                  placeholder="Enter area"
                  placeholderTextColor={theme.colors.placeholder}
                  value={isPlot ? plotArea : landArea}
                  onChangeText={isPlot ? setPlotArea : setLandArea}
                  keyboardType="numeric"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "Poppins_500Medium",
                    color: theme.colors.text,
                    marginBottom: 8,
                  }}
                >
                  Unit *
                </Text>
                <View
                  style={{
                    backgroundColor: theme.colors.input,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: theme.colors.border,
                  }}
                >
                  <Picker
                    selectedValue={plotAreaUnit}
                    onValueChange={setPlotAreaUnit}
                    style={{
                      color: theme.colors.text,
                      fontSize: 14,
                      fontFamily: "Poppins_400Regular",
                    }}
                  >
                    {areaUnits.map((unit) => (
                      <Picker.Item key={unit} label={unit} value={unit} />
                    ))}
                  </Picker>
                </View>
              </View>
            </View>
            
            {price && (plotArea || landArea) && (
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: "Poppins_500Medium",
                  color: theme.colors.primary,
                  marginTop: 8,
                }}
              >
                {Math.round(price / (isPlot ? plotArea : landArea))} per {plotAreaUnit}
              </Text>
            )}
          </View>

          {!isLand ? (
            // Plot-specific fields
            <>
              <View style={{ flexDirection: "row", gap: 12, marginBottom: 20 }}>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: "Poppins_500Medium",
                      color: theme.colors.text,
                      marginBottom: 8,
                    }}
                  >
                    Length (ft) *
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
                    placeholder="Length"
                    placeholderTextColor={theme.colors.placeholder}
                    value={length}
                    onChangeText={setLength}
                    keyboardType="numeric"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: "Poppins_500Medium",
                      color: theme.colors.text,
                      marginBottom: 8,
                    }}
                  >
                    Width (ft) *
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
                    placeholder="Width"
                    placeholderTextColor={theme.colors.placeholder}
                    value={breadth}
                    onChangeText={setBreadth}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              {/* Facing */}
              <View style={{ marginBottom: 20 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "Poppins_500Medium",
                    color: theme.colors.text,
                    marginBottom: 12,
                  }}
                >
                  Facing *
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexDirection: "row", gap: 8 }}>
                  {facingOptions.map((option) => (
                    <TouchableOpacity
                      key={option}
                      onPress={() => setFacing(option)}
                      style={{
                        paddingHorizontal: 16,
                        paddingVertical: 10,
                        borderRadius: 20,
                        borderWidth: 2,
                        borderColor: facing === option ? theme.colors.primary : theme.colors.border,
                        backgroundColor: facing === option ? theme.colors.primary : "transparent",
                      }}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={{
                          fontSize: 13,
                          fontFamily: "Poppins_500Medium",
                          color: facing === option ? "#FFFFFF" : theme.colors.text,
                        }}
                      >
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </>
          ) : (
            // Land-specific fields
            <View style={{ marginBottom: 20 }}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Poppins_500Medium",
                  color: theme.colors.text,
                  marginBottom: 8,
                }}
              >
                Roadfacing (ft) *
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
                placeholder="e.g., 100"
                placeholderTextColor={theme.colors.placeholder}
                value={frontage}
                onChangeText={setFrontage}
                keyboardType="numeric"
              />
            </View>
          )}
        </>
      ) : (
        // Residential/Commercial Form
        <>
          {/* Bedrooms (for residential) */}
          {isFlatOrVilla && (
            <View style={{ marginBottom: 20 }}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Poppins_500Medium",
                  color: theme.colors.text,
                  marginBottom: 12,
                }}
              >
                Bedrooms *
              </Text>
              <View style={{ flexDirection: "row", gap: 8 }}>
                {[1, 2, 3, 4, 5].map((num) => (
                  <TouchableOpacity
                    key={num}
                    onPress={() => setBedrooms(num)}
                    style={{
                      flex: 1,
                      paddingVertical: 12,
                      borderRadius: 8,
                      borderWidth: 2,
                      borderColor: bedrooms === num ? theme.colors.primary : theme.colors.border,
                      backgroundColor: bedrooms === num ? theme.colors.primary : "transparent",
                      alignItems: "center",
                    }}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: "Poppins_500Medium",
                        color: bedrooms === num ? "#FFFFFF" : theme.colors.text,
                      }}
                    >
                      {num} BHK
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Bathrooms (for residential) */}
          {isFlatOrVilla && (
            <View style={{ marginBottom: 20 }}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Poppins_500Medium",
                  color: theme.colors.text,
                  marginBottom: 12,
                }}
              >
                Bathrooms *
              </Text>
              <View style={{ flexDirection: "row", gap: 8 }}>
                {[1, 2, 3, 4, 5].map((num) => (
                  <TouchableOpacity
                    key={num}
                    onPress={() => setBathrooms(num)}
                    style={{
                      flex: 1,
                      paddingVertical: 12,
                      borderRadius: 8,
                      borderWidth: 2,
                      borderColor: bathrooms === num ? theme.colors.primary : theme.colors.border,
                      backgroundColor: bathrooms === num ? theme.colors.primary : "transparent",
                      alignItems: "center",
                    }}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: "Poppins_500Medium",
                        color: bathrooms === num ? "#FFFFFF" : theme.colors.text,
                      }}
                    >
                      {num}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Price */}
          <View style={{ marginBottom: 20 }}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Poppins_500Medium",
                color: theme.colors.text,
                marginBottom: 8,
              }}
            >
              Price (₹) *
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
              placeholder="Enter property price"
              placeholderTextColor={theme.colors.placeholder}
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
            />
          </View>

          {/* Area Details */}
          <View style={{ marginBottom: 20 }}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: "Poppins_600SemiBold",
                color: theme.colors.text,
                marginBottom: 12,
              }}
            >
              Area Details *
            </Text>
            
            {/* Carpet Area */}
            <View style={{ marginBottom: 16 }}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Poppins_500Medium",
                  color: theme.colors.text,
                  marginBottom: 8,
                }}
              >
                Carpet Area
              </Text>
              <View style={{ flexDirection: "row", gap: 12 }}>
                <View style={{ flex: 1 }}>
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
                    placeholder="Enter area"
                    placeholderTextColor={theme.colors.placeholder}
                    value={carpetArea}
                    onChangeText={setCarpetArea}
                    keyboardType="numeric"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <View
                    style={{
                      backgroundColor: theme.colors.input,
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: theme.colors.border,
                    }}
                  >
                    <Picker
                      selectedValue={areaUnit}
                      onValueChange={setAreaUnit}
                      style={{
                        color: theme.colors.text,
                        fontSize: 14,
                        fontFamily: "Poppins_400Regular",
                      }}
                    >
                      {residentialAreaUnits.map((unit) => (
                        <Picker.Item key={unit} label={unit} value={unit} />
                      ))}
                    </Picker>
                  </View>
                </View>
              </View>
              {price && carpetArea && (
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: "Poppins_500Medium",
                    color: theme.colors.primary,
                    marginTop: 8,
                  }}
                >
                  {Math.round(price / carpetArea)} per {areaUnit}
                </Text>
              )}
            </View>

            {/* Additional Area Options */}
            <View style={{ gap: 12 }}>
              {!builtArea && (
                <TouchableOpacity
                  onPress={() => setBuiltArea("")}
                  style={{
                    paddingVertical: 12,
                    borderWidth: 1,
                    borderStyle: "dashed",
                    borderColor: theme.colors.primary,
                    borderRadius: 8,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
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
                    Add Built-up Area
                  </Text>
                </TouchableOpacity>
              )}

              {!superBuiltArea && (
                <TouchableOpacity
                  onPress={() => setSuperBuiltArea("")}
                  style={{
                    paddingVertical: 12,
                    borderWidth: 1,
                    borderStyle: "dashed",
                    borderColor: theme.colors.primary,
                    borderRadius: 8,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
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
                    Add Super Built-up Area
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Built Area (if added) */}
            {builtArea !== null && builtArea !== undefined && (
              <View style={{ marginTop: 12 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: "Poppins_500Medium",
                      color: theme.colors.text,
                    }}
                  >
                    Built-up Area
                  </Text>
                  <TouchableOpacity onPress={() => setBuiltArea(null)}>
                    <X size={18} color={theme.colors.error} />
                  </TouchableOpacity>
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
                  }}
                  placeholder="Enter built-up area"
                  placeholderTextColor={theme.colors.placeholder}
                  value={builtArea}
                  onChangeText={setBuiltArea}
                  keyboardType="numeric"
                />
              </View>
            )}

            {/* Super Built Area (if added) */}
            {superBuiltArea !== null && superBuiltArea !== undefined && (
              <View style={{ marginTop: 12 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: "Poppins_500Medium",
                      color: theme.colors.text,
                    }}
                  >
                    Super Built-up Area
                  </Text>
                  <TouchableOpacity onPress={() => setSuperBuiltArea(null)}>
                    <X size={18} color={theme.colors.error} />
                  </TouchableOpacity>
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
                  }}
                  placeholder="Enter super built-up area"
                  placeholderTextColor={theme.colors.placeholder}
                  value={superBuiltArea}
                  onChangeText={setSuperBuiltArea}
                  keyboardType="numeric"
                />
              </View>
            )}
          </View>

          {/* Parking */}
          <View style={{ marginBottom: 20 }}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Poppins_500Medium",
                color: theme.colors.text,
                marginBottom: 12,
              }}
            >
              Parking *
            </Text>
            <View style={{ flexDirection: "row", gap: 16 }}>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: "Poppins_400Regular",
                    color: theme.colors.textSecondary,
                    marginBottom: 4,
                  }}
                >
                  Closed
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <TouchableOpacity
                    onPress={() => setClosedParking(Math.max(0, closedParking - 1))}
                    style={{
                      padding: 12,
                      backgroundColor: theme.colors.surface,
                      borderTopLeftRadius: 8,
                      borderBottomLeftRadius: 8,
                      borderWidth: 1,
                      borderColor: theme.colors.border,
                    }}
                  >
                    <Text style={{ fontSize: 16, fontFamily: "Poppins_500Medium" }}>-</Text>
                  </TouchableOpacity>
                  <View
                    style={{
                      flex: 1,
                      padding: 12,
                      backgroundColor: theme.colors.input,
                      borderWidth: 1,
                      borderColor: theme.colors.border,
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ fontSize: 16, fontFamily: "Poppins_500Medium" }}>{closedParking}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setClosedParking(closedParking + 1)}
                    style={{
                      padding: 12,
                      backgroundColor: theme.colors.surface,
                      borderTopRightRadius: 8,
                      borderBottomRightRadius: 8,
                      borderWidth: 1,
                      borderColor: theme.colors.border,
                    }}
                  >
                    <Text style={{ fontSize: 16, fontFamily: "Poppins_500Medium" }}>+</Text>
                  </TouchableOpacity>
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
                  Open
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <TouchableOpacity
                    onPress={() => setOpenParking(Math.max(0, openParking - 1))}
                    style={{
                      padding: 12,
                      backgroundColor: theme.colors.surface,
                      borderTopLeftRadius: 8,
                      borderBottomLeftRadius: 8,
                      borderWidth: 1,
                      borderColor: theme.colors.border,
                    }}
                  >
                    <Text style={{ fontSize: 16, fontFamily: "Poppins_500Medium" }}>-</Text>
                  </TouchableOpacity>
                  <View
                    style={{
                      flex: 1,
                      padding: 12,
                      backgroundColor: theme.colors.input,
                      borderWidth: 1,
                      borderColor: theme.colors.border,
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ fontSize: 16, fontFamily: "Poppins_500Medium" }}>{openParking}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setOpenParking(openParking + 1)}
                    style={{
                      padding: 12,
                      backgroundColor: theme.colors.surface,
                      borderTopRightRadius: 8,
                      borderBottomRightRadius: 8,
                      borderWidth: 1,
                      borderColor: theme.colors.border,
                    }}
                  >
                    <Text style={{ fontSize: 16, fontFamily: "Poppins_500Medium" }}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          {/* Floor Details */}
          {needsFloorDetails && (
            <View style={{ marginBottom: 20 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: "Poppins_600SemiBold",
                  color: theme.colors.text,
                  marginBottom: 12,
                }}
              >
                Floor Details
              </Text>
              <View style={{ flexDirection: "row", gap: 12 }}>
                {!isVilla && (
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: "Poppins_500Medium",
                        color: theme.colors.text,
                        marginBottom: 8,
                      }}
                    >
                      Property on Floor
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
                      placeholder="Floor number"
                      placeholderTextColor={theme.colors.placeholder}
                      value={propertyOnFloor}
                      onChangeText={setPropertyOnFloor}
                      keyboardType="numeric"
                    />
                  </View>
                )}
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: "Poppins_500Medium",
                      color: theme.colors.text,
                      marginBottom: 8,
                    }}
                  >
                    Total Floors
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
                    placeholder="Total floors"
                    placeholderTextColor={theme.colors.placeholder}
                    value={totalFloors}
                    onChangeText={setTotalFloors}
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </View>
          )}

          {/* Availability Status */}
          <View style={{ marginBottom: 20 }}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Poppins_500Medium",
                color: theme.colors.text,
                marginBottom: 12,
              }}
            >
              Availability Status *
            </Text>
            <View style={{ flexDirection: "row", gap: 12 }}>
              {availabilityOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  onPress={() => setStatus(option)}
                  style={{
                    flex: 1,
                    paddingVertical: 12,
                    borderRadius: 8,
                    borderWidth: 2,
                    borderColor: status === option ? theme.colors.primary : theme.colors.border,
                    backgroundColor: status === option ? theme.colors.primary : "transparent",
                    alignItems: "center",
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: "Poppins_500Medium",
                      color: status === option ? "#FFFFFF" : theme.colors.text,
                    }}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Age or Possession */}
          {status === "Ready to Move" && (
            <View style={{ marginBottom: 20 }}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Poppins_500Medium",
                  color: theme.colors.text,
                  marginBottom: 8,
                }}
              >
                Age of Property (years) *
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
                placeholder="Enter age in years"
                placeholderTextColor={theme.colors.placeholder}
                value={ageOfProperty}
                onChangeText={setAgeOfProperty}
                keyboardType="numeric"
              />
            </View>
          )}

          {status === "Under Construction" && (
            <View style={{ marginBottom: 20 }}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Poppins_500Medium",
                  color: theme.colors.text,
                  marginBottom: 8,
                }}
              >
                Possession (months) *
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
                placeholder="Enter months"
                placeholderTextColor={theme.colors.placeholder}
                value={possession}
                onChangeText={setPossession}
                keyboardType="numeric"
              />
            </View>
          )}

          {/* Commercial Features (if applicable) */}
          {canHaveCommercialAddons && (
            <View style={{ marginTop: 20, paddingTop: 16, borderTopWidth: 1, borderTopColor: theme.colors.border }}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: "Poppins_600SemiBold",
                  color: theme.colors.text,
                  marginBottom: 12,
                }}
              >
                Commercial Features (Optional)
              </Text>
              
              {/* Road Width */}
              <View style={{ marginBottom: 16 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "Poppins_500Medium",
                    color: theme.colors.text,
                    marginBottom: 8,
                  }}
                >
                  Road Width (ft)
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
                  placeholder="Enter road width"
                  placeholderTextColor={theme.colors.placeholder}
                  value={roadWidth}
                  onChangeText={setRoadWidth}
                  keyboardType="numeric"
                />
              </View>

              {/* Commercial checkboxes */}
              <View style={{ gap: 12, marginBottom: 16 }}>
                {isShopShowroom && (
                  <TouchableOpacity
                    onPress={() => setCornerShop(!cornerShop)}
                    style={{ flexDirection: "row", alignItems: "center" }}
                    activeOpacity={0.7}
                  >
                    <View
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 4,
                        borderWidth: 2,
                        borderColor: cornerShop ? theme.colors.primary : theme.colors.border,
                        backgroundColor: cornerShop ? theme.colors.primary : "transparent",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: 12,
                      }}
                    >
                      {cornerShop && <Text style={{ color: "#FFFFFF", fontSize: 12 }}>✓</Text>}
                    </View>
                    <Text style={{ fontSize: 14, fontFamily: "Poppins_400Regular", color: theme.colors.text }}>
                      Corner Shop
                    </Text>
                  </TouchableOpacity>
                )}

                {["pantryAvailable", "washroomAvailable", "liftAvailable", "powerBackup", "acAvailable", "securityAvailable"].map((field) => {
                  const value = eval(field);
                  const setValue = eval(`set${field.charAt(0).toUpperCase() + field.slice(1)}`);
                  const label = field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                  
                  return (
                    <TouchableOpacity
                      key={field}
                      onPress={() => setValue(!value)}
                      style={{ flexDirection: "row", alignItems: "center" }}
                      activeOpacity={0.7}
                    >
                      <View
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: 4,
                          borderWidth: 2,
                          borderColor: value ? theme.colors.primary : theme.colors.border,
                          backgroundColor: value ? theme.colors.primary : "transparent",
                          alignItems: "center",
                          justifyContent: "center",
                          marginRight: 12,
                        }}
                      >
                        {value && <Text style={{ color: "#FFFFFF", fontSize: 12 }}>✓</Text>}
                      </View>
                      <Text style={{ fontSize: 14, fontFamily: "Poppins_400Regular", color: theme.colors.text }}>
                        {label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Furnished Status */}
              <View style={{ marginBottom: 16 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "Poppins_500Medium",
                    color: theme.colors.text,
                    marginBottom: 8,
                  }}
                >
                  Furnished Status
                </Text>
                <View style={{ flexDirection: "row", gap: 8 }}>
                  {furnishedOptions.map((option) => (
                    <TouchableOpacity
                      key={option}
                      onPress={() => setFurnishedStatus(option)}
                      style={{
                        flex: 1,
                        paddingVertical: 10,
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: furnishedStatus === option ? theme.colors.primary : theme.colors.border,
                        backgroundColor: furnishedStatus === option ? theme.colors.primary : "transparent",
                        alignItems: "center",
                      }}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          fontFamily: "Poppins_500Medium",
                          color: furnishedStatus === option ? "#FFFFFF" : theme.colors.text,
                        }}
                      >
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Water Supply */}
              <View style={{ marginBottom: 16 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "Poppins_500Medium",
                    color: theme.colors.text,
                    marginBottom: 8,
                  }}
                >
                  Water Supply
                </Text>
                <View style={{ flexDirection: "row", gap: 8 }}>
                  {waterSupplyOptions.map((option) => (
                    <TouchableOpacity
                      key={option}
                      onPress={() => setWaterSupply(option)}
                      style={{
                        flex: 1,
                        paddingVertical: 10,
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: waterSupply === option ? theme.colors.primary : theme.colors.border,
                        backgroundColor: waterSupply === option ? theme.colors.primary : "transparent",
                        alignItems: "center",
                      }}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          fontFamily: "Poppins_500Medium",
                          color: waterSupply === option ? "#FFFFFF" : theme.colors.text,
                        }}
                      >
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Office-specific fields */}
              {isOfficeSpace && (
                <View style={{ gap: 12 }}>
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
                    placeholder="Number of cabins"
                    placeholderTextColor={theme.colors.placeholder}
                    value={cabins}
                    onChangeText={setCabins}
                    keyboardType="numeric"
                  />
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
                    placeholder="Number of conference rooms"
                    placeholderTextColor={theme.colors.placeholder}
                    value={conferenceRooms}
                    onChangeText={setConferenceRooms}
                    keyboardType="numeric"
                  />
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
                    placeholder="Number of workstations"
                    placeholderTextColor={theme.colors.placeholder}
                    value={workstations}
                    onChangeText={setWorkstations}
                    keyboardType="numeric"
                  />
                </View>
              )}
            </View>
          )}
        </>
      )}

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
          Fill all required fields (*) to continue
          {isPlotOrLand ? "\nPlot/Land details are crucial for accurate pricing" : 
           "\nAccurate property specifications help attract genuine buyers"}
        </Text>
      </View>
    </ScrollView>
  );
}