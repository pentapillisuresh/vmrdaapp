// components/PostProperty/StepIndicators.js
import { View } from "react-native";

export function StepIndicators({ steps, currentStep, theme }) {
  return (
    <View
      style={{
        flexDirection: "row",
        paddingHorizontal: 20,
        paddingVertical: 16,
        gap: 8,
      }}
    >
      {steps.map((step) => (
        <View
          key={step.number}
          style={{
            flex: 1,
            height: 4,
            borderRadius: 2,
            backgroundColor:
              step.number <= currentStep
                ? theme.colors.primary
                : theme.colors.border,
          }}
        />
      ))}
    </View>
  );
}