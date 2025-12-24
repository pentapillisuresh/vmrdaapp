// hooks/usePostPropertyForm.js
import { useState } from "react";
import { Alert } from "react-native";
import { router } from "expo-router";

export function usePostPropertyForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});

  // 🏠 Step 1: Basic Details (Category, Property Type, Title)
  const [listingType, setListingType] = useState("Sale");
  const [propertyType, setPropertyType] = useState("residential");
  const [propertySubtype, setPropertySubtype] = useState("");
  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState("");

  // 📍 Step 2: Location Details
  const [propertyName, setPropertyName] = useState("");
  const [city, setCity] = useState("");
  const [locality, setLocality] = useState("");
  const [subLocality, setSubLocality] = useState("");
  const [apartmentDoorNo, setApartmentDoorNo] = useState("");
  const [roadFacing, setRoadFacing] = useState("");
  const [pincode, setPincode] = useState("");
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [advantages, setAdvantages] = useState([{ info: "", distance: "250 m" }]);

  // 📷 Step 3: Media (Photos & Videos)
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState(null);
  const [voiceOver, setVoiceOver] = useState(null);

  // 🛋️ Step 4: Property Profile (Web's PropertyProfile + Amenities)
  const [plotArea, setPlotArea] = useState(0);
  const [landArea, setLandArea] = useState(0);
  const [plotAreaUnit, setPlotAreaUnit] = useState("sq yards");
  const [length, setLength] = useState("");
  const [breadth, setBreadth] = useState("");
  const [facing, setFacing] = useState("");
  const [frontage, setFrontage] = useState("");
  const [price, setPrice] = useState("");
  const [advance, setAdvance] = useState("");
  
  // Apartment/Villa fields
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [balconies, setBalconies] = useState("");
  const [poojaRoom, setPoojaRoom] = useState(true);
  const [carpetArea, setCarpetArea] = useState("");
  const [builtArea, setBuiltArea] = useState("");
  const [superBuiltArea, setSuperBuiltArea] = useState("");
  const [areaUnit, setAreaUnit] = useState("sqft");
  const [parkingType, setParkingType] = useState("");
  const [closedParking, setClosedParking] = useState(0);
  const [openParking, setOpenParking] = useState(0);
  const [status, setStatus] = useState("Ready to Move");
  const [possession, setPossession] = useState("");
  const [ageOfProperty, setAgeOfProperty] = useState("");
  const [flatNumber, setFlatNumber] = useState("");
  const [units, setUnits] = useState(0);
  const [officeNumber, setOfficeNumber] = useState("");
  const [shopNumber, setShopNumber] = useState("");
  const [totalFloors, setTotalFloors] = useState("");
  const [propertyOnFloor, setPropertyOnFloor] = useState("");
  
  // Commercial fields
  const [roadWidth, setRoadWidth] = useState(0);
  const [cornerShop, setCornerShop] = useState(false);
  const [pantryAvailable, setPantryAvailable] = useState(false);
  const [washroomAvailable, setWashroomAvailable] = useState(false);
  const [liftAvailable, setLiftAvailable] = useState(false);
  const [powerBackup, setPowerBackup] = useState(false);
  const [acAvailable, setAcAvailable] = useState(false);
  const [furnishedStatus, setFurnishedStatus] = useState("unfurnished");
  const [cabins, setCabins] = useState("");
  const [conferenceRooms, setConferenceRooms] = useState("");
  const [workstations, setWorkstations] = useState("");
  const [parkingSpaces, setParkingSpaces] = useState("");
  const [securityAvailable, setSecurityAvailable] = useState(false);
  const [waterSupply, setWaterSupply] = useState("");

  // 🏢 Step 5: Pricing & Others (Description, Approved By, Amenities)
  const [description, setDescription] = useState("");
  const [privateNotes, setPrivateNotes] = useState("");
  const [approvedBy, setApprovedBy] = useState([]);
  const [amenities, setAmenities] = useState([]);

  // 🏗️ Property type flags
  const isPlotOrLand = ["Plot", "Land", "Commercial Land", "Warehouse / Godown", "Industrial Building"].includes(propertySubtype);
  const isLand = ["Land", "Commercial Land", "Warehouse / Godown", "Industrial Building"].includes(propertySubtype);
  const isFlatOrVilla = ["Flat/Apartment", "Independent House / Villa", "IndependentHouse/Villa"].includes(propertySubtype);
  const isVilla = ["Independent House / Villa", "IndependentHouse/Villa", "Farmhouse"].includes(propertySubtype);
  const isFlat = propertySubtype === "Flat/Apartment";
  const isPlot = propertySubtype === "Plot";
  const isOfficeSpace = propertySubtype === "Office Space";
  const isShopShowroom = propertySubtype === "Shop / Showroom";
  const needsFloorDetails = isFlatOrVilla || isOfficeSpace || isShopShowroom;
  const needsUnitNumber = isFlat || isOfficeSpace || isShopShowroom;
  const canHaveCommercialAddons = isOfficeSpace || isShopShowroom;

  // 🎯 Category options
  const categories = [
    { id: "plot", label: "Plot", icon: "map-pin" },
    { id: "land", label: "Land", icon: "map-pin" },
    { id: "apartment", label: "Apartment", icon: "building" },
    { id: "villa", label: "Villa", icon: "home" },
    { id: "commercial", label: "Commercial", icon: "briefcase" },
    { id: "shop", label: "Shop", icon: "store" },
    { id: "office", label: "Office", icon: "briefcase" },
    { id: "warehouse", label: "Warehouse", icon: "warehouse" },
    { id: "farmhouse", label: "Farmhouse", icon: "home" },
  ];

  // 🏠 Subtype mapping
  const getSubtypes = () => {
    if (propertyType === "residential") {
      return listingType.toLowerCase() === "sale"
        ? ["Plot", "Flat/Apartment", "IndependentHouse/Villa", "Land", "FarmHouse"]
        : ["Flat/Apartment", "IndependentHouse/Villa", "FarmHouse", "Plot", "Land"];
    } else {
      return ["Office Space", "Shop / Showroom", "Commercial Land", "Warehouse / Godown", "Industrial Building"];
    }
  };

  // 🏗️ Amenities options
  const amenitiesOptions = [
    'Security',
    'Maintenance Staff',
    'Clubhouse',
    'Park / Garden',
    'Gym / Rooms',
    'Swimming Pool',
    'Wi-Fi',
    'Lift',
    'Power Backup'
  ];

  // ✅ Approved By options
  const approvedOptions = ['VMRDA', 'VUDA', 'DTCP', 'LRS', 'GVMC', 'RERA', 'Bank Loan'];

  // ✅ Facing options
  const facingOptions = ["East", "West", "North", "South", "North-East", "North-West", "South-East", "South-West"];

  // ✅ Form validation
  const validateStep = (step) => {
    switch (step) {
      case 1: // Basic Details
        if (!title.trim()) {
          setTitleError('Property title is required');
          return false;
        }
        if (title.trim().length < 5) {
          setTitleError('Property title must be at least 5 characters');
          return false;
        }
        if (title.trim().length > 70) {
          setTitleError('Property title cannot exceed 70 characters');
          return false;
        }
        if (!propertySubtype) {
          Alert.alert("Required", "Please select a property type");
          return false;
        }
        setTitleError('');
        return true;

      case 2: // Location Details
        if (!city) {
          Alert.alert("Required", "Please select a city");
          return false;
        }
        if (!locality) {
          Alert.alert("Required", "Please select a locality");
          return false;
        }
        if (!roadFacing || parseInt(roadFacing) <= 0) {
          Alert.alert("Required", "Please enter a valid road facing value");
          return false;
        }
        
        // Check if project name is required
        const isProjectNameRequired = !((propertySubtype || "").toLowerCase().includes("land") || listingType.toLowerCase() === "rent");
        if (isProjectNameRequired) {
          if (!propertyName.trim()) {
            Alert.alert("Required", "Project name is required");
            return false;
          }
          if (propertyName.trim().length < 10) {
            Alert.alert("Required", "Project name must be at least 10 characters");
            return false;
          }
          if (propertyName.trim().length > 50) {
            Alert.alert("Required", "Project name cannot exceed 50 characters");
            return false;
          }
        }
        return true;

      case 3: // Media
        // Photos are optional but recommended
        return true;

      case 4: // Property Profile
        if (isPlotOrLand) {
          if (!price) {
            Alert.alert("Required", "Please enter the price");
            return false;
          }
          if (!plotAreaUnit) {
            Alert.alert("Required", "Please select area unit");
            return false;
          }
          if (isLand) {
            if (!frontage) {
              Alert.alert("Required", "Please enter road facing");
              return false;
            }
            if (!landArea) {
              Alert.alert("Required", "Please enter land area");
              return false;
            }
          } else {
            if (!plotArea) {
              Alert.alert("Required", "Please enter plot area");
              return false;
            }
            if (!facing) {
              Alert.alert("Required", "Please select facing direction");
              return false;
            }
            if (!length || !breadth) {
              Alert.alert("Required", "Please enter length and width");
              return false;
            }
          }
        } else {
          if (!price) {
            Alert.alert("Required", "Please enter the price");
            return false;
          }
          if (!carpetArea && !builtArea && !superBuiltArea) {
            Alert.alert("Required", "Please enter at least one area (carpet/built/super built)");
            return false;
          }
          if (!areaUnit) {
            Alert.alert("Required", "Please select area unit");
            return false;
          }
          if (isFlatOrVilla) {
            if (!bedrooms) {
              Alert.alert("Required", "Please select number of bedrooms");
              return false;
            }
            if (!bathrooms) {
              Alert.alert("Required", "Please select number of bathrooms");
              return false;
            }
            if (balconies === null || balconies === undefined) {
              Alert.alert("Required", "Please select number of balconies");
              return false;
            }
          }
          if (needsFloorDetails && !totalFloors) {
            Alert.alert("Required", "Please enter total floors");
            return false;
          }
          if (!status) {
            Alert.alert("Required", "Please select availability status");
            return false;
          }
          if (status === "Ready to Move" && !ageOfProperty) {
            Alert.alert("Required", "Please enter age of property");
            return false;
          }
          if (status === "Under Construction" && !possession) {
            Alert.alert("Required", "Please enter possession timeline");
            return false;
          }
        }
        return true;

      case 5: // Pricing & Others
        if (!description || description.trim().length < 10) {
          Alert.alert("Required", "Description must be at least 10 characters");
          return false;
        }
        return true;

      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) {
      return;
    }

    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    if (!validateStep(5)) {
      return;
    }

    // Compile all data
    const finalData = {
      // Step 1
      listingType,
      propertyType,
      propertySubtype,
      title,
      
      // Step 2
      propertyName,
      city,
      locality,
      subLocality,
      apartmentDoorNo,
      roadFacing,
      pincode,
      lat,
      lon,
      advantages,
      
      // Step 3
      photos,
      videos,
      voiceOver,
      
      // Step 4
      plotArea,
      landArea,
      plotAreaUnit,
      length,
      breadth,
      facing,
      frontage,
      price,
      advance,
      bedrooms,
      bathrooms,
      balconies,
      poojaRoom,
      carpetArea,
      builtArea,
      superBuiltArea,
      areaUnit,
      parkingType,
      closedParking,
      openParking,
      status,
      possession,
      ageOfProperty,
      flatNumber,
      units,
      officeNumber,
      shopNumber,
      totalFloors,
      propertyOnFloor,
      roadWidth,
      cornerShop,
      pantryAvailable,
      washroomAvailable,
      liftAvailable,
      powerBackup,
      acAvailable,
      furnishedStatus,
      cabins,
      conferenceRooms,
      workstations,
      parkingSpaces,
      securityAvailable,
      waterSupply,
      
      // Step 5
      description,
      privateNotes,
      approvedBy,
      amenities: amenitiesOptions.filter(opt => amenities.includes(opt)),
    };

    console.log("Property Data:", finalData);
    
    Alert.alert(
      "Success!",
      "Your property has been submitted for verification.",
      [
        {
          text: "OK",
          onPress: () => router.push("/(tabs)/my-listings"),
        },
      ]
    );
  };

  // Helper functions
  const toggleApprovedBy = (option) => {
    if (approvedBy.includes(option)) {
      setApprovedBy(approvedBy.filter(item => item !== option));
    } else {
      setApprovedBy([...approvedBy, option]);
    }
  };

  const toggleAmenity = (amenity) => {
    if (amenities.includes(amenity)) {
      setAmenities(amenities.filter(item => item !== amenity));
    } else {
      setAmenities([...amenities, amenity]);
    }
  };

  const addAdvantage = () => {
    if (advantages.length < 8) {
      setAdvantages([...advantages, { info: "", distance: "250 m" }]);
    }
  };

  const removeAdvantage = (index) => {
    const updated = [...advantages];
    updated.splice(index, 1);
    setAdvantages(updated);
  };

  const updateAdvantage = (index, key, value) => {
    const updated = [...advantages];
    updated[index][key] = value;
    setAdvantages(updated);
  };

  return {
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
    voiceOver,
    setVoiceOver,
    
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
  };
}