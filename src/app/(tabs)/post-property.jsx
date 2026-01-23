// app/(screens)/post-property.js
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  useFonts,
  Poppins_600SemiBold,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { useTheme } from "@/utils/theme";
import { usePostPropertyForm } from "@/hooks/usePostPropertyForm";
import { StepIndicators } from "@/components/PostProperty/StepIndicators";
import { BasicDetailsStep } from "@/components/PostProperty/BasicDetailsStep";
import { LocationDetailsStep } from "@/components/PostProperty/LocationDetailsStep";
import { MediaUploadStep } from "@/components/PostProperty/MediaUploadStep";
import { PropertyProfileStep } from "@/components/PostProperty/PropertyProfileStep";
import { PricingOthersStep } from "@/components/PostProperty/PricingOthersStep";
import { BottomNavigation } from "@/components/PostProperty/BottomNavigation";

const steps = [
  { number: 1, title: "Basic Details" },
  { number: 2, title: "Location Details" },
  { number: 3, title: "Photos & Videos" },
  { number: 4, title: "Property Profile" },
  { number: 5, title: "Pricing & Others" },
];

export default function PostPropertyScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const {
    currentStep,
    // Step 1
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
    loadingCategories,
    selectedCategoryId,
    setSelectedCategoryId,

    // Step 2
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

    // Step 3
    photos,
    setPhotos,
    videos,
    setVideos,
    
    // Step 4
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

    // Step 5
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
    facingOptions,

    // Property type flags
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

    // Handlers
    handleNext,
    handleBack,
    handleSubmit,
  } = usePostPropertyForm();

  const [loaded, error] = useFonts({
    Poppins_600SemiBold,
    Poppins_500Medium,
    Poppins_400Regular,
    Poppins_700Bold,
  });

  if (!loaded && !error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  const getStepTitle = () => {
    const step = steps[currentStep - 1];
    return step ? step.title : "";
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar style={theme.statusBarStyle} />

      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + 16,
          paddingBottom: 16,
          paddingHorizontal: 20,
          backgroundColor: theme.colors.background,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.border,
        }}
      >
        <Text
          style={{
            fontSize: 28,
            fontFamily: "Poppins_600SemiBold",
            color: theme.colors.text,
          }}
        >
          Post Property
        </Text>
        <Text
          style={{
            fontSize: 14,
            fontFamily: "Poppins_400Regular",
            color: theme.colors.textSecondary,
            marginTop: 4,
          }}
        >
          Step {currentStep} of 5 - {getStepTitle()}
        </Text>
      </View>

      {/* Step Indicators */}
      <StepIndicators steps={steps} currentStep={currentStep} theme={theme} />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: 8,
          paddingBottom: insets.bottom + 120,
          paddingHorizontal: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Step 1: Basic Details */}
        {currentStep === 1 && (
          <BasicDetailsStep
            theme={theme}
            listingType={listingType}
            setListingType={setListingType}
            propertyType={propertyType}
            setPropertyType={setPropertyType}
            propertySubtype={propertySubtype}
            setPropertySubtype={setPropertySubtype}
            title={title}
            setTitle={setTitle}
            titleError={titleError}
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            setSelectedCategoryId={setSelectedCategoryId}
            getSubtypes={getSubtypes}
          />
        )}

        {/* Step 2: Location Details */}
        {currentStep === 2 && (
          <LocationDetailsStep
            theme={theme}
            propertyName={propertyName}
            setPropertyName={setPropertyName}
            city={city}
            setCity={setCity}
            locality={locality}
            setLocality={setLocality}
            subLocality={subLocality}
            setSubLocality={setSubLocality}
            apartmentDoorNo={apartmentDoorNo}
            setApartmentDoorNo={setApartmentDoorNo}
            roadFacing={roadFacing}
            setRoadFacing={setRoadFacing}
            pincode={pincode}
            setPincode={setPincode}
            lat={lat}
            setLat={setLat}
            lon={lon}
            setLon={setLon}
            advantages={advantages}
            addAdvantage={addAdvantage}
            removeAdvantage={removeAdvantage}
            updateAdvantage={updateAdvantage}
            propertySubtype={propertySubtype}
            listingType={listingType}
          />
        )}

        {/* Step 3: Photos & Videos */}
        {currentStep === 3 && (
          <MediaUploadStep
            theme={theme}
            photos={photos}
            setPhotos={setPhotos}
            videos={videos}
            setVideos={setVideos}
          />
        )}

        {/* Step 4: Property Profile */}
        {currentStep === 4 && (
          <PropertyProfileStep
            theme={theme}
            // Plot/Land fields
            plotArea={plotArea}
            setPlotArea={setPlotArea}
            landArea={landArea}
            setLandArea={setLandArea}
            plotAreaUnit={plotAreaUnit}
            setPlotAreaUnit={setPlotAreaUnit}
            length={length}
            setLength={setLength}
            breadth={breadth}
            setBreadth={setBreadth}
            facing={facing}
            setFacing={setFacing}
            frontage={frontage}
            setFrontage={setFrontage}
            price={price}
            setPrice={setPrice}
            advance={advance}
            setAdvance={setAdvance}
            // Residential fields
            bedrooms={bedrooms}
            setBedrooms={setBedrooms}
            bathrooms={bathrooms}
            setBathrooms={setBathrooms}
            balconies={balconies}
            setBalconies={setBalconies}
            poojaRoom={poojaRoom}
            setPoojaRoom={setPoojaRoom}
            carpetArea={carpetArea}
            setCarpetArea={setCarpetArea}
            builtArea={builtArea}
            setBuiltArea={setBuiltArea}
            superBuiltArea={superBuiltArea}
            setSuperBuiltArea={setSuperBuiltArea}
            areaUnit={areaUnit}
            setAreaUnit={setAreaUnit}
            parkingType={parkingType}
            setParkingType={setParkingType}
            closedParking={closedParking}
            setClosedParking={setClosedParking}
            openParking={openParking}
            setOpenParking={setOpenParking}
            status={status}
            setStatus={setStatus}
            possession={possession}
            setPossession={setPossession}
            ageOfProperty={ageOfProperty}
            setAgeOfProperty={setAgeOfProperty}
            flatNumber={flatNumber}
            setFlatNumber={setFlatNumber}
            units={units}
            setUnits={setUnits}
            officeNumber={officeNumber}
            setOfficeNumber={setOfficeNumber}
            shopNumber={shopNumber}
            setShopNumber={setShopNumber}
            totalFloors={totalFloors}
            setTotalFloors={setTotalFloors}
            propertyOnFloor={propertyOnFloor}
            setPropertyOnFloor={setPropertyOnFloor}
            // Commercial fields
            roadWidth={roadWidth}
            setRoadWidth={setRoadWidth}
            cornerShop={cornerShop}
            setCornerShop={setCornerShop}
            pantryAvailable={pantryAvailable}
            setPantryAvailable={setPantryAvailable}
            washroomAvailable={washroomAvailable}
            setWashroomAvailable={setWashroomAvailable}
            liftAvailable={liftAvailable}
            setLiftAvailable={setLiftAvailable}
            powerBackup={powerBackup}
            setPowerBackup={setPowerBackup}
            acAvailable={acAvailable}
            setAcAvailable={setAcAvailable}
            furnishedStatus={furnishedStatus}
            setFurnishedStatus={setFurnishedStatus}
            cabins={cabins}
            setCabins={setCabins}
            conferenceRooms={conferenceRooms}
            setConferenceRooms={setConferenceRooms}
            workstations={workstations}
            setWorkstations={setWorkstations}
            parkingSpaces={parkingSpaces}
            setParkingSpaces={setParkingSpaces}
            securityAvailable={securityAvailable}
            setSecurityAvailable={setSecurityAvailable}
            waterSupply={waterSupply}
            setWaterSupply={setWaterSupply}
            // Property type info
            listingType={listingType}
            propertySubtype={propertySubtype}
            isPlotOrLand={isPlotOrLand}
            isLand={isLand}
            isFlatOrVilla={isFlatOrVilla}
            isVilla={isVilla}
            isFlat={isFlat}
            isPlot={isPlot}
            isOfficeSpace={isOfficeSpace}
            isShopShowroom={isShopShowroom}
            needsFloorDetails={needsFloorDetails}
            needsUnitNumber={needsUnitNumber}
            canHaveCommercialAddons={canHaveCommercialAddons}
            facingOptions={facingOptions}
          />
        )}

        {/* Step 5: Pricing & Others */}
        {currentStep === 5 && (
          <PricingOthersStep
            theme={theme}
            description={description}
            setDescription={setDescription}
            privateNotes={privateNotes}
            setPrivateNotes={setPrivateNotes}
            approvedBy={approvedBy}
            toggleApprovedBy={toggleApprovedBy}
            amenities={amenities}
            toggleAmenity={toggleAmenity}
            amenitiesOptions={amenitiesOptions}
            approvedOptions={approvedOptions}
            listingType={listingType}
            propertySubtype={propertySubtype}
            price={price}
            propertyName={propertyName}
            city={city}
            locality={locality}
            isPlotOrLand={isPlotOrLand}
            isFlatOrVilla={isFlatOrVilla}
          />
        )}
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavigation
        theme={theme}
        insets={insets}
        currentStep={currentStep}
        handleBack={handleBack}
        handleNext={handleNext}
        handleSubmit={handleSubmit}
      />
    </View>
  );
}