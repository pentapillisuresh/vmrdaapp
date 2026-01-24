// components/PostProperty/BottomNavigation.js
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { ChevronLeft, ChevronRight } from "lucide-react-native";

export function BottomNavigation({
  theme,
  insets,
  currentStep,
  handleBack,
  handleNext,
  handleSubmit,
  isSubmitting = false,
}) {
  return (
    <View
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: theme.colors.background,
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: insets.bottom + 16,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
        ...theme.elevation.modal,
      }}
    >
      <View style={{ flexDirection: "row", gap: 12 }}>
        {currentStep > 1 && !isSubmitting && (
          <TouchableOpacity
            onPress={handleBack}
            style={{
              flex: 1,
              backgroundColor: theme.colors.surface,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: theme.colors.border,
              paddingVertical: 16,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
            activeOpacity={0.7}
            disabled={isSubmitting}
          >
            <ChevronLeft
              size={20}
              color={theme.colors.text}
              strokeWidth={1.5}
            />
            <Text
              style={{
                fontSize: 16,
                fontFamily: "Poppins_600SemiBold",
                color: theme.colors.text,
              }}
            >
              Back
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={currentStep === 5 ? handleSubmit : handleNext}
          style={{
            flex: currentStep > 1 && !isSubmitting ? 2 : 1,
            backgroundColor: isSubmitting ? theme.colors.primary + "80" : theme.colors.primary,
            borderRadius: 12,
            paddingVertical: 16,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
          activeOpacity={0.8}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <ActivityIndicator size="small" color="#FFFFFF" />
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: "Poppins_600SemiBold",
                  color: "#FFFFFF",
                }}
              >
                Submitting...
              </Text>
            </>
          ) : (
            <>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: "Poppins_600SemiBold",
                  color: "#FFFFFF",
                }}
              >
                {currentStep === 5 ? "Submit Property" : "Next"}
              </Text>
              {currentStep < 5 && (
                <ChevronRight size={20} color="#FFFFFF" strokeWidth={1.5} />
              )}
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}